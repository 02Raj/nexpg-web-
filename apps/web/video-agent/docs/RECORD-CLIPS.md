# Video agent — app kaise dikhe (simple)

Agent **automatic animated app nahi banata**. Ye tumhari **screen recording** + **Sarvam voice** + **captions** jodta hai.

Agar `clips/` mein sirf grey / color test file hai → video bhi waisi dikhegi. **Ye bug nahi hai.**

---

## Tumhe kya karna hai (ek baar)

### 1. RunMyPG record karo (phone ya laptop)

**Windows (sabse easy):**

1. Browser mein `http://localhost:3001` ya `https://www.runmypg.in` kholo, login karo.
2. **Win + G** → Capture → **Record** (10–20 second).
3. Ye screens alag-alag record karo (har ek alag file):

| File name (`clips/` folder) | Kya record karo |
|----------------------------|-----------------|
| `dashboard.mp4` | Main dashboard / overview |
| `rent.mp4` | Rent due, collection, bills |
| `tenants.mp4` | Tenants / beds / occupancy |

**File name exact** rakho (no spaces). Script inhi names use karta hai.

### 2. Files copy karo

```
video-agent/clips/dashboard.mp4
video-agent/clips/rent.mp4
video-agent/clips/tenants.mp4
```

Purani grey test files **delete** karke replace karo.

### 3. Video dubara banao

```powershell
cd video-agent
.\run-runmypg.ps1 "PG rent due alerts without WhatsApp chaos"
```

Output: `out/.../final.mp4`

---

## Voice / caption check

| Check | Kaise |
|-------|--------|
| **Voice** | `out/<folder>/voice.wav` play karo (VLC). Agar yahan sound hai, final.mp4 mein bhi honi chahiye — player volume on karo. |
| **Captions** | Poori video play karo start se; end frame par sirf last line dikhegi agar aap seek karke end pe ho. |
| **App UI** | Sirf tab dikhega jab `clips/*.mp4` mein **asli recording** ho. |

---

## Galat vs sahi

| Galat (abhi tumne kiya hoga) | Sahi |
|------------------------------|------|
| `generate_dummies.py` purana — 100×100 grey gradient | Real 1080p screen recording |
| Video = sirf color change | Video = tumhara dashboard scroll / tap |

Naye placeholders (agar bilkul khali ho):  
`.\.venv\Scripts\python.exe generate_dummies.py` — sirf **"RECORD: …"** text dikhega, phir bhi replace karna zaroori hai.

---

## Optional — zyada smooth captions

`.env.local`:

```env
WHISPER_MODE=tiny
```

Phir: `pip install faster-whisper` (venv mein). Captions voice ke saath better sync.
