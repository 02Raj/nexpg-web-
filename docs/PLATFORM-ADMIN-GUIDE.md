# Platform admin — kaise use karein (RunMyPG)

**Simple guide** tumhare liye: leads, owners, APK aur contact messages ek jagah manage karna.

**Live URL:** [https://www.runmypg.in/platform/dashboard](https://www.runmypg.in/platform/dashboard)

---

## 1. Platform admin kya hai?

| | **PG owner console** (`/dashboard`) | **Platform admin** (`/platform`) |
|--|-------------------------------------|----------------------------------|
| **Kaun** | Har PG owner jo signup karta hai | Sirf tum (founder / ops) |
| **Kya karte ho** | Apna building, beds, rent, tenants | Saare owners, website leads, APK approve |
| **Login** | Same RunMyPG account | Same account, lekin **admin email** honi chahiye |

Platform admin = **RunMyPG ka back-office**. Customer ko yeh URL mat do; sirf internal use.

---

## 2. Pehli baar setup (ek baar)

Jab tak ye na ho, `/platform` khulega nahi ya turant owner dashboard pe bhej dega.

### Step A — Email admin list mein

1. **Vercel** (Production env):  
   `NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS=tumhari@email.com`  
   (do admin ho to comma se: `a@x.com,b@y.com`)
2. **Supabase** table `platform_admins` mein wahi email (migration `0004` ya manual insert).

### Step B — Login user

- Supabase Auth mein us email ka user hona chahiye (password set).
- Local helper:  
  `node scripts/set-platform-admin-user.mjs tumhari@email.com`

### Step C — Database (contact form ke liye)

Supabase SQL Editor mein migration chal chuki ho:

- **`0006_contact_inquiries.sql`** — website `/contact` messages yahan save hote hain.

(Optional: `0007` feedback, `0008` scale/rate limits — recommended.)

### Step D — Sarvam draft agent (optional)

Reply draft ke liye:

1. Sarvam se API key (`sk_...`).
2. **Vercel + `.env.local`:** `SARVAM_API_KEY=sk_...` (kabhi `NEXT_PUBLIC_` mat lagao).
3. Code deploy ho (repo mein contact-draft API + UI).
4. Env change ke baad **Redeploy**.

Detail: [SARVAM-AGENT-IMPLEMENTATION.md](./SARVAM-AGENT-IMPLEMENTATION.md)

Full launch list: [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) — section **D**.

---

## 3. Platform admin kaise kholo

1. [https://www.runmypg.in/login](https://www.runmypg.in/login) — **admin email** se login.
2. Koi bhi:
   - Seedha: **/platform/dashboard**
   - Ya owner console sidebar ke neeche **Platform admin** (link sirf admin email pe dikhta hai).

**Local dev:** `npm run dev` → `http://localhost:3001/platform/dashboard`

Wapas PG owner app: sidebar mein **Owner console →**

---

## 4. Har menu ka kaam

### Dashboard (`/platform/dashboard`)

- Kitne owners signup, kitni properties, tenants (high level).
- Naye **contact** / **feedback** counts.
- Sign-up chart — weekly health check.

Roz subah 1 minute yahan dekh sakte ho.

### PG owners (`/platform/owners`)

- Saare registered owners ki list.
- **Deactivate** = account soft band (data delete nahi); abuse / fake ke liye.
- **Reactivate** = wapas on.

### Contact inbox (`/platform/contact`) — roz ka main kaam

Website par [Contact](https://www.runmypg.in/contact) form bharne wale yahan aate hain.

**Flow:**

1. Filter **New** — nayi messages.
2. Row click → poora message padho (status **read** ho jata hai).
3. Reply:
   - **Draft reply (Sarvam)** — AI se pehla draft (sirf button dabane par; credits kam).
   - Draft **edit** karo.
   - **Copy draft** ya **Reply by email** (mailto) ya WhatsApp pe paste.
4. Ho gaya → **Archive**.

**Agent kyun?** Har lead ko same cheezein (beta free, signup link, help) explain karni padti hai — draft time bachata hai. **Tum hamesha final reply bhejte ho**; auto-send nahi hota.

### Owner feedback (`/platform/feedback`)

Logged-in owners ki app/console feedback — product improve karne ke liye.

### Android APK (`/platform/apk-requests`)

1. Owner `/download` pe request karta hai.
2. Yahan **Approve** karo.
3. Owner ko same page se APK download (URL: `NEXT_PUBLIC_ANDROID_APK_URL` Vercel pe set hona chahiye).

Detail: [APK-FLOW.md](./APK-FLOW.md)

---

## 5. Sarvam agent — short checklist

| # | Check |
|---|--------|
| 1 | Admin email se login |
| 2 | `/platform/contact` pe koi message ho |
| 3 | `SARVAM_API_KEY` Vercel Production + redeploy |
| 4 | **Draft reply (Sarvam)** dabao → 2–5 sec → edit → bhejo |

**CLI test (bina browser):**

```powershell
node scripts/sarvam-draft-reply.mjs --name "Rahul" --email "owner@example.com" --topic sales --message "20 bed PG, software chahiye"
```

(`.env.local` mein `SARVAM_API_KEY` chahiye.)

---

## 6. Problem? (quick fix)

| Problem | Kya check karo |
|---------|----------------|
| `/platform` pe redirect `/dashboard` | `NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS` mein wahi email jo login se; redeploy |
| Contact inbox khali | Migration `0006` Supabase pe; test message `/contact` se bhejo |
| Draft button error / 502 | `SARVAM_API_KEY` set + redeploy; Sarvam dashboard pe credits |
| Draft API 401 | Admin email list + logged-in user match |
| APK approve ke baad download nahi | `NEXT_PUBLIC_ANDROID_APK_URL` valid public URL |

---

## 7. Security yaad rakho

- Platform admin **sirf tumhare trusted email** — env list public build mein jaati hai, lekin **sirf woh emails** access paate hain.
- `SARVAM_API_KEY` **server-only** — git / client mein mat daalo.
- Leads ka data customer PII hai — casually share mat karo.

---

## Related docs

- [SARVAM-AGENT-IMPLEMENTATION.md](./SARVAM-AGENT-IMPLEMENTATION.md) — agent phases & setup  
- [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) — migrations, Vercel env  
- [AI-AGENTS-USER-ACQUISITION.md](./AI-AGENTS-USER-ACQUISITION.md) — strategy (optional read)
