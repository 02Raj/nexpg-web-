import Link from 'next/link';
import layout from '../platform.module.css';

export default function PlatformVideoShortsPage() {
  return (
    <div className={layout.panel} style={{ maxWidth: 800 }}>
      <h1 className="section">Video Shorts Generator (Guide)</h1>
      <p className="bodyMuted" style={{ marginBottom: 24 }}>
        <strong>Platform admin page sirf guide hai</strong> — video <strong>website se generate nahi hoti</strong>. Tumhare <strong>PC par PowerShell</strong> se chalti hai (5–10 min setup, phir har short ~2–3 min).
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      <h2 className="section" style={{ fontSize: '1.1rem', marginTop: 24, marginBottom: 12 }}>
        Step 1 — Sarvam key (ek baar)
      </h2>
      <p className="bodyMuted">
        <code>P:\nexpg-web-\.env.local</code> mein pehle se ho to theek. Nahi to <code>P:\nexpg-web-\video-agent\.env</code> banao:
      </p>
      <pre style={{ background: 'var(--surface-elevated, #111)', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13, marginTop: 12, marginBottom: 24 }}>
{`SARVAM_API_KEY=sk_...   # same key jo Vercel / app mein hai
BRAND=runmypg`}
      </pre>

      <h2 className="section" style={{ fontSize: '1.1rem', marginTop: 24, marginBottom: 12 }}>
        Step 2 — Setup (ek baar)
      </h2>
      <p className="bodyMuted">PowerShell kholo:</p>
      <pre style={{ background: 'var(--surface-elevated, #111)', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13, marginTop: 12, marginBottom: 12 }}>
{`cd P:\\nexpg-web-\\video-agent
.\\setup.ps1`}
      </pre>
      <p className="bodyMuted">
        FFmpeg + Python venv install hoga. Agar FFmpeg error aaye:
      </p>
      <pre style={{ background: 'var(--surface-elevated, #111)', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13, marginTop: 12, marginBottom: 24 }}>
{`winget install Gyan.FFmpeg`}
      </pre>

      <h2 className="section" style={{ fontSize: '1.1rem', marginTop: 24, marginBottom: 12 }}>
        Step 3 — Screen recordings daalo (zaroori)
      </h2>
      <p className="bodyMuted">
        <code>P:\nexpg-web-\video-agent\clips\</code> folder mein <strong>kam se kam 1 MP4</strong> (2–3 better):
      </p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, marginBottom: 16 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '8px 0' }}>File name</th>
            <th style={{ textAlign: 'left', padding: '8px 0' }}>Kya record karo</th>
          </tr>
        </thead>
        <tbody className="bodyMuted">
          <tr style={{ borderBottom: '1px dashed var(--border)' }}>
            <td style={{ padding: '8px 0' }}><code>dashboard.mp4</code></td>
            <td style={{ padding: '8px 0' }}>Owner dashboard</td>
          </tr>
          <tr style={{ borderBottom: '1px dashed var(--border)' }}>
            <td style={{ padding: '8px 0' }}><code>rent.mp4</code></td>
            <td style={{ padding: '8px 0' }}>Rent / bills screen</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0' }}><code>tenants.mp4</code></td>
            <td style={{ padding: '8px 0' }}>Tenants / beds</td>
          </tr>
        </tbody>
      </table>

      <p className="bodyMuted" style={{ marginBottom: 24 }}>
        <strong>10–20 second</strong> clips — naam <strong>bina space</strong> (<code>.mp4</code>).<br />
        Abhi <code>clips</code> folder <strong>khali</strong> hai — bina iske script run nahi karegi.
      </p>

      <h2 className="section" style={{ fontSize: '1.1rem', marginTop: 24, marginBottom: 12 }}>
        Step 4 — Video generate karo
      </h2>
      <pre style={{ background: 'var(--surface-elevated, #111)', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13, marginTop: 12, marginBottom: 12 }}>
{`cd P:\\nexpg-web-\\video-agent
.\\run-runmypg.ps1 "PG rent due alerts without WhatsApp chaos"`}
      </pre>
      <p className="bodyMuted" style={{ marginBottom: 24 }}>Topic jo bhi chaho — quotes mein likho.</p>

      <h2 className="section" style={{ fontSize: '1.1rem', marginTop: 24, marginBottom: 12 }}>
        Step 5 — Output kahan milega
      </h2>
      <pre style={{ background: 'var(--surface-elevated, #111)', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13, marginTop: 12, marginBottom: 24 }}>
{`P:\\nexpg-web-\\video-agent\\out\\<slug>\\final.mp4    ← Reels / Shorts upload
P:\\nexpg-web-\\video-agent\\out\\<slug>\\caption.txt  ← description + hashtags`}
      </pre>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      <h2 className="section" style={{ fontSize: '1.1rem', marginTop: 24, marginBottom: 12 }}>
        Short summary
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, marginBottom: 16 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '8px 0' }}>Kahan</th>
            <th style={{ textAlign: 'left', padding: '8px 0' }}>Kya</th>
          </tr>
        </thead>
        <tbody className="bodyMuted">
          <tr style={{ borderBottom: '1px dashed var(--border)' }}>
            <td style={{ padding: '8px 0' }}>Browser <code>/platform/video-shorts</code></td>
            <td style={{ padding: '8px 0' }}>Instructions only</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0' }}>Tumhara PC</td>
            <td style={{ padding: '8px 0' }}>Actual video banegi</td>
          </tr>
        </tbody>
      </table>

      <p className="bodyMuted" style={{ marginBottom: 16 }}>
        <strong>Order:</strong> key → <code>setup.ps1</code> → <code>clips/*.mp4</code> → <code>run-runmypg.ps1 "topic"</code>
      </p>

      <p className="bodyMuted" style={{ marginBottom: 24, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
        TutorPe ke liye same flow, bas path:<br />
        <code>fee-recovery-assistant\video-agent</code> + <code>.\run-tutorpe.ps1</code>
      </p>

      <div style={{ background: 'var(--accent, rgba(0, 120, 212, 0.1))', border: '1px solid var(--accent, #0078d4)', padding: 16, borderRadius: 8, marginTop: 24 }}>
        <p className="bodyMuted" style={{ margin: 0, color: 'var(--foreground)' }}>
          <strong>Pehli baar clips record karne mein help chaho to batao —</strong> kaunse 3 screens RunMyPG ke liye best hain, see the table above.
        </p>
      </div>

      <p style={{ marginTop: 32 }}>
        <Link href="/platform/dashboard" className="bodyMuted">← Back to dashboard</Link>
      </p>
    </div>
  );
}
