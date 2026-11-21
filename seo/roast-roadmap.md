# SEO Roast Roadmap: RunMyPG (runmypg.in)

> **Verdict:** The foundation and technical Next.js SEO are clean, but the domain is starving for external authority (DR 0) and missing key bottom-of-funnel comparison routes (`/trackmypg-alternative`), while Google Search Console only indexes 9 of 30+ pages due to low domain crawl confidence.

---

## 1. Fatal & Crawl Blockers (Must Fix Immediately)

| Item | Status | Fix Shipped |
|---|---|---|
| **Empty Route Trap** | FATAL | `apps/web/app/trackmypg-alternative/` folder was empty; shipped complete comparison landing page. |
| **Sitemap Completeness** | FATAL | Added `/trackmypg-alternative` and new high-intent guides into `apps/web/app/sitemap.ts`. |
| **Disallow Leaks** | VERIFIED | `apps/web/app/robots.ts` correctly permits all public routes and blocks `/dashboard`, `/beds`, `/bills`. |
| **Catch-all 404** | PASS | Root dynamic segments handle 404 safely without soft-404 traps. |

---

## 2. Revenue Blockers (Pages that index but need to rank & convert)

| Page / Route | Search Intent / Query | Fix Shipped |
|---|---|---|
| **`/download`** | `pg owner app india` (18 GSC impressions, Pos 41) | Updated title to `PG Owner App India (Android) \| Free APK Download` and added target meta keywords. |
| **`/pg-rent-collection-software`** | `pg rent collection app india` (10 GSC impressions) | Updated title to `PG Rent Collection Software & App India — Free Beta \| RunMyPG`. |
| **`/trackmypg-alternative`** | `trackmypg alternative`, `track my pg app alternative` | Built full high-converting comparison route with switching triggers, pricing comparison, and migration guide. |
| **Homepage (`/`)** | `paying guest management system`, `pg management software india` | Grounded H1 and kicker with clear Indian PG owner context and direct links to Android APK and web console. |

---

## 3. Compounding Authority & AI Search (30-Day Plan)

1. **Directory Submissions (`submission-manifest.json`)**:
   - Push RunMyPG to 15+ foundational software directories (SoftwareSuggest, SaaSworthy, TechJockey, Product Hunt, AlternativeTo, Trustpilot).
   - Target: Move domain from DR 0 to DR 15+ in 45 days.

2. **Internal Linking Graph**:
   - Link every top blog post (`/blog/how-to-fill-pg-vacant-rooms`, `/blog/pg-security-deposit`, `/blog/how-to-manage-pg-hostel-india-guide`) to `/download`, `/signup`, and `/trackmypg-alternative`.

3. **AI Search Optimization (GEO)**:
   - `llms.txt` and `llms-full.txt` live at `/llms.txt` to feed ChatGPT, Perplexity, and Claude citation engines.

---

## 4. Fluff Tier (Do NOT touch until Fatal & Revenue are green)
- Image alt texts on non-ranking blog posts.
- Meta descriptions minor length adjustments.
- Color contrast tweaks in admin console.
