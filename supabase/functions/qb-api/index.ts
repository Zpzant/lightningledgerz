// qb-api — admin-only JSON proxy to QuickBooks Online.
// The missing piece: reads the tokens qb-token-exchange stored in qb_connections
// and pulls real financials from the QBO v3 API (with automatic token refresh).
//
// Deploy: supabase functions deploy qb-api --project-ref uxicgilvxcqpoxavilxp
//
// POST { action, realmId?, params? }   (Authorization: Bearer <supabase session token>)
//   action "connections"           -> sanitized list of connected QB companies (no tokens)
//   action "company"   {realmId}   -> QBO CompanyInfo
//   action "report"    {realmId, params:{name, query:{...}}} -> QBO report JSON
//   action "query"     {realmId, params:{q}} -> QBO SQL-ish SELECT query
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";

const QB_CLIENT_ID = Deno.env.get("QB_CLIENT_ID") || "";
const QB_CLIENT_SECRET = Deno.env.get("QB_CLIENT_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
// "production" unless QB_ENV secret says otherwise (sandbox for Development keys)
const QB_ENV = (Deno.env.get("QB_ENV") || "production").toLowerCase();
const QB_API_BASE = QB_ENV === "sandbox"
  ? "https://sandbox-quickbooks.api.intuit.com"
  : "https://quickbooks.api.intuit.com";

// Same admin convention as admin-dashboard.js / RLS policies.
const ADMIN_EMAIL_FALLBACK = "zpzant@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const REPORT_WHITELIST = new Set([
  "ProfitAndLoss", "ProfitAndLossDetail", "BalanceSheet", "CashFlow",
  "CustomerIncome", "AgedReceivables", "AgedPayables", "GeneralLedger", "TrialBalance",
  "BudgetVsActuals",
]);

class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function requireAdmin(req: Request, db: SupabaseClient) {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) throw new HttpError(401, "Not authenticated");
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) throw new HttpError(401, "Invalid auth token");
  if ((user.email || "").toLowerCase() === ADMIN_EMAIL_FALLBACK) return user;
  const { data: profile } = await db.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (profile?.is_admin !== true) throw new HttpError(403, "Admin only");
  return user;
}

async function tokenGrant(params: Record<string, string>) {
  const basic = btoa(`${QB_CLIENT_ID}:${QB_CLIENT_SECRET}`);
  const res = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams(params).toString(),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new HttpError(502, `Intuit token refresh failed: ${data.error_description || data.error || res.status}`);
  }
  return data as {
    access_token: string; refresh_token: string;
    expires_in: number; x_refresh_token_expires_in: number;
  };
}

/** Newest connection row for a realm, with a valid (refreshed if needed) access token. */
async function freshAccessToken(db: SupabaseClient, realmId: string): Promise<string> {
  const { data: conns, error } = await db.from("qb_connections")
    .select("*").eq("realm_id", realmId)
    .order("updated_at", { ascending: false }).limit(1);
  if (error || !conns?.length) throw new HttpError(404, `No QuickBooks connection for company ${realmId}. Connect it from the portal first.`);
  const conn = conns[0];

  const expiry = conn.token_expiry ? new Date(conn.token_expiry).getTime() : 0;
  if (expiry - Date.now() > 120_000) return conn.access_token;

  if (conn.refresh_token_expiry && new Date(conn.refresh_token_expiry).getTime() < Date.now()) {
    throw new HttpError(409, "QuickBooks refresh token expired — reconnect the company from the portal.");
  }
  const tok = await tokenGrant({ grant_type: "refresh_token", refresh_token: conn.refresh_token });
  await db.from("qb_connections").update({
    access_token: tok.access_token,
    refresh_token: tok.refresh_token,
    token_expiry: new Date(Date.now() + tok.expires_in * 1000).toISOString(),
    refresh_token_expiry: new Date(Date.now() + tok.x_refresh_token_expires_in * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", conn.id);
  return tok.access_token;
}

async function qboGet(db: SupabaseClient, realmId: string, path: string): Promise<unknown> {
  const token = await freshAccessToken(db, realmId);
  const url = `${QB_API_BASE}/v3/company/${realmId}${path}${path.includes("?") ? "&" : "?"}minorversion=75`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new HttpError(502, `QuickBooks API ${res.status} on ${path.split("?")[0]}: ${text.slice(0, 280)}`);
  }
  return await res.json();
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (!QB_CLIENT_ID || !QB_CLIENT_SECRET) throw new HttpError(500, "QB secrets not configured");
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    await requireAdmin(req, db);

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "");

    if (action === "connections") {
      const { data: conns } = await db.from("qb_connections")
        .select("user_id, realm_id, connected_at, updated_at, token_expiry, refresh_token_expiry")
        .order("updated_at", { ascending: false });
      const userIds = [...new Set((conns || []).map((c) => c.user_id).filter(Boolean))];
      let profiles: Record<string, { email?: string; full_name?: string }> = {};
      if (userIds.length) {
        const { data: profs } = await db.from("profiles").select("id, email, full_name").in("id", userIds);
        profiles = Object.fromEntries((profs || []).map((p) => [p.id, p]));
      }
      const out = (conns || []).map((c) => ({
        realm_id: c.realm_id,
        connected_at: c.connected_at,
        updated_at: c.updated_at,
        refresh_expires_at: c.refresh_token_expiry,
        owner_email: profiles[c.user_id]?.email || null,
        owner_name: profiles[c.user_id]?.full_name || null,
      }));
      return json({ connections: out });
    }

    const realmId = String(body?.realmId || "");
    if (!realmId) throw new HttpError(400, "realmId required");

    if (action === "company") {
      return json(await qboGet(db, realmId, `/companyinfo/${realmId}`));
    }

    if (action === "report") {
      const name = String(body?.params?.name || "");
      if (!REPORT_WHITELIST.has(name)) throw new HttpError(400, `Report not allowed: ${name}`);
      const q = body?.params?.query || {};
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(q).map(([k, v]) => [k, String(v)])),
      ).toString();
      return json(await qboGet(db, realmId, `/reports/${name}${qs ? "?" + qs : ""}`));
    }

    if (action === "query") {
      const q = String(body?.params?.q || "");
      if (!/^\s*select\s/i.test(q)) throw new HttpError(400, "Only SELECT queries allowed");
      return json(await qboGet(db, realmId, `/query?query=${encodeURIComponent(q)}`));
    }

    throw new HttpError(400, `Unknown action: ${action}`);
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    return json({ error: String((e as Error)?.message ?? e) }, status);
  }
});
