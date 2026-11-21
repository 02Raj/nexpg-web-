import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import c from '../cities/cities.module.css';

export const metadata = pageMetadata({
  title: 'TrackMyPG Alternative: Free PG Management Software & App',
  description:
    'Looking for a TrackMyPG alternative in India? RunMyPG gives you physical bed occupancy mapping, tenant rent ledgers, and Android rounds — 100% free during beta.',
  path: '/trackmypg-alternative',
  keywords: [
    'trackmypg alternative',
    'track my pg alternative',
    'trackmypg app alternative',
    'best pg management software india',
    'trackmypg vs runmypg',
    'free pg software india',
  ],
});

export default function TrackMyPgAlternativePage() {
  const url = `${SITE_URL}/trackmypg-alternative`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'TrackMyPG Alternative', item: url },
        ],
      },
      {
        '@type': 'WebPage',
        name: 'TrackMyPG Alternative: Free PG Management Software in India',
        description:
          'Compare TrackMyPG and RunMyPG. Discover why Indian PG owners choose RunMyPG for bed occupancy mapping, rent recovery, and mobile rounds without per-bed subscription fees.',
        url,
        inLanguage: 'en-IN',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Why do owners switch from TrackMyPG to RunMyPG?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Owners switch for transparent zero-cost beta pricing, faster visual bed-level occupancy tracking, and zero forced payment gateway fees when collecting rent via direct UPI or cash.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is RunMyPG really free during beta?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. All core owner features — bed mapping, tenant profiles, rent tracking, security deposit records, and Android rounds — are 100% free during public beta with no credit card required.',
            },
          },
          {
            '@type': 'Question',
            name: 'How easy is it to migrate from TrackMyPG or Excel?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can set up your entire PG in under 10 minutes: add your floors and rooms, create your bed matrix, and assign your current occupants.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingFrame navScrolled>
        <div className={c.page}>
          <p className={c.crumb}>
            <Link href="/">Home</Link>
            {' / '}
            Alternative
          </p>

          <article className={c.body}>
            <p className={c.kicker}>Competitor comparison · India</p>
            <h1 className={c.title}>The practical TrackMyPG alternative for Indian PG owners</h1>
            <p className={c.lead}>
              If you run a paying guest accommodation in Bengaluru, Kota, Pune, Gurgaon, or Delhi and are tired of complex enterprise workflows or rising software costs, RunMyPG is built for you: visual bed-level occupancy, monthly rent ledgers, and mobile rounds.
            </p>

            <section className={c.section}>
              <h2>5 Reasons Indian PG owners switch to RunMyPG</h2>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <strong>1. ₹0 Public Beta (No per-bed monthly tax)</strong>
                  <p>
                    Most legacy software charges a recurring monthly fee per bed or per building. RunMyPG is 100% free during public beta with zero credit card required, letting you pocket your full rental margin.
                  </p>
                </div>
                <div>
                  <strong>2. Visual Bed Matrix (Inventory first, headcount second)</strong>
                  <p>
                    You rent beds, not abstract numbers. RunMyPG maps every room down to Bed A, B, and C. You see vacant spots instantly on your phone while walking the corridors.
                  </p>
                </div>
                <div>
                  <strong>3. Keep your money (No forced gateway transaction cuts)</strong>
                  <p>
                    Tenants can pay you directly via their favorite UPI app (PhonePe, Google Pay, Paytm) or cash. You simply mark the bill paid in one tap without giving away transaction percentage cuts.
                  </p>
                </div>
                <div>
                  <strong>4. Web Console at the desk + Android App at the gate</strong>
                  <p>
                    Use your desktop browser for deep monthly reconciliation and our fast Android app when doing rounds, inspecting rooms, or checking in move-ins on site.
                  </p>
                </div>
                <div>
                  <strong>5. Zero bloat, instant setup</strong>
                  <p>
                    No 40-step ERP setup wizards. You can set up your building, rooms, beds, and billing cycles in under 10 minutes.
                  </p>
                </div>
              </div>
            </section>

            <section className={c.section}>
              <h2>Feature Comparison: TrackMyPG vs RunMyPG</h2>
              <div style={{ overflowX: 'auto', marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '12px 8px' }}>Feature</th>
                      <th style={{ padding: '12px 8px' }}>TrackMyPG</th>
                      <th style={{ padding: '12px 8px' }}>RunMyPG</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 8px' }}>Pricing</td>
                      <td style={{ padding: '12px 8px' }}>Paid plans / per bed</td>
                      <td style={{ padding: '12px 8px', color: '#10b981', fontWeight: 600 }}>100% Free in Beta</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 8px' }}>Bed-level Occupancy</td>
                      <td style={{ padding: '12px 8px' }}>List / room based</td>
                      <td style={{ padding: '12px 8px', color: '#10b981', fontWeight: 600 }}>Visual Bed Matrix</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 8px' }}>Payment Mode</td>
                      <td style={{ padding: '12px 8px' }}>In-app Gateway</td>
                      <td style={{ padding: '12px 8px', color: '#10b981', fontWeight: 600 }}>Direct UPI / Cash (0% fees)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 8px' }}>Android App</td>
                      <td style={{ padding: '12px 8px' }}>Yes</td>
                      <td style={{ padding: '12px 8px', color: '#10b981', fontWeight: 600 }}>Yes (Synced login)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 8px' }}>Multi-Property Switcher</td>
                      <td style={{ padding: '12px 8px' }}>Supported</td>
                      <td style={{ padding: '12px 8px', color: '#10b981', fontWeight: 600 }}>Built-in switcher</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className={c.section}>
              <h2>How to switch in 3 simple steps</h2>
              <ul className={c.bullets}>
                <li>
                  <strong>Step 1: Create your free account</strong> — Sign up with your email at <Link href="/signup">runmypg.in/signup</Link>.
                </li>
                <li>
                  <strong>Step 2: Add your building & rooms</strong> — Define your room numbers and bed capacity (single, double, triple sharing).
                </li>
                <li>
                  <strong>Step 3: Add occupants</strong> — Assign current tenants to their beds, set their rent due date, and download the Android app for daily rounds.
                </li>
              </ul>
            </section>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <Link
                href="/signup"
                style={{
                  display: 'inline-block',
                  padding: '14px 28px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Switch to RunMyPG — It’s Free →
              </Link>
            </div>
          </article>
        </div>
      </MarketingFrame>
    </>
  );
}
