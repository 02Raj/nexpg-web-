# RunMyPG SEO Audit and Growth Plan

Date: 24 November 2026  
Domain: https://www.runmypg.in  
Primary conversion: create a PG-owner account; secondary conversion: request/download the Android app

## Executive summary

RunMyPG's technical foundation is stronger than the Search Console numbers suggest. The public site is statically rendered by Next.js, main copy is present in HTML, canonical URLs consistently use `https://www.runmypg.in`, private console pages carry `noindex`, the sitemap is valid, and unknown routes return 404. The main bottleneck is not basic crawlability. It is the combination of a young/low-signal domain, limited evidence of external authority, and too few focused commercial entry pages for the queries Google has started testing.

The supplied three-month baseline is 3 clicks, 190 total impressions, 1.6% CTR and average position 41.3. The filtered non-branded view shows 104 impressions, 0 clicks and average position 70.7; Google notes that filtered results can omit anonymized queries. These are baselines, not proof that any implementation has improved rankings.

## 1. Problems identified

### Crawl, indexation, and rendering

- **Pass:** homepage and existing solution pages return 200 after the apex-to-`www` 308 redirect.
- **Pass:** a made-up URL returns a real 404, so there is no catch-all soft-404 trap.
- **Pass:** homepage, solution-page H1s, metadata, FAQs and body copy are present in raw server HTML.
- **Pass:** canonical tags use the preferred `www` HTTPS origin.
- **Pass:** `/dashboard` returns `noindex, nofollow, nocache`; the console layout also provides a noindex guard.
- **Fixed:** repository robots rules did not list every current private route family or `/api`.
- **External action:** Cloudflare currently serves a managed robots policy that differs from `app/robots.ts`. It allows general search but blocks GPTBot, ClaudeBot, Google-Extended and other training/AI agents. OAI-SearchBot and PerplexityBot are not explicitly blocked by the observed managed file. This is a product-policy decision, not a reason to weaken Google crawl controls.

### Metadata and search presentation

- **Fixed:** `/pg-rent-collection-software` rendered `| RunMyPG | RunMyPG` because a branded page title was passed through the root title template.
- **Pass:** audited public pages have unique titles, descriptions, canonical tags, one clear H1, Open Graph metadata and Twitter-card metadata.
- **Opportunity:** Search Console CTR should be assessed query by query only after pages reach positions where snippets are regularly visible. A sitewide CTR conclusion at average position 41.3 is premature.

### Content and internal links

- **Fixed:** no dedicated page existed for tenant-management intent.
- **Fixed:** no dedicated page existed for room-and-bed/occupancy-management intent.
- **Pass:** solution pages link to relevant owner guides and city guides; the homepage and footer link to money pages with ordinary crawlable anchors.
- **Watch:** city pages must remain genuinely local. They currently contain city-specific areas and operational context, but should not multiply beyond cities where distinct, accurate material can be maintained.

### Structured data

- **Pass:** homepage uses Organization, WebSite, SoftwareApplication and FAQPage data based on visible product facts.
- **Pass:** solution pages use BreadcrumbList, WebPage and FAQPage.
- **Pass:** articles use BlogPosting and breadcrumbs; one true step-by-step guide also uses HowTo.
- **Pass:** no fake ratings, reviews or paid pricing are declared. The INR 0 offer matches the visible “free while in beta” statement.

### Performance and mobile

- Production pages are statically rendered; the build reports 103 kB shared first-load JavaScript and the homepage at 206 kB first-load JavaScript.
- The layout has responsive CSS and a mobile navigation implementation. A production browser/device matrix and GSC field Core Web Vitals were not available, so CWV status is **not verified**.
- The remote Forg badge adds a third-party image request above the fold. Measure its LCP/CLS contribution before removing it; do not trade a real trust signal for an unmeasured micro-optimization.

## 2. Competitor research

Live search results on 24 November 2026 show a crowded and increasingly specific Indian category:

| Competitor | Observed positioning | What their search pages do well | RunMyPG response |
|---|---|---|---|
| [TrackMyPG](https://trackmypg.com/) | Single-PG through operational management | Clear category relevance around tenants, rent, rooms and operations | Keep the honest comparison page and emphasize owner simplicity/free beta |
| [RentTick](https://www.renttick.com/rent-collection-software) | Rent collection plus tenant payments and WhatsApp | A dedicated rent-collection page directly answers payment questions | State clearly that RunMyPG records UPI/cash; it is not a gateway |
| [EasyAavaas](https://easyaavaas.com/tenant-management-software) | Free PG/hostel software with tenant documents | Separate tenant-management and rent-management intent pages | New tenant page competes on the actual current workflow, without claiming KYC/documents |
| [HostelCare](https://www.hostelcare.co.in/features/room-bed-management/) | Hostel room and bed allocation | Visual, workflow-led room/bed feature page | New room-and-bed page targets bed-level vacancy and links it to tenants/rent |
| [StayNiva](https://www.stayniva.in/) | Broad multi-role PG/hostel operating system | Strong feature naming, visible occupancy UI and extensive FAQs | Position RunMyPG as a focused owner tool; do not imitate unavailable portals/KYC/gate access |
| [GharDesk](https://www.ghardesk.com/) | Indian property/rent management with city pages | Category plus geography architecture | Maintain fewer, higher-quality local guides rather than mass city doorway pages |
| [PayGuest](https://payguest.in/) | UPI rent tracking and PG management | Product screenshots and direct answers about tenant payment behavior | Add real, anonymized product screenshots when a maintained capture workflow is available |

No search-volume, keyword-difficulty, competitor-traffic or backlink numbers are claimed here because no validated provider export was available.

## 3. Prioritized keyword strategy

Priority is based on product fit, commercial intent, observed SERP specialization and realistic page differentiation—not fabricated volume.

| Priority | Cluster | Intent | Competition assessment | Reason |
|---|---|---|---|---|
| P1 | PG management software India; paying guest management system | Core commercial | High | Exact product/category fit and current GSC impressions |
| P1 | PG rent collection software/app; PG rent tracking | Commercial feature | Medium-high | Clear owner pain and existing focused competitors |
| P1 | room and bed management software; PG occupancy management software | Commercial feature | Medium | Strongest differentiating workflow and distinct SERP pages |
| P1 | tenant management software for PG; PG tenant records app | Commercial feature | Medium-high | Distinct intent, but must avoid claiming KYC/document functions |
| P2 | hostel management software India; hostel fee management software | Commercial category | High and mixed | Relevant, but SERPs include institutions/hotel-like systems with broader requirements |
| P2 | PG owner app India; PG management Android app | App/download | Medium | Existing web + Android capability and conversion path |
| P2 | free PG management software | Price-led commercial | High/ambiguous | Valid only while beta is genuinely free; use the main product page rather than a thin duplicate |
| P3 | manage multiple PG properties; track PG occupancy; PG security deposit records | Problem-aware | Medium | Useful guides that can route qualified visitors into solution pages |
| Avoid | tenant room listings, hotel PMS, OTA channel manager, Aadhaar eKYC, automatic payment gateway | Wrong product intent | N/A | Ranking would attract poor-fit visitors or require misleading claims |

## 4. Keyword-to-page map

| Canonical page | Primary cluster | Supporting queries | Cannibalization guard |
|---|---|---|---|
| `/` | PG management software India | PG owner software, paying guest management system | Brand/category overview only |
| `/pg-management-software` | PG management software | free PG management software, software for small PG owners | Full buying/fit explanation; do not clone for “free” |
| `/hostel-management-software` | hostel management software India | hostel occupancy software, sharing-hostel software | Focus on monthly bed-based hostels, not college ERP |
| `/pg-rent-collection-software` | PG rent collection software | PG billing software, PG rent tracker app | Own paid-vs-pending workflow; no automatic-payment claims |
| `/tenant-management-software` | tenant management software for PGs | PG tenant records app, hostel resident records | Own tenant lifecycle/bed/rent/deposit intent |
| `/room-and-bed-management` | room and bed management software | PG occupancy management, hostel bed allocation | Own inventory/occupancy intent |
| `/download` | PG owner Android app India | PG management app download | App acquisition and platform details |
| `/trackmypg-alternative` | TrackMyPG alternative | Track My PG alternative | Comparison/switching intent only |
| `/blog/track-pg-occupancy` | how to track PG occupancy | vacant-bed tracking | Informational guide; link to room-and-bed page |
| `/blog/pg-management-software-india` | how PG software works in India | choose PG software | Educational guide; link to core product page |

## 5. Technical improvements implemented

- Expanded `robots.ts` exclusions to cover `/guests`, `/reports`, `/tenants`, `/tickets`, `/tools` and `/api` in addition to existing private routes.
- Changed the metadata helper so any title already containing `RunMyPG` bypasses the global title template.
- Removed the manually duplicated brand suffix from the rent-collection page title.
- Added the two new solution records to the existing content system, so sitemap generation, FAQs, breadcrumbs and related-link behavior remain consistent.
- Added homepage, footer and city-guide contextual links to both new money pages.
- Added three relevant blog-to-money-page links for each new solution page.
- Added both pages and their search phrases to the generated `llms.txt` key-page source.

## 6. Pages created or optimized

### Created

- `/tenant-management-software`: tenant-to-bed records, rent/deposit context, limitations around KYC/police verification, FAQ and conversion CTA.
- `/room-and-bed-management`: bed-level vacancy, occupancy workflow, multi-property separation, non-hotel positioning, FAQ and conversion CTA.

### Optimized

- `/pg-rent-collection-software`: corrected title branding.
- Shared metadata generation: prevents future double-brand titles.
- Homepage/footer/city pages: stronger crawl paths into all five solution pages.

## 7. Files modified

- `apps/web/src/content/solutions.ts`
- `apps/web/app/tenant-management-software/page.tsx`
- `apps/web/app/room-and-bed-management/page.tsx`
- `apps/web/src/lib/seo.ts`
- `apps/web/app/pg-rent-collection-software/page.tsx`
- `apps/web/app/robots.ts`
- `apps/web/app/MarketingHome.tsx`
- `apps/web/src/components/marketing/MarketingFooter.tsx`
- `apps/web/app/cities/[slug]/page.tsx`
- `apps/web/app/blog/[slug]/page.tsx`
- `apps/web/src/content/geo.ts`
- `seo/roast-roadmap.md`
- `seo/runmypg-seo-audit-2026-11-24.md`

## 8. Validation results

| Check | Result |
|---|---|
| TypeScript | Passed |
| Jest | 2 suites, 5 tests passed |
| Next.js production build | Passed; 86 static pages generated |
| New routes | Both return 200 in the local production server |
| New titles | Unique, one `RunMyPG` suffix |
| New canonical URLs | Correct absolute `www` URLs |
| New H1/body content | Present in server HTML |
| Sitemap | Both new canonical URLs present |
| Robots | Public allowed; current console/API paths blocked in app output |
| Unknown route | 404 |
| Live deployment | Not performed, per instruction |
| Rankings/CWV improvement | Not claimed; requires post-deployment field data |

## 9. Remaining improvements

1. Decide and configure Cloudflare's managed robots policy so it matches the intended search-vs-training policy.
2. Deploy and use GSC URL Inspection on the two new routes; do not request indexing repeatedly.
3. Export GSC query-by-page data after 28 days and rewrite only pages with meaningful impressions and weak CTR/rank alignment.
4. Add maintained product screenshots to the five solution pages, with real UI, descriptive alt text, fixed dimensions and WebP/AVIF delivery.
5. Obtain a verified backlink/referring-domain export before setting any numeric link target.
6. Review GSC Core Web Vitals and PageSpeed mobile results; prioritize failing field templates rather than chasing a synthetic score.
7. Add first-hand proof as it becomes available: anonymized workflow screenshots, founder observations, setup time measurements, and approved customer quotes. Do not invent adoption counts.

## 10. Growth roadmap

### Days 1–30

- Deploy this implementation and submit the updated sitemap once.
- Inspect `/tenant-management-software` and `/room-and-bed-management` in GSC.
- Verify that the three contextual blog links into each new page are crawled and retained after deployment.
- Publish/refresh one useful guide per week:
  1. room vs bed occupancy tracking for sharing PGs;
  2. tenant move-in record checklist for Indian PG owners;
  3. paid-vs-pending rent reconciliation after UPI/cash payments;
  4. managing two PG properties without mixing occupancy and bills.
- Capture two real product screenshots using demo data: occupancy map and tenant/rent record.
- Record weekly GSC baseline: impressions, clicks, query, page, country and device. No ranking claims before the data changes.

### Days 31–60

- Use GSC evidence to improve titles/openings on pages receiving impressions in positions 8–30.
- Publish a transparent “Excel vs RunMyPG” workflow comparison with screenshots and clear limitations.
- Earn relevant citations through product directories, Indian SaaS communities, partner/customer sites and genuine founder-led articles; evaluate link quality manually.
- Add a small proof knowledge base for verified facts so product copy, schema and comparison pages cannot drift.
- Review city-page impressions; keep and deepen useful cities, and avoid adding cities with no unique operational material.

### Days 61–90

- Consolidate any two pages that attract the same query cluster; do not let new content cannibalize money pages.
- Create one additional feature page only if GSC shows a distinct commercial cluster and the product genuinely supports it.
- Publish a founder/customer case study with approved numbers and methodology.
- Compare clean editorial referring domains against three ranking competitors using Ahrefs or an equivalent export.
- Review registrations by landing page in privacy-safe analytics to distinguish traffic growth from customer growth.

## 11. Google Search Console actions after deployment

1. Submit `https://www.runmypg.in/sitemap.xml` under the `www` HTTPS property (or domain property).
2. Inspect and request indexing once for:
   - `https://www.runmypg.in/tenant-management-software`
   - `https://www.runmypg.in/room-and-bed-management`
3. Confirm Google-selected canonical equals the declared canonical for the homepage and all five solution pages.
4. Check Page Indexing for “Crawled – currently not indexed,” duplicate canonical and soft-404 patterns.
5. Review Core Web Vitals by template and mobile/desktop separately.
6. Save a regex filter for non-branded queries, but remember anonymized queries can disappear from filtered totals.
7. After 28 days, export query + page + clicks + impressions + CTR + position. Compare against the supplied baseline, not against a one-day spike.
8. Annotate the deployment date outside GSC so later changes can be interpreted correctly.

## Measurement guardrails

- A successful build is not a ranking improvement.
- Indexing is not assumed until GSC confirms it.
- Search volume, difficulty, DR and competitor traffic require a named data source and export date.
- Organic success is registrations from relevant owners, not raw blog sessions.
