/* qbo-transform.js — turn QuickBooks Online report JSON (Header/Columns/Rows tree)
 * into flat structures the Lightning Ledgerz report builder can render.
 * Pure browser JS, no dependencies. Exposed as window.QBOTransform.
 */
(function () {
  "use strict";

  function colTitles(report) {
    return (report.Columns?.Column || []).map(c => c.ColTitle || c.ColType || "");
  }

  function cellValues(row) {
    return (row.ColData || []).map(c => c?.value ?? "");
  }

  function toNum(v) {
    if (v === null || v === undefined || v === "") return 0;
    const n = parseFloat(String(v).replace(/[,$()]/g, m => (m === "(" || m === ")") ? "" : ""));
    const neg = /^\(.*\)$/.test(String(v).trim());
    return isNaN(n) ? 0 : (neg ? -Math.abs(n) : n);
  }

  /** Walk the QBO row tree; emit {label, values[], depth, kind} rows.
   *  kind: 'line' | 'sectionHeader' | 'sectionTotal'                       */
  function flattenRows(rows, depth, out) {
    (rows?.Row || []).forEach(row => {
      if (row.type === "Section" || row.Rows) {
        const header = row.Header ? cellValues(row.Header) : null;
        if (header) out.push({ label: header[0], values: header.slice(1).map(toNum), depth, kind: "sectionHeader" });
        flattenRows(row.Rows, depth + 1, out);
        const summary = row.Summary ? cellValues(row.Summary) : null;
        if (summary) out.push({ label: summary[0], values: summary.slice(1).map(toNum), depth, kind: "sectionTotal" });
      } else {
        const vals = cellValues(row);
        if (vals.length) out.push({ label: vals[0], values: vals.slice(1).map(toNum), depth, kind: "line" });
      }
    });
    return out;
  }

  /** Normalize any QBO summary report into { title, period, columns, rows }. */
  function normalize(report) {
    const h = report.Header || {};
    return {
      title: h.ReportName || "Report",
      period: { start: h.StartPeriod || null, end: h.EndPeriod || null },
      currency: h.Currency || "USD",
      columns: colTitles(report).slice(1),      // drop the label column
      rows: flattenRows(report.Rows, 0, []),
      generatedAt: h.Time || null,
    };
  }

  /** Extract headline P&L figures from a normalized ProfitAndLoss (Total column). */
  function plSummary(norm) {
    const find = (re) => norm.rows.find(r => r.kind === "sectionTotal" && re.test(r.label))
      || norm.rows.find(r => re.test(r.label));
    const last = (r) => r ? (r.values[r.values.length - 1] || 0) : 0;
    const income = last(find(/total income/i));
    const cogs = last(find(/total cost of goods sold/i));
    const gross = last(find(/gross profit/i)) || (income - cogs);
    const opex = last(find(/total expenses/i));
    const netOpIncome = last(find(/net operating income/i)) || (gross - opex);
    const netIncome = last(find(/net income/i));
    return { income, cogs, grossProfit: gross, opex, netOperatingIncome: netOpIncome, netIncome };
  }

  /** For summarize_column_by=Month reports: series per month for charting. */
  function monthlySeries(norm, labelRegex) {
    const row = norm.rows.find(r => labelRegex.test(r.label) && r.kind !== "sectionHeader");
    if (!row) return null;
    // drop the trailing "Total" column if present
    const months = norm.columns.filter(c => !/^total$/i.test(c));
    return {
      labels: months,
      values: row.values.slice(0, months.length),
    };
  }

  /** Revenue by customer from a CustomerIncome report (or Customer query fallback). */
  function revenueByCustomer(norm, topN) {
    const lines = norm.rows.filter(r => r.kind === "line");
    const items = lines
      .map(r => ({ name: r.label, value: r.values[r.values.length - 1] || 0 }))
      .filter(x => x.value !== 0)
      .sort((a, b) => b.value - a.value);
    return topN ? items.slice(0, topN) : items;
  }

  /** Budget vs Actual: find the final Actual/Budget column pair (the report's
   *  Total group) and return {label, actual, budget, variance, pct} per row. */
  function bvaRows(norm) {
    var cols = norm.columns;
    var ai = -1, bi = -1;
    for (var i = cols.length - 1; i >= 0; i--) {
      if (bi < 0 && /budget/i.test(cols[i]) && !/over|%/i.test(cols[i])) bi = i;
      if (ai < 0 && /actual/i.test(cols[i])) ai = i;
      if (ai >= 0 && bi >= 0) break;
    }
    if (ai < 0 || bi < 0) return null;
    return norm.rows
      .filter(function (r) { return r.values.length > Math.max(ai, bi); })
      .map(function (r) {
        var a = r.values[ai] || 0, b = r.values[bi] || 0;
        return {
          label: r.label, kind: r.kind, depth: r.depth,
          actual: a, budget: b, variance: a - b,
          pct: b ? a / b : null,
        };
      });
  }

  window.QBOTransform = { normalize, plSummary, monthlySeries, revenueByCustomer, bvaRows, toNum };
})();
