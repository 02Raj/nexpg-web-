# SEO Roast Roadmap: RunMyPG (2026-11-24)

> **Verdict:** Google can crawl and render RunMyPG, but the site still needs stronger intent-specific money pages, external authority, and Search Console feedback loops before non-branded impressions can turn into registrations.

| # | Tier | Issue | Revenue impact | Fix | Owner | Status |
|---|---|---|---|---|---|---|
| 1 | REVENUE | Rent landing page rendered `RunMyPG` twice in its title | A weak or truncated result can depress clicks on a commercial query | Make branded titles bypass the global title template | agent | shipped |
| 2 | REVENUE | No page directly answered tenant-management intent | Relevant owners landed on a generic page or a competitor's focused page | Add `/tenant-management-software`, sitemap entry, schema, and internal links | agent | shipped |
| 3 | REVENUE | No page directly answered room-and-bed intent | RunMyPG's strongest product workflow had no dedicated search entry point | Add `/room-and-bed-management`, sitemap entry, schema, and internal links | agent | shipped |
| 4 | FATAL | Private/API route list in source robots policy was incomplete | Crawlers could waste time requesting owner-console and API routes | Block every current private route family and `/api` | agent | shipped |
| 5 | REVENUE | Production Cloudflare robots policy differs from the repository policy | AI-search visibility depends on which Cloudflare-managed crawler rules remain enabled | Decide whether to allow search crawlers; keep training crawlers blocked if desired | founder | next |
| 6 | COMPOUNDING | No verified clean referring-domain comparison is available | Content may remain below established competitors even after on-page fixes | Export Ahrefs/Google links data and compare editorial referring domains, not DR alone | founder | next |
| 7 | COMPOUNDING | New pages have no GSC indexation evidence yet | Pages cannot earn impressions until discovered and indexed | Deploy, submit sitemap, inspect both URLs, and monitor for 28 days | founder | after deploy |
| 8 | REVENUE | Core Web Vitals field data was not supplied and was not available in this audit | Mobile friction may reduce both conversion and ranking competitiveness | Review GSC CWV and PageSpeed after deployment; fix failing templates by field impact | founder + agent | next |

## Verification

- Production before this change: canonical `www` host, public routes return 200, unknown route returns 404, dashboard has `noindex, nofollow`.
- Local production build: 86 static pages generated; both new routes return 200 with unique titles, descriptions, canonicals, H1s, FAQ schema, and crawlable body text.
- Local `robots.txt` blocks current console routes and `/api` while allowing public marketing pages.
- `npm run typecheck --workspace=@nexpg/web`: passed.
- `npm run test --workspace=@nexpg/web -- --runInBand`: 2 suites and 5 tests passed.
- `npm run build:web`: passed.

## Fluff (ignore until the rows above move)

- Minor title/description character-count preferences where the result is already unique and accurate.
- Decorative image alt-text changes that do not affect product understanding.
- Heading-order style debates on pages with one clear H1 and readable sections.
