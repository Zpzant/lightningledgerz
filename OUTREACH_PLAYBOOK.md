# Lightning Ledgerz — Cold Outreach Playbook

The honest plan for going from zero to paying clients in 4–8 weeks. Read top to bottom once before doing anything. Total cost: **~$80–150/month in tools.** Total Zac time: **~5 hours setup, then ~1 hour/day.**

---

## DON'T DO THIS (the things that will tank you)

These will feel fast. They will end your business.

### 1. Don't scrape LinkedIn
- LinkedIn explicitly forbids scraping in their Terms of Service.
- They detect it within hours. They will **permanently ban your account**, including your real profile (the one Cornell people connect to you on).
- Microsoft (LinkedIn's parent) has won lawsuits against scrapers (hiQ Labs).
- I will not write a LinkedIn scraper for you. Don't pay anyone else to either.

### 2. Don't scrape Google search results
- Google blocks scraper IPs and starts CAPTCHA-walling within minutes of bulk requests.
- The data you'd get is messy and incomplete anyway.

### 3. Don't bulk-send cold email from `lightningledgerz.com`
- Sending 200+ unsolicited emails/day from your main domain will get **lightningledgerz.com permanently blacklisted** by Gmail / Outlook / Yahoo.
- Once blacklisted, your password-reset emails, client onboarding emails, invoice emails — everything stops landing.
- Recovery from blacklist can take months and sometimes never happens.

### 4. Don't BCC / CC yourself on outbound cold mail
- You correctly caught this in your own brief. CC tanks deliverability and looks unprofessional. Use the cold-email platform's reporting dashboard to see opens/replies — that's better than a CC anyway.

---

## DO THIS INSTEAD (the path that actually works)

### Week 0: tools + secondary domain (~2 hours, ~$80–150/mo)

**1. Buy a secondary sending domain.** Examples that signal "we're the same brand" without putting the main domain at risk:
   - `lightningledgerz.io`
   - `getlightningledgerz.com`
   - `try-lightningledgerz.com`

   ~$12/year at Namecheap / Cloudflare Registrar. **All cold email comes from this domain.** Replies still forward to `zprizant@lightningledgerz.com` (set up forwarding).

**2. Sign up for the lead-data tool.** Pick ONE:
   - **Apollo.io** — $49/mo (Basic) or $99/mo (Professional). Best B2B contact data, includes verified emails. Search filters: industry, company size, location, title. Florida SMBs in your target industries — easy to pull 1,000 contacts in 10 minutes. 100% legal.
   - **Hunter.io** — cheaper alternative ($49/mo) for finding email addresses given company domain + name. Good if you already have a list of companies.
   - **RocketReach** / **ZoomInfo** — pricier, mostly for enterprise.

   **Recommendation: start with Apollo.io.**

**3. Sign up for the cold-email sending tool.** Pick ONE:
   - **Smartlead.ai** — $39/mo (10 inboxes) or $94/mo (100 inboxes). Includes email warmup. Best deliverability for solo operators. Recommended.
   - **Instantly.ai** — $37/mo. Similar to Smartlead, also recommended.
   - **Lemlist** / **Mailshake** — slicker UI but more expensive.

   **Recommendation: Smartlead.ai $39/mo plan.**

**4. Set up DKIM, SPF, DMARC** on the secondary sending domain. The cold-email tool walks you through it — it's about 5 DNS records added at your registrar. Skip this and your emails go to spam, period.

**5. Create 2–3 sending inboxes** on the new domain (Google Workspace = $7/mo per inbox, or Microsoft 365 = $6/mo). Examples:
   - `zac@lightningledgerz.io` (primary, replies forward to your main)
   - `hello@lightningledgerz.io`
   - `team@lightningledgerz.io`

   3 inboxes × 30 emails/day = 90 emails/day at full ramp. That's 450/week or **~2,000/month**.

**Total monthly cost:**
- Apollo.io Basic: $49
- Smartlead.ai: $39
- Domain: $1
- Workspace inboxes (3): $21
- **= ~$110/mo**

One client at the Basic tier ($799/mo) covers this **7×** over.

### Week 1: warm up the inboxes (do nothing fancy, just wait)

In Smartlead, turn on **email warmup** for each new inbox. The tool sends 10–30 emails per day between thousands of trusted inboxes for ~14 days. This builds a sender reputation so when you start cold sending, Gmail/Outlook trust you.

**Do not skip this.** Sending cold from a brand-new inbox = instant spam folder.

### Week 2: build the lead list (1 hour)

In Apollo.io:
- Filter: **State = Florida** (start home), then expand to TX/NC/GA/SC/AZ over time
- Filter: **Industry** = whatever industries you can deliver well for. Recommended starters that match an FP&A/bookkeeping pitch:
  - Construction & contractors ($1M–$50M revenue)
  - Healthcare practices (dental, vet, MedSpa)
  - Restaurants & hospitality (multi-location)
  - Professional services (law, architecture, agencies)
  - Manufacturing & wholesale ($2M–$25M revenue)
- Filter: **Title** = Owner, Founder, CEO, CFO, COO, Controller, President
- Filter: **Company size** = 5–200 employees (sweet spot for fractional CFO services)

Export 500–1,000 contacts as CSV.

The columns Apollo gives you map cleanly to my template at [`outreach/leads-template.csv`](outreach/leads-template.csv) — you can upload Apollo's CSV directly to Smartlead.

### Week 3: load the campaign + send

In Smartlead:
1. **Create a new campaign** called "FL SMB — Free Month Promo".
2. **Upload the CSV.**
3. **Paste the email template** from [`outreach/cold-email-promo.html`](outreach/cold-email-promo.html). (Both Smartlead and Instantly let you paste raw HTML.)
4. **Set personalisation variables**: `{{first_name}}`, `{{company}}`. Smartlead will auto-map from CSV columns.
5. **Subject line A/B test** (Smartlead supports this natively):
   - A: `Quick question, {{first_name}}`
   - B: `30 days free for {{company}}'s books`
   - C: `Cornell-trained CFO for {{company}} — first month on me`
6. **Sending schedule**: Mon–Fri 8:00 AM – 11:00 AM ET (highest open rates for SMBs), 30 emails/day per inbox.
7. **Add a 3-step follow-up sequence** (this is where ~70% of replies come from):
   - Day 0: First send (the HTML email)
   - Day 4: Plain-text bump — "Hey {{first_name}}, want to make sure my note didn't get buried — still happy to comp the first month if a 15-min call sounds useful. Worth a look?"
   - Day 9: Plain-text breakup — "{{first_name}}, I'll stop chasing — if Lightning Ledgerz isn't a fit right now, no worries. Last note: free month + free CFO report still on the table if {{company}} wants to give it a try in the next 30 days."
8. **Reply handling**: every reply lands in `zac@lightningledgerz.io` (the inbox). Forward to your main inbox via Workspace settings. Reply within 1 business day, always.

### Week 4+: track, iterate, ramp

Smartlead gives you a dashboard:
- Open rate (target: 40%+ on subject A/B winners)
- Reply rate (target: 3–5%)
- Positive reply rate (target: 1–2% of total sends)

Math: 90 emails/day × 5 days × 4 weeks = **1,800 sends/month**. At 1.5% positive reply rate = **27 conversations/month** = **6–8 closed clients/month** if you're solid on the call. At Basic tier $799 × 6 = **$4,800/month new MRR** from outreach alone.

After 30 days, scale to 5+ inboxes if reply rate holds.

---

## What I built for you (already pushed to repo)

| Asset | Path | Purpose |
|---|---|---|
| Cold email template | [`outreach/cold-email-promo.html`](outreach/cold-email-promo.html) | Drop into Smartlead. Personalisation variables already set up. |
| Promo landing page | [`promo.html`](promo.html) | Where the email's green CTA lands. Calendly-embedded fit-call booking. |
| Brochure (PDF-ready) | [`brochure.html`](brochure.html) | Open in Chrome, click "Save as PDF" — professional 2-page brochure to attach in email or send before calls. |
| Lead CSV template | [`outreach/leads-template.csv`](outreach/leads-template.csv) | The exact column names Apollo exports use, so you can drop CSVs straight into Smartlead. |

---

## Step-by-step launch (do these in order)

1. **Save the brochure as PDF.** Open `brochure.html` in Chrome → Print → "Save as PDF" → name it `Lightning-Ledgerz-Brochure.pdf`. Keep it for emails + send before calls.

2. **Buy your secondary domain** (I recommend `lightningledgerz.io` from Cloudflare Registrar). Connect it to Google Workspace ($7/mo for one inbox to start).

3. **Sign up for Apollo.io ($49) + Smartlead.ai ($39).** Both have 7-day free trials — use them.

4. **In Smartlead: connect your new inbox + turn on warmup. Wait 14 days. Don't skip.**

5. **While waiting:** export your first lead list from Apollo. Build a 500-contact list of Florida SMBs in 2–3 industries you can credibly deliver to. Spend an hour spot-checking the data — delete obvious junk.

6. **Day 14:** create the campaign in Smartlead. Paste my HTML template. Upload CSV. Set up A/B subject lines. Add the 3-step follow-up sequence (copy from above). Schedule for Tue 8 AM ET start.

7. **Daily:** check the inbox. Reply within 4 hours when someone bites. Send the brochure PDF + Calendly link.

8. **Weekly:** look at Smartlead stats. Pause campaigns where open rate < 30% or bounce rate > 3%. Spin up new variants.

---

## Frequently asked

**"Can't I just email 1,000 people from Gmail?"**
No. Gmail caps at ~500 sends/day and any unsolicited bulk send gets your account flagged. Within 48 hours your gmail.com account is restricted, and within a week your domain reputation cliff-dives.

**"What about Mailchimp / Klaviyo / Constant Contact?"**
Those are for *opted-in* email lists (people who signed up). They explicitly prohibit cold/unsolicited email and will close your account if reported.

**"What about ChatGPT / AI to write 1000 personalized emails?"**
Smartlead has built-in AI personalisation (called "Spintax" + AI variables). Use that — it's already integrated. Don't bolt on a third tool.

**"How do I respond when someone says yes?"**
Reply with: (1) thanks, (2) the brochure PDF attached, (3) Calendly link. Get them on a 15-minute call. On the call: ask 3 questions about their finances, show them what one of your sample reports looks like, offer the free month + free report on the spot. Close.

**"What if nobody replies?"**
Two things. First check: is your subject line landing in inbox or spam? Use mail-tester.com to score your sending setup (target: 9+/10). If you score low, it's deliverability not the message. If you score high but nobody replies, change the subject line + opening sentence — email body is usually fine.

---

## Hard truths

- **You'll send ~500 emails before your first paying client.** That's normal. Don't quit at 100.
- **Most replies will be "no" or silence.** Set the expectation that 1.5% positive reply is a great rate.
- **The free-month offer will get tire-kickers.** Filter on the call — only convert ones who answer your qualifying questions seriously.
- **Don't email same person twice from different addresses.** Smartlead dedupes; respect it.
- **Florida SMB email lists go stale fast.** Refresh from Apollo every 60 days.

---

## When you have your first 5 clients

- Bump pricing on the Basic tier to $999 (you'll be busy enough that you can be selective).
- Build out Gold tier deliverables (weekly call cadence + dashboards).
- Move from cold to warm via referrals — every happy client gets asked for 2 names of peers in the next email.
- Ditch the secondary domain → start sending replies + invoices from the main `lightningledgerz.com` again. Cold from `.io`, warm from `.com`. Forever.
