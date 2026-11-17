# AI agents for user acquisition — research & playbook for RunMyPG

**Purpose:** Help you decide whether to build (or buy) an AI agent that brings PG owners to RunMyPG — without copying competitors, spamming owners, or breaking Indian law.

**Last updated:** September 2026  
**Product context:** RunMyPG (`www.runmypg.in`) — PG/hostel owner console (web + Android), free in beta, India-first.

---

## 1. What people mean by “AI agent for users”

In 2025–2026, “growth agent” usually means one of **four different things**. Mixing them up is why founders build the wrong tool.

| Type | What it does | Who it talks to | Fit for RunMyPG |
|------|----------------|-----------------|-----------------|
| **Outbound SDR agent** | Finds leads, sends email/LinkedIn/WhatsApp, qualifies, books demos | Cold PG owners, brokers, property managers | Medium — needs strict compliance & human approval |
| **Inbound concierge agent** | Answers website/WhatsApp, explains product, pushes signup | Visitors who already showed interest | **High** — matches your contact form + WhatsApp |
| **Content / GEO agent** | Writes & structures guides so ChatGPT/Perplexity/Google AI cite you | Humans *and* AI answer engines | **High** — you already have `/blog`, `/cities`, `/help` |
| **Product / integration agent** | MCP server, API, “install in Cursor” — agents *use* your product | Developers & coding agents | Low today — your buyer is a PG owner, not a dev |

**Agent-led growth (ALG)** splits into:

- **Supply-side:** *You* use agents to sell, support, and operate cheaper (outreach, follow-up, analytics).
- **Demand-side:** *Buyers’* agents discover and compare software; you optimize to be **cited** (GEO) and **easy to sign up** (self-serve, clear pricing).

For RunMyPG, the highest ROI order is usually: **GEO + inbound concierge → light outbound with human approval → paid SDR tools only if you have budget and compliance sorted.**

Sources: [Agent-led growth framework](https://agentledco.substack.com/p/whats-agent-led-growth), [Deloitte SaaS & agents 2026](https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/saas-ai-agents.html), [Similarweb GEO guide](https://aisearch.similarweb.com/blog/what-is-geo/).

---

## 2. How modern SaaS teams actually get users with AI (patterns)

### 2.1 The “agent flywheel” (discovery without ads)

When coding agents (Cursor, Claude, etc.) pick a backend or email API repeatedly, growth compounds: one integration → many executions. That story fits **Supabase, Resend** — developer infrastructure.

RunMyPG is **operations software for PG owners**, not a dev tool. Your flywheel looks different:

1. Owner googles or asks AI: *“PG management software India beds rent”*
2. They land on **city guides**, **blog**, or **help** (you already ship these)
3. They sign up free → use console → (optional) Android
4. They tell another owner or broker → WhatsApp forward

**Your agent job:** keep producing **accurate, cite-worthy answers** (occupancy, bills, deposits — not fake ₹1 trial or 2FA you don’t have).

### 2.2 GEO — Generative Engine Optimization

GEO is SEO’s cousin: optimize so **AI answers mention RunMyPG** with correct facts.

Practices that show up across Deloitte, Similarweb, Frase, TrustRadius:

- **Allow AI crawlers** where appropriate (`GPTBot`, `PerplexityBot` — don’t block in `robots.txt` unless you have a reason).
- **Structured data:** `Organization`, `FAQPage`, `SoftwareApplication` (you already use JSON-LD on key pages).
- **Answer-first content:** clear H2 questions, short direct answers, FAQs matching real owner language.
- **E-E-A-T:** real contact (`contact@runmypg.in`), privacy/terms, no invented office address.
- **Third-party signals:** later — reviews on G2/Capterra/IndiaMART-style listings if you pursue them honestly.

Measure GEO with periodic prompts (manual or scripted): *“Best PG management software in Noida”*, *“track bed occupancy paying guest”*, and log whether RunMyPG is named and whether claims are true.

### 2.3 AI SDR / outbound agents (India market)

Indian vendors market **autonomous outbound**: LinkedIn + email + WhatsApp, lead scoring, demo booking (e.g. [leadagent.in](https://www.leadagent.in/), [PhewDo](https://phewdo.com/autopilot/), [Sahay](https://www.sahay.io/), [IngageNow](https://ingagenow.in/), [Edesy](https://edesy.in/ai-sdr)).

**What they automate well**

- ICP definition (city, “PG owner”, “hostel”, property size)
- List building from directories / LinkedIn / intent signals
- First-touch personalization and follow-up sequences
- Routing hot replies to WhatsApp or calendar

**What they do poorly if you’re careless**

- Generic spam → brand damage for a trust product (tenant data)
- WhatsApp without **official Business API** and templates → bans
- Ignoring **DPDP** (consent, purpose, retention) and telecom rules

**RunMyPG stance:** Outbound agents are **optional and later**. Start with inbound + content. Any outbound must be **human-approved** per lead or per message batch.

### 2.4 Open-source stack (founder-built agent)

Common pattern in 2026:

| Layer | Tool | Role |
|-------|------|------|
| Orchestration | [n8n](https://n8n.io/) (self-host or cloud) | Triggers, CRM, Gmail, Sheets, Slack approval |
| Multi-agent logic | [CrewAI](https://github.com/crewaiinc/crewai) (Python + FastAPI) | Research, draft copy, score leads |
| LLM | Groq / OpenAI / Claude API | Generation & classification |
| Search | Serper / manual | Find “PG in {city}” public listings |
| Knowledge | Your repo: `help.ts`, `blog.ts`, `cities.ts`, legal | RAG — agent must not invent features |
| Human gate | n8n “Wait for approval” | No send without you clicking Yes |

Reference workflows: [n8n agentic marketing workflow](https://github.com/N1wan7ha/agentic-ai-marketing-workflow-n8n), [n8n marketing workflows collection](https://github.com/azizaeffendi/n8n-marketing-workflows), [CrewAI + n8n hybrid](https://thinkpeak.ai/integrating-crewai-with-n8n/).

**Why hybrid:** n8n handles integrations and pauses; CrewAI handles multi-step reasoning. Don’t run heavy Python *inside* n8n nodes in production — expose a small API.

### 2.5 MCP + Skills (when your *users* are developers)

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/) lets AI clients call tools. [Skills](https://agentskills.io/) are markdown playbooks. Together they help **coding agents** adopt a product.

RunMyPG’s buyer is **not** primarily a developer wiring APIs. MCP is a **Phase 3** idea (e.g. “export occupancy report” tool for power users). Don’t prioritize MCP before PG owners can find you on Google and WhatsApp.

---

## 3. RunMyPG-specific: ideal customer & channels

### 3.1 ICP (who the agent should target)

**Primary**

- Paying guest / hostel **owner or operator** in India
- 10–80 beds, manual Excel or register
- Cities you already cover in `/cities` (Noida, Gurgaon, Bengaluru, Pune, etc.)

**Secondary**

- Family-run PG where owner walks the property (Android app matters)
- Operator with 2+ buildings (multi-property on one login)

**Not ICP (agent should disqualify)**

- Tenants looking for a room (you are owner software, not a marketplace)
- Large hotel chains wanting PMS
- Anyone asking for payment gateway, tenant portal, staff RBAC you don’t ship yet

### 3.2 Channels that work in India for this category

| Channel | Agent role | Notes |
|---------|------------|-------|
| **Google / AI answers** | GEO content agent | Blog + city pages + FAQ; honest “free in beta” |
| **WhatsApp** | Inbound only at first | Use existing `+91 87070 54586`; agent drafts, **you send** until Business API |
| **Contact form** | Notify + draft reply | Data → `/platform/contact` (already in app) |
| **YouTube / Instagram** | Script + caption agent | Short “bed map vs Excel” demos — you on camera builds trust |
| **Facebook PG owner groups** | **Human posts**; agent drafts | No auto-spam; groups ban bots fast |
| **Brokers / consultants** | Referral tracking later | Agent can research, not cold-DM at scale without consent |
| **LinkedIn** | Low priority unless you post as founder | B2B SDR tools target LinkedIn; PG owners are often not active there |

### 3.3 What your agent must know (knowledge base)

Ground every reply in **your** docs, not competitor copy:

- `src/content/help.ts` — setup order, Android APK flow
- `src/content/blog.ts` + `/cities/*` — SEO/GEO
- `src/content/marketing.ts` — FAQs (no Supabase/RLS on public site)
- Pricing: **free in beta**, no ₹1 Razorpay trial fiction

Refresh the KB when product changes. Stale agents lie worse than no agent.

---

## 4. Build vs buy

### 4.1 Buy (managed AI SDR / Sahay-style)

**When:** You have budget (roughly ₹5k–25k+/month Indian tools), sales time to handle demos, and legal comfort with outreach.

**Pros:** Faster pipeline experiments, multi-channel, analytics  
**Cons:** Less control, risk of off-brand messages, PG owners may dislike cold WhatsApp

### 4.2 Build (n8n + your content + approvals)

**When:** Solo founder, tight budget, care about trust and accuracy.

**Pros:** Full control, uses RunMyPG truth, integrates with `contact_inquiries` and platform admin  
**Cons:** You maintain workflows, APIs, and prompts

### 4.3 Hybrid (recommended for RunMyPG)

1. **Don’t buy outbound** until inbound + GEO show signups.
2. **Build lightweight agents** for:
   - New contact form → Slack/email alert + suggested reply
   - Weekly: generate 1 blog outline from owner questions in support
   - Monitor: “RunMyPG” / “PG software” AI citation check (spreadsheet)
3. **Buy one tool** only if needed: e.g. email warmup + sequences *after* you have a clear offer and landing page.

---

## 5. Architecture: a practical “growth agent” for RunMyPG

### 5.1 Phase A — Inbound assistant (0–4 weeks)

```text
Visitor → /contact form OR WhatsApp
    → Supabase contact_inquiries (form)
    → n8n webhook (optional) OR daily admin check /platform/contact
    → LLM drafts reply from KB (help + pricing + signup link)
    → YOU approve → send from sales@ / support@ / WhatsApp
```

**No autonomous sending.** PG owners trust humans for money and tenant data.

Optional: Supabase Edge Function or Vercel cron that emails you on new `contact_inquiries` row (if you don’t use n8n yet).

### 5.2 Phase B — Content & GEO agent (4–10 weeks)

**Crew or single LLM chain:**

1. Input: city + topic (“rent collection”, “security deposit”)
2. Research: your existing `cities.ts` + competitor **structure** only (never paste their copy)
3. Output: outline → you edit → publish `/blog` or expand `/cities`
4. Checklist: FAQ schema, internal links to `/signup`, `/help`

**Automation limit:** Auto-publish only if you add a strict fact-check step (product features whitelist).

### 5.3 Phase C — Qualified outbound (10+ weeks, optional)

```text
Schedule (weekly) → Serper: "PG owner" + city public signals
    → Enrich: website / IndiaMART / Justdial (public data only)
    → Score: bed count proxy, city match
    → n8n: row in Google Sheet + "Approve outreach?"
    → If approved: personalized email OR WhatsApp template (compliant)
    → Log: do-not-contact if reply "stop"
```

**Hard rules**

- Opt-out honored immediately
- No purchased email lists without consent proof
- WhatsApp: prefer **user-initiated** (they messaged you first) until Business API + templates

### 5.4 Phase D — Product intelligence (later)

- Dashboard in `/platform`: signups by city, contact topics, feedback themes
- Agent summarizes weekly: “Top 3 support themes” from `user_feedback` + contact inbox
- Feeds blog and product roadmap — not more spam

---

## 6. Compliance & trust (India) — non-negotiable

Your agent must enforce these; violating them kills the business faster than slow growth.

| Area | Requirement | Agent implication |
|------|-------------|-------------------|
| **DPDP Act 2023** | Lawful purpose, consent where required, data minimization | Store only needed lead fields; link to `/privacy`; allow deletion requests via support@ |
| **WhatsApp** | Meta Business Policy, templates for outbound | No bulk cold WhatsApp from personal number via unofficial bots |
| **TRAI / DLT** | SMS/voice promotional messages need registered templates & consent | If agent sends SMS, use DLT-compliant provider |
| **NDNC** | Do not call/SMS registered DND numbers for promotion | Scrub lists if you do telemarketing |
| **CAN-SPAM style hygiene** | Unsubscribe on email | Honest From: runmypg.in addresses |
| **Product honesty** | No fake stats, features, or competitor cloning | KB whitelist; human review on outbound |

Tenant data in the console is sensitive — marketing agents should **never** access production tenant tables.

---

## 7. Metrics (measure growth, not vanity)

| KPI | What it tells you |
|-----|-------------------|
| Signups / week | Core outcome |
| Signup → first building created | Activation |
| Contact form → replied & signed up | Inbound agent quality |
| Organic + AI-referred sessions (GA4) | GEO / SEO |
| Branded prompts: “RunMyPG” in ChatGPT/Perplexity (manual audit) | GEO share |
| CAC | If you run ads or paid SDR |
| Support themes | Product-led content ideas |

**Do not** optimize an agent on “messages sent”. Optimize on **qualified signups** and **owner activation**.

---

## 8. 90-day roadmap (solo founder)

### Days 1–30

- [ ] Document ICP + forbidden claims (this file + `help.ts`)
- [ ] Weekly: 5 GEO test queries in a spreadsheet; fix site copy if AI is wrong
- [ ] Process `/platform/contact` within 24h; save reply templates
- [ ] Optional: n8n alert on new contact row

### Days 31–60

- [ ] One agent workflow: contact → draft reply (human send)
- [ ] 2 new blog/city pieces from real support questions
- [ ] WhatsApp: pinned message + link to `/signup` and `/help` (manual)

### Days 61–90

- [ ] Evaluate one outbound experiment **only** with approval gate (e.g. 50 emails/week max)
- [ ] Review: signups from organic vs contact vs WhatsApp
- [ ] Decide: buy SDR tool vs extend n8n vs stay inbound-only

---

## 9. Prompts & guardrails (copy into your agent)

**System prompt principles**

- You represent RunMyPG only.
- Free in beta; web + Android owner app; no payment collection in product today.
- Never mention Supabase, RLS, or internal stack on public marketing.
- Never promise features from TrackMyPG/competitors (2FA, Razorpay ₹1 trial, invoice PDFs, staff roles) unless shipped.
- If unsure, say: “Email support@runmypg.in or WhatsApp +91 87070 54586.”

**Example owner-facing opener (human or agent draft)**

> Namaste — RunMyPG helps PG owners track beds, tenants, monthly rent and deposits from one dashboard (website + Android). It’s free while we’re in beta. If you tell me your city and roughly how many beds you run, I can point you to the right setup guide.

---

## 10. Further reading

- [Improbability VC — Growth in the age of agents](https://improbabilityvc.substack.com/p/growth-in-the-age-of-agents) (agent flywheel)
- [Agent-led growth — Hugo Santana](https://agentledco.substack.com/p/whats-agent-led-growth) (supply vs demand ALG)
- [COSEOM — AI agent customer acquisition](https://www.coseom.com/ai-agent-driven-customer-acquisition/) (machine-readable pricing, self-serve)
- [Inite — MCP + Skills for SaaS](https://inite.ai/en/blog/mcp-skills-make-saas-ai-native) (developer/agent distribution)
- [Deloitte — SaaS meets AI agents 2026](https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/saas-ai-agents.html)
- [Similarweb — GEO guide](https://aisearch.similarweb.com/blog/what-is-geo/)
- Internal: `docs/LAUNCH-CHECKLIST.md`, `src/content/help.ts`, `/platform/contact`

---

## 11. Bottom line for RunMyPG

You **can** build an AI agent stack to help bring users — but for PG software in India the winning pattern is **trust + clarity**, not volume outreach.

1. **Let AI help you be found** (GEO, city guides, honest FAQs).  
2. **Let AI draft inbound replies**; you send from official channels.  
3. **Use platform admin** (`/platform/contact`, feedback, signups) as the brain for what to write next.  
4. **Add outbound agents only** with human approval and telecom/WhatsApp compliance.  
5. **Skip dev-centric MCP** until owners are already signing up without it.

That is a full-fledged, maintainable path: small automation surface, your real product truth, scales with more owners because database and RLS already isolate tenants per account — the agent layer stays stateless and cheap to run on n8n + API calls.

---

## 12. Sarvam API — tumhare credits ke saath kya best hai?

Agar tumhare paas **Sarvam API key + credits** hain, ye RunMyPG growth agent ke liye **sahi choice hai** — especially **India + Hindi/English/Hinglish** owners. Credits is phase mein **kaafi** rehne chahiye agar tum 24/7 auto-calling bot nahi chala rahe.

Official docs: [Chat completions](https://docs.sarvam.ai/api-reference/chat/chat-completions) · [Models](https://docs.sarvam.ai/api/getting-started/models/sarvam-105b) · [Pricing (₹)](https://docs.sarvam.ai/api/getting-started/pricing)

### 12.1 Sarvam kis kaam ke liye best hai (RunMyPG)

| Kaam | Sarvam fit | Model suggestion |
|------|------------|------------------|
| Contact form / WhatsApp **reply draft** (Hindi + English) | **Excellent** | `sarvam-105b-conversations` |
| Blog / city guide **outline** (Indian tone) | **Very good** | `sarvam-105b` (128K — paste help/blog excerpts in prompt) |
| Lead **score** / topic tag (sales vs support) | **Good** | Cheaper beta models on same key if enabled (`glm5.3-flash`, `deepseekv4-flash`) |
| **Voice** owner calls (future) | **Strong** | Sarvam STT + Bulbul TTS (priced per hour / 10K chars) |
| Pure English SEO polish only | OK | Sarvam works; optional second pass with any editor you like |

Sarvam ka edge: **10 Indian languages + code-mixed input**, OpenAI-style `POST /v1/chat/completions`, **tool calling** on flagship models — n8n / small Python service se connect karna easy.

### 12.2 Credits kitna chalega? (rough math)

Growth agent = chhoti calls, bar-bar nahi.

Example: ek contact reply draft ≈ 2K input + 500 output tokens.

- Sarvam 105B ballpark (docs): ~₹29 / 1M input, ~₹73 / 1M output tokens  
- **~100 drafts/month** ≈ still **under a few hundred rupees** of token cost — credits long time chalenge for solo founder.

Heavy cost tab **voice** (STT hours) ya **thousands** of automated emails/day — wo abhi mat karo.

### 12.3 Best stack recommendation (Sarvam + kya aur?)

```text
n8n (or simple script)  →  HTTP →  Sarvam chat/completions
                              ↑
                    RunMyPG KB (help.ts, marketing FAQs — paste or RAG)
                              ↓
                    Human approves → Gmail / WhatsApp / sales@
```

| Layer | Best pick | Kyun |
|-------|-----------|------|
| **LLM (brain)** | **Sarvam** (existing credits) | India languages, ₹ billing, PG owners Hindi/English |
| **Orchestration** | **n8n** (self-host or cloud) | Approvals, contact webhook, no spam autopilot |
| **Knowledge** | **Repo content** (`help.ts`, `blog.ts`, `cities.ts`) | Sach bolna — competitor copy nahi |
| **Alerts** | Supabase `contact_inquiries` + `/platform/contact` | Tumhara admin inbox already hai |
| **OpenAI / Claude** | Optional later | Sirf agar English-only longform polish chahiye; **pehle Sarvam se start** |

**Mat karo abhi:** poora outbound autopilot sirf Sarvam se; **human approve** rakho.

### 12.4 Kaun model kab

- **`sarvam-105b-conversations`** — owner-facing short messages, WhatsApp tone, support/sales replies.  
- **`sarvam-105b`** — longer reasoning, multi-step agent, big context (poora help doc ek saath).  
- **Beta flash models** (agar key pe enabled) — classify intent, yes/no lead fit, cheap.

Temperature **0.2–0.4** for factual product answers; zyada creative mat rakho (galat feature invent ho sakta hai).

### 12.5 Security (API key)

- Key sirf **server / n8n credentials** — kabhi Next.js `NEXT_PUBLIC_*` ya git mein nahi.  
- Env name suggestion: `SARVAM_API_KEY` (header: `api-subscription-key` per Sarvam docs).  
- Agent ko **tenant DB** access mat do — sirf marketing KB + contact row metadata.

### 12.6 Short answer

| Question | Answer |
|----------|--------|
| Sarvam growth agent ke liye sahi? | **Haan** — inbound + content + (baad mein) Hindi voice ke liye best fit India PG product. |
| Credits se kaam ho jayega? | **Haan**, early stage mein — jab tak tum mass cold WhatsApp/voice flood nahi karte. |
| Sabse best combo? | **Sarvam (LLM) + n8n (workflow + approval) + tumhari site content (truth) + `/platform/contact`**. |

Pehla step: n8n ya chhota script — new contact row → Sarvam draft → tum approve → reply from `support@` / WhatsApp.

**Implementation (Phase 0 shipped):** see [SARVAM-AGENT-IMPLEMENTATION.md](./SARVAM-AGENT-IMPLEMENTATION.md) — `SARVAM_API_KEY`, `/api/platform/contact-draft`, admin **Draft reply** button.

