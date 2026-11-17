# RunMyPG growth and product roadmap

Baseline (Search Console screenshot, 17 November 2026): 3 clicks, 176 impressions, 1.7% CTR and average position 40.2 over three months. This is too little query data to claim that a title or content change alone will produce users.

## What is live now

One account for web and Android; multiple PGs; rooms and beds; tenant move-in and move-out; monthly rent invoices; paid/pending status; security deposits; owner-initiated WhatsApp reminders for pending rent. The reminder opens a draft; owners review and send it. Delivery is not tracked.

## Next product releases (web and Android together)

1. Expenses and basic monthly report: expense category, amount, date and note; income collected versus expenses; owner-scoped data and RLS.
2. Simple CSV import/export: preview rows, clear validation errors, downloadable backup; build this before broad tenant onboarding promises.
3. Maintenance requests and tenant portal: separate tenant identity and permissions, simple issue status, owner inbox. Do not expose owner data through tenant login.
4. Payment links, receipts and automation: provider integration, webhooks, idempotent payment state, consent and delivery logs before promising automatic reminders.
5. Staff roles, notice periods and short stays: only after core workflows and permissions are stable.

Ship each item with its Supabase migration, shared contract, web flow, mobile flow and regression checks in the same change.

## Acquisition work

- In Search Console, export queries and pages for the last three months and check indexing, canonical URL and sitemap coverage. Prioritize pages with impressions and weak CTR or positions 8–30.
- Use specific owner problems in titles and landing pages. Link guides to a matching product page and a clear free sign-up action. Keep pages based on features actually available.
- Measure organic landing page → sign-up → first property → first tenant → first bill. Search clicks alone are not activation.
- Talk to five PG owners before building deep automation. Record the first task they struggle with, then make that task easier in both apps.

Keep public product pages focused on RunMyPG's own capabilities and verified customer needs.
