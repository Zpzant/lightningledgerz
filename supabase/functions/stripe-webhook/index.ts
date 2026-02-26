import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!
const ZAC_EMAIL = 'zprizant@lightningledgerz.com'

async function notifyZac(subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'notifications@lightningledgerz.com',
      to: ZAC_EMAIL,
      subject,
      html,
    }),
  })
}

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  console.log('Stripe event received:', event.type)

  try {
    switch (event.type) {

      // ── Trial / subscription started ──────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id  // Supabase user ID we passed
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        const email = session.customer_details?.email || session.customer_email

        if (userId) {
          await supabase.from('profiles').update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'trialing',
            trial_started_at: new Date().toISOString(),
          }).eq('id', userId)

          await notifyZac(
            '⚡ New trial started',
            `<p>A new client just started their free trial.</p>
             <p><strong>Email:</strong> ${email || 'unknown'}</p>
             <p><strong>Supabase user ID:</strong> ${userId}</p>
             <p><strong>Stripe customer:</strong> ${customerId}</p>`
          )
        }
        break
      }

      // ── Subscription updated (active, past_due, etc.) ─────────────────
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        const status = sub.status  // trialing | active | past_due | canceled | unpaid
        const planNickname = sub.items.data[0]?.price?.nickname?.toLowerCase() || null

        await supabase.from('profiles').update({
          subscription_status: status,
          ...(planNickname ? { subscription_plan: planNickname } : {}),
        }).eq('stripe_customer_id', customerId)

        // Alert Zac if payment fails
        if (status === 'past_due') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('stripe_customer_id', customerId)
            .single()

          await notifyZac(
            '⚠️ Payment failed — client past due',
            `<p>A client's payment has failed.</p>
             <p><strong>Name:</strong> ${profile?.first_name || 'Unknown'}</p>
             <p><strong>Stripe customer:</strong> ${customerId}</p>
             <p>Check the Stripe dashboard for details.</p>`
          )
        }

        // Alert Zac when trial converts to active (money!)
        if (status === 'active') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('stripe_customer_id', customerId)
            .single()

          await notifyZac(
            '💰 Trial converted — new paying client!',
            `<p>A client's trial just converted to a paid subscription.</p>
             <p><strong>Name:</strong> ${profile?.first_name || 'Unknown'}</p>
             <p><strong>Plan:</strong> ${planNickname || 'unknown'}</p>
             <p><strong>Stripe customer:</strong> ${customerId}</p>`
          )
        }
        break
      }

      // ── Subscription canceled / deleted ───────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('stripe_customer_id', customerId)
          .single()

        await supabase.from('profiles').update({
          subscription_status: 'expired',
        }).eq('stripe_customer_id', customerId)

        await notifyZac(
          '❌ Subscription canceled',
          `<p>A client has canceled their subscription.</p>
           <p><strong>Name:</strong> ${profile?.first_name || 'Unknown'}</p>
           <p><strong>Stripe customer:</strong> ${customerId}</p>
           <p>Consider reaching out within 24 hours.</p>`
        )
        break
      }

      // ── Payment failed ────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        await supabase.from('profiles').update({
          subscription_status: 'past_due',
        }).eq('stripe_customer_id', customerId)
        break
      }

      // ── Payment succeeded (clears past_due) ──────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Only update if currently past_due (don't overwrite active/trialing)
        await supabase.from('profiles')
          .update({ subscription_status: 'active' })
          .eq('stripe_customer_id', customerId)
          .eq('subscription_status', 'past_due')
        break
      }

    }
  } catch (err) {
    console.error('Error processing event:', event.type, err)
    // Return 200 anyway so Stripe doesn't retry — log the error
  }

  return new Response('ok', { status: 200 })
})
