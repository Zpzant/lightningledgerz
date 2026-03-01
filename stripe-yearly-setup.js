/**
 * Lightning Ledgerz — Stripe Yearly Subscription Setup
 *
 * Creates yearly subscription products + payment links for Basic, Gold, Diamond.
 * Apple Pay & Google Pay are enabled automatically via your Stripe account settings.
 *
 * SETUP:
 *   1. Install: npm install stripe
 *   2. Paste your Stripe SECRET key below (starts with sk_live_ or sk_test_)
 *   3. Run: node stripe-yearly-setup.js
 *   4. Copy the 3 payment link URLs into index.html STRIPE_URLS.yearly
 */

const Stripe = require('stripe');

// ─── PASTE YOUR STRIPE SECRET KEY HERE ───────────────────────────────────────
const STRIPE_SECRET_KEY = 'sk_live_XXXXXXXXXXXXXXXXXXXX';
// ─────────────────────────────────────────────────────────────────────────────

const stripe = new Stripe(STRIPE_SECRET_KEY);

const PLANS = [
  {
    key: 'basic',
    name: 'Lightning Ledgerz — Basic (Annual)',
    description: 'Comprehensive budget creation, monthly financial reporting, basic financial analysis, variance commentary, email support.',
    yearlyPrice: 766800, // $7,668.00 in cents ($639/mo × 12, save $1,920/yr)
    monthlyEquiv: '$639/mo',
    savingsPerYear: '$1,920',
  },
  {
    key: 'gold',
    name: 'Lightning Ledgerz — Gold (Annual)',
    description: 'Everything in Basic + weekly strategic calls, advanced financial modeling, cash flow optimization, KPI dashboard creation, priority support.',
    yearlyPrice: 1246800, // $12,468.00 in cents ($1,039/mo × 12, save $3,120/yr)
    monthlyEquiv: '$1,039/mo',
    savingsPerYear: '$3,120',
  },
  {
    key: 'diamond',
    name: 'Lightning Ledgerz — Diamond (Annual)',
    description: 'Everything in Gold + fractional CFO services, complete strategic planning, investment & funding guidance, board presentation support, direct phone access.',
    yearlyPrice: 3838800, // $38,388.00 in cents ($3,199/mo × 12, save $9,600/yr)
    monthlyEquiv: '$3,199/mo',
    savingsPerYear: '$9,600',
  },
];

async function setup() {
  console.log('\n⚡ Lightning Ledgerz — Stripe Yearly Setup\n');

  const results = {};

  for (const plan of PLANS) {
    console.log(`Creating ${plan.key.toUpperCase()} plan...`);

    // 1. Create product
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: {
        tier: plan.key,
        billing: 'yearly',
        monthly_equiv: plan.monthlyEquiv,
        savings_per_year: plan.savingsPerYear,
      },
    });

    // 2. Create yearly price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.yearlyPrice,
      currency: 'usd',
      recurring: {
        interval: 'year',
        interval_count: 1,
      },
      metadata: {
        tier: plan.key,
        billing: 'yearly',
      },
    });

    // 3. Create payment link
    //    Apple Pay & Google Pay are enabled automatically if turned on
    //    in your Stripe Dashboard → Settings → Payment Methods
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      billing_address_collection: 'auto',
      payment_method_types: ['card'],  // card covers Apple Pay + Google Pay
      after_completion: {
        type: 'redirect',
        redirect: {
          url: 'https://lightningledgerz.com/?payment=success',
        },
      },
      metadata: {
        tier: plan.key,
        billing: 'yearly',
      },
    });

    results[plan.key] = paymentLink.url;
    console.log(`  ✅ ${plan.key}: ${paymentLink.url}`);
  }

  console.log('\n────────────────────────────────────────────────────');
  console.log('COPY THESE INTO index.html → STRIPE_URLS.yearly:\n');
  console.log(`  basic:   '${results.basic}',`);
  console.log(`  gold:    '${results.gold}',`);
  console.log(`  diamond: '${results.diamond}'`);
  console.log('────────────────────────────────────────────────────\n');
}

setup().catch(err => {
  console.error('\n❌ Error:', err.message);
  if (err.message.includes('No API key')) {
    console.error('→ Paste your Stripe secret key at the top of this file.\n');
  }
});
