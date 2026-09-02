'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import s from './marketing.module.css';

/* ══════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════ */

const CITIES = ['Delhi NCR', 'Noida', 'Gurgaon', 'Bengaluru', 'Pune', 'Hyderabad'];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is NexPG really free?',
    a: "Yes. NexPG is completely free while we're in beta. We want to build the best PG management tool in India, and your feedback during this period is invaluable. When we introduce paid plans, early users will receive special benefits.",
  },
  {
    q: 'How does the Android app work?',
    a: 'After you create your account on the web, request the Android APK from the Download page. We review requests within 24 hours. Once approved, download the APK, install it, and sign in with the same email. All data syncs automatically.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. NexPG is built on Supabase with Row-Level Security (RLS). Your data is encrypted at rest and in transit. Only you can access your own property and tenant data — even we cannot see it.',
  },
  {
    q: 'Can I manage multiple PGs?',
    a: 'Yes. You can add as many properties as you want. Each property has its own rooms, beds, tenants, and billing — but you manage everything from a single dashboard with a simple property switcher.',
  },
  {
    q: 'Which cities do you support?',
    a: 'NexPG works everywhere, but we are built specifically for the Indian PG market. Our early users are primarily in Delhi NCR, Noida, Gurgaon, Bengaluru, Pune, and Hyderabad.',
  },
  {
    q: 'Do I need both the web and mobile app?',
    a: "No. The web console is the full-featured owner dashboard — best used on a laptop or desktop. The Android app is designed for on-the-go operations when you're on-site at your PG. Use one or both — your data stays in sync.",
  },
];

const PRICING_ITEMS = [
  'Unlimited beds & rooms',
  'Rent & bill tracking',
  'Tenant onboarding & KYC',
  'Security deposit management',
  'Multi-property support',
  'Android app access',
  'Web owner console',
  'No hidden charges',
];

/* ══════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════ */

export default function MarketingPage() {
  const { session } = useAuth();
  const isLoggedIn = Boolean(session);

  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const primaryHref = isLoggedIn ? '/dashboard' : '/signup';
  const primaryLabel = isLoggedIn ? 'Go to Dashboard' : 'Get started';

  return (
    <>
      {/* ── NAVBAR ── */}
      <Navbar
        scrolled={navScrolled}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((v) => !v)}
        onNav={scrollTo}
        primaryHref={primaryHref}
        primaryLabel={primaryLabel}
        isLoggedIn={isLoggedIn}
      />

      {/* ── HERO ── */}
      <header className={s.hero}>
        <div className={s.heroGrain} />
        <div className={s.heroGridDecor} />
        <div className={s.heroInner}>
          <div className={s.heroContent}>
            <p className={s.heroKicker}>PG Owner Console</p>
            <h1 className={s.heroTitle}>
              Run your PG<br />
              from <span className={s.heroTitleAccent}>one desk.</span>
            </h1>
            <p className={s.heroSubtitle}>
              Beds, rent, tenants, deposits and daily operations — everything a PG owner needs, synced between your laptop and your phone.
            </p>
            <div className={s.heroCtas}>
              <Link href={primaryHref} className={s.btnHeroPrimary}>
                {isLoggedIn ? 'Go to Dashboard →' : 'Get started — it\u2019s free'}
              </Link>
              <button type="button" className={s.btnHeroSecondary} onClick={() => scrollTo('how-it-works')}>
                See how it works
              </button>
            </div>
          </div>

          <div className={s.heroVisual}>
            <div className={s.heroVisualFrame} />
            <span className={`${s.heroMark} ${s.heroMarkTL}`} />
            <span className={`${s.heroMark} ${s.heroMarkBR}`} />
            <span className={`${s.heroMark} ${s.heroMarkLabel}`}>owner console v1</span>
            <DashboardMockup />
          </div>
        </div>
      </header>

      {/* ── SOCIAL PROOF ── */}
      <section className={s.socialProof}>
        <div className={s.socialProofInner}>
          <p className={s.socialProofLabel}>Built for PG owners across India</p>
          <span className={s.socialProofDivider} />
          <div className={s.cityList}>
            {CITIES.map((c) => (
              <span key={c} className={s.city}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={s.sectionWrap}>
        <div className={s.sectionInner}>
          <Reveal className={s.featuresHeader}>
            <p className={s.sectionKicker}>Features</p>
            <h2 className={s.sectionTitle}>Everything you need to run your PG. Nothing you don&apos;t.</h2>
            <p className={s.sectionSubtitle}>
              Purpose-built for Indian PG owners. No bloated hotel software, no spreadsheets — just the tools you actually use, done well.
            </p>
          </Reveal>
          <div className={s.bentoGrid}>
            {/* Large — Bed Occupancy */}
            <Reveal className={`${s.bentoCard} ${s.bentoLarge}`}>
              <span className={s.bentoCardKicker}>Primary Feature</span>
              <h3 className={s.bentoCardTitleLarge}>Bed Occupancy Map</h3>
              <p className={s.bentoCardDesc}>See every room, every bed, at a glance. Know exactly which beds are vacant, occupied, or reserved — without walking through hallways.</p>
              <div className={s.featureVisual}>
                <OccupancyVisual />
              </div>
            </Reveal>

            {/* Medium — Rent */}
            <Reveal className={`${s.bentoCard} ${s.bentoMedium}`} delay={80}>
              <h3 className={s.bentoCardTitle}>Rent & Bills</h3>
              <p className={s.bentoCardDesc}>Auto-generate monthly invoices, track pending payments, and get a clear picture of collections.</p>
              <div className={s.featureVisual}>
                <RentVisual />
              </div>
            </Reveal>

            {/* Medium — Tenant */}
            <Reveal className={`${s.bentoCard} ${s.bentoMedium}`} delay={160}>
              <h3 className={s.bentoCardTitle}>Tenant Onboarding</h3>
              <p className={s.bentoCardDesc}>KYC, ID proofs and agreements, organised in one place. Onboard new tenants in minutes.</p>
              <div className={s.featureVisual}>
                <TenantVisual />
              </div>
            </Reveal>

            {/* Small — Security */}
            <Reveal className={`${s.bentoCard} ${s.bentoSmall}`} delay={60}>
              <h3 className={s.bentoCardTitle}>Security Deposits</h3>
              <p className={s.bentoCardDesc}>Track deposits, deductions and refunds without digging through spreadsheets.</p>
              <div className={s.featureVisual}>
                <DepositVisual />
              </div>
            </Reveal>

            {/* Small — Multi-property */}
            <Reveal className={`${s.bentoCard} ${s.bentoSmall}`} delay={120}>
              <h3 className={s.bentoCardTitle}>Multi-property</h3>
              <p className={s.bentoCardDesc}>Manage multiple PGs from one console and switch properties instantly.</p>
              <div className={s.featureVisual}>
                <PropertyVisual />
              </div>
            </Reveal>

            {/* Small — Mobile + Web */}
            <Reveal className={`${s.bentoCard} ${s.bentoSmall}`} delay={180}>
              <h3 className={s.bentoCardTitle}>Mobile + Web</h3>
              <p className={s.bentoCardDesc}>Run daily operations from the Android app and keep your full owner console on the web.</p>
              <div className={s.featureVisual}>
                <SyncVisual />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className={s.sectionWrapAlt}>
        <div className={s.sectionInner}>
          <Reveal className={s.stepsHeader} style={{ textAlign: 'center' }}>
            <p className={s.sectionKicker}>How it works</p>
            <h2 className={s.sectionTitle} style={{ maxWidth: '100%', margin: '0 auto 16px' }}>Up and running in three steps.</h2>
            <p className={s.sectionSubtitle} style={{ maxWidth: '100%', margin: '0 auto' }}>
              No training sessions, no onboarding calls. Sign up, add your property, and you&apos;re managing.
            </p>
          </Reveal>
          <div className={s.stepsRow}>
            <Reveal className={s.step}>
              <p className={s.stepNum}>
                01
                <span className={s.stepDot} />
              </p>
              <h3 className={s.stepTitle}>Create your account</h3>
              <p className={s.stepDesc}>Sign up with your email. Takes 30 seconds — no credit card required.</p>
            </Reveal>
            <Reveal className={s.step} delay={120}>
              <p className={s.stepNum}>
                02
                <span className={s.stepDot} />
              </p>
              <h3 className={s.stepTitle}>Add your PG</h3>
              <p className={s.stepDesc}>Enter your property details, define floors and rooms, and set bed counts.</p>
            </Reveal>
            <Reveal className={s.step} delay={240}>
              <p className={s.stepNum}>
                03
                <span className={s.stepDot} />
              </p>
              <h3 className={s.stepTitle}>Start managing</h3>
              <p className={s.stepDesc}>Add tenants, track rent, generate bills, and monitor occupancy — all from one place.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className={s.sectionWrap}>
        <div className={s.sectionInner}>
          <div className={s.pricingLayout}>
            <Reveal className={s.pricingContent}>
              <p className={s.sectionKicker}>Pricing</p>
              <h2 className={s.sectionTitle}>Simple pricing. No surprises.</h2>
              <p className={s.sectionSubtitle} style={{ marginTop: 16 }}>
                NexPG is free while we&apos;re in beta. When we launch paid plans, early adopters will get priority access and special rates.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className={s.pricingPanel}>
                <div className={s.pricingPanelGrain} />
                <div className={s.pricingPanelInner}>
                  <span className={s.pricingBadge}>Beta Access</span>
                  <p className={s.pricingAmount}>₹0</p>
                  <p className={s.pricingPeriod}>Free while in beta — no credit card required</p>
                  <ul className={s.pricingList}>
                    {PRICING_ITEMS.map((item) => (
                      <li key={item} className={s.pricingListItem}>
                        <span className={s.pricingCheck}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={primaryHref} className={s.pricingCta}>
                    {isLoggedIn ? 'Go to Dashboard →' : 'Start for free →'}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className={s.sectionWrapAlt}>
        <div className={s.sectionInner}>
          <div className={s.faqLayout}>
            <Reveal className={s.faqContent}>
              <p className={s.sectionKicker}>FAQ</p>
              <h2 className={s.sectionTitle}>Questions?<br />We&apos;ve got answers.</h2>
              <p className={s.sectionSubtitle} style={{ marginTop: 16 }}>
                If something isn&apos;t covered here, reach out — we&apos;re always happy to help.
              </p>
            </Reveal>
            <div className={s.faqAccordion}>
              {FAQS.map((faq, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className={s.faqItem}>
                    <button
                      type="button"
                      className={s.faqQuestion}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      {faq.q}
                      <span className={`${s.faqIcon} ${openFaq === i ? s.faqIconOpen : ''}`}>+</span>
                    </button>
                    <div className={`${s.faqAnswer} ${openFaq === i ? s.faqAnswerOpen : ''}`}>
                      <p className={s.faqAnswerText}>{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className={s.finalCta}>
        <div className={s.finalCtaGrain} />
        <div className={s.finalCtaDecor} />
        <Reveal>
          <div className={s.finalCtaInner}>
            <h2 className={s.finalCtaTitle}>Start managing your PG today.</h2>
            <p className={s.finalCtaSubtitle}>
              Join PG owners across India who&apos;ve moved beyond spreadsheets and switched to NexPG.
            </p>
            <Link href={primaryHref} className={s.finalCtaBtn}>
              {isLoggedIn ? 'Go to Dashboard →' : 'Create free account →'}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div>
            <div className={s.footerBrand}>
              <span className={s.footerBrandMark}>N</span>
              <span className={s.footerBrandName}>NexPG</span>
            </div>
            <p className={s.footerDesc}>
              PG management platform for Indian owners. Beds, rent, tenants, deposits — simplified.
            </p>
          </div>
          <div>
            <p className={s.footerColTitle}>Product</p>
            <ul className={s.footerLinks}>
              <li><button type="button" className={s.footerLink} onClick={() => scrollTo('features')}>Features</button></li>
              <li><button type="button" className={s.footerLink} onClick={() => scrollTo('pricing')}>Pricing</button></li>
              <li><Link href="/download" className={s.footerLink}>Android App</Link></li>
            </ul>
          </div>
          <div>
            <p className={s.footerColTitle}>Account</p>
            <ul className={s.footerLinks}>
              <li><Link href="/login" className={s.footerLink}>Log in</Link></li>
              <li><Link href="/signup" className={s.footerLink}>Sign up</Link></li>
              <li><Link href="/forgot-password" className={s.footerLink}>Reset password</Link></li>
            </ul>
          </div>
          <div>
            <p className={s.footerColTitle}>Support</p>
            <ul className={s.footerLinks}>
              <li><button type="button" className={s.footerLink} onClick={() => scrollTo('faq')}>FAQ</button></li>
            </ul>
          </div>
        </div>
        <div className={s.footerBottom}>
          <p className={s.footerCopy}>© {new Date().getFullYear()} NexPG. All rights reserved.</p>
          <p className={s.footerCities}>Delhi NCR · Noida · Gurgaon · Bengaluru · Pune · Hyderabad</p>
        </div>
      </footer>
    </>
  );
}

/* ══════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════ */

function Navbar({
  scrolled,
  mobileMenuOpen,
  onToggleMenu,
  onNav,
  primaryHref,
  primaryLabel,
  isLoggedIn,
}: {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onNav: (id: string) => void;
  primaryHref: string;
  primaryLabel: string;
  isLoggedIn: boolean;
}) {
  return (
    <>
      <nav className={`${s.navbar} ${scrolled ? s.navbarScrolled : ''}`}>
        <div className={s.navLeft}>
          <Link href="/" className={s.navBrand}>
            <span className={s.navBrandMark}>N</span>
            <span className={s.navBrandName}>NexPG</span>
          </Link>
          <ul className={s.navLinks}>
            <li><button type="button" className={s.navLink} onClick={() => onNav('features')}>Features</button></li>
            <li><button type="button" className={s.navLink} onClick={() => onNav('pricing')}>Pricing</button></li>
            <li><button type="button" className={s.navLink} onClick={() => onNav('faq')}>FAQ</button></li>
          </ul>
        </div>
        <div className={s.navRight}>
          {!isLoggedIn && <Link href="/login" className={s.navBtnLogin}>Log in</Link>}
          <Link href={primaryHref} className={s.navBtnPrimary}>
            {primaryLabel}{!isLoggedIn && ' →'}
          </Link>
          <button type="button" className={s.mobileMenuBtn} onClick={onToggleMenu} aria-label="Toggle navigation">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className={s.mobileMenu}>
          <button type="button" className={s.mobileMenuLink} onClick={() => onNav('features')}>Features</button>
          <button type="button" className={s.mobileMenuLink} onClick={() => onNav('pricing')}>Pricing</button>
          <button type="button" className={s.mobileMenuLink} onClick={() => onNav('faq')}>FAQ</button>
          <div className={s.mobileMenuDivider} />
          {!isLoggedIn && <Link href="/login" className={s.mobileMenuLink} onClick={onToggleMenu}>Log in</Link>}
          <Link href={primaryHref} className={s.mobileMenuLink} onClick={onToggleMenu}>
            {primaryLabel} →
          </Link>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════
   DASHBOARD MOCKUP
   ══════════════════════════════════════════════════ */

function DashboardMockup() {
  return (
    <div className={s.mockup}>
      <div className={s.mockupChrome}>
        <span className={`${s.mockupDot} ${s.mockupDotRed}`} />
        <span className={`${s.mockupDot} ${s.mockupDotYellow}`} />
        <span className={`${s.mockupDot} ${s.mockupDotGreen}`} />
        <span className={s.mockupLabel}>NexPG — Dashboard</span>
      </div>
      <div className={s.mockupBody}>
        <div className={s.mockupHeader}>
          <span className={s.mockupHeaderTitle}>Sunrise PG</span>
          <span className={s.mockupHeaderBadge}>All synced</span>
        </div>

        <div className={s.mockupStats}>
          <div className={s.mockupStat}>
            <p className={s.mockupStatLabel}>Total Beds</p>
            <p className={s.mockupStatValue}>48</p>
          </div>
          <div className={s.mockupStat}>
            <p className={s.mockupStatLabel}>Occupied</p>
            <p className={s.mockupStatValue} style={{ color: 'var(--green)' }}>42</p>
          </div>
          <div className={s.mockupStat}>
            <p className={s.mockupStatLabel}>Pending</p>
            <p className={s.mockupStatValue} style={{ color: 'var(--ochre)' }}>₹1.2L</p>
          </div>
        </div>

        <div className={s.mockupRooms}>
          <MockupRoom name="Room 101" beds={[1, 1, 1]} amount="₹8,500" status="paid" />
          <MockupRoom name="Room 102" beds={[1, 1, 2]} amount="₹6,000" status="pending" />
          <MockupRoom name="Room 103" beds={[1, 0, 0]} amount="₹3,500" status="due" />
          <MockupRoom name="Room 104" beds={[1, 1, 1, 1]} amount="₹12,000" status="paid" />
        </div>
      </div>
    </div>
  );
}

/** bed: 0 = vacant, 1 = occupied, 2 = pending */
function MockupRoom({ name, beds, amount, status }: {
  name: string;
  beds: number[];
  amount: string;
  status: 'paid' | 'pending' | 'due';
}) {
  const statusCls = status === 'paid' ? s.mockupStatusPaid : status === 'pending' ? s.mockupStatusPending : s.mockupStatusDue;
  const statusLabel = status === 'paid' ? 'Paid' : status === 'pending' ? 'Pending' : 'Due';

  return (
    <div className={s.mockupRoom}>
      <span className={s.mockupRoomName}>{name}</span>
      <div className={s.mockupRoomBeds}>
        {beds.map((b, i) => (
          <span
            key={i}
            className={`${s.mockupBed} ${b === 1 ? s.mockupBedOccupied : b === 2 ? s.mockupBedPending : s.mockupBedVacant}`}
          />
        ))}
      </div>
      <span className={s.mockupRoomAmount}>{amount}</span>
      <span className={`${s.mockupRoomStatus} ${statusCls}`}>{statusLabel}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   FEATURE CARD VISUALS
   ══════════════════════════════════════════════════ */

function OccupancyVisual() {
  const rooms = [
    { label: 'Room 101', beds: ['full', 'full', 'empty'] },
    { label: 'Room 102', beds: ['full', 'full', 'full'] },
    { label: 'Room 103', beds: ['full', 'empty', 'empty'] },
    { label: 'Room 104', beds: ['full', 'full', 'pending'] },
  ];

  return (
    <div className={s.occGrid}>
      {rooms.map((r) => (
        <div key={r.label} className={s.occRow}>
          <span className={s.occLabel}>{r.label}</span>
          <div className={s.occDots}>
            {r.beds.map((b, i) => (
              <span
                key={i}
                className={`${s.occDot} ${b === 'full' ? s.occDotFull : b === 'pending' ? s.occDotPending : s.occDotEmpty}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RentVisual() {
  return (
    <div className={s.rentRows}>
      <div className={s.rentRow}>
        <div className={s.rentRowLeft}>
          <span className={s.rentRowName}>Amit S.</span>
          <span className={`${s.rentTag} ${s.rentTagPaid}`}>Paid</span>
        </div>
        <span className={s.rentRowAmt}>₹8,500</span>
      </div>
      <div className={s.rentRow}>
        <div className={s.rentRowLeft}>
          <span className={s.rentRowName}>Priya R.</span>
          <span className={`${s.rentTag} ${s.rentTagPending}`}>Pending</span>
        </div>
        <span className={s.rentRowAmt}>₹6,000</span>
      </div>
      <div className={s.rentRow}>
        <div className={s.rentRowLeft}>
          <span className={s.rentRowName}>Rahul K.</span>
          <span className={`${s.rentTag} ${s.rentTagPaid}`}>Paid</span>
        </div>
        <span className={s.rentRowAmt}>₹7,500</span>
      </div>
    </div>
  );
}

function TenantVisual() {
  const tenants = [
    { init: 'A', name: 'Amit Sharma', status: 'KYC Done' },
    { init: 'P', name: 'Priya Rao', status: 'Verified' },
    { init: 'R', name: 'Rahul Kumar', status: 'KYC Done' },
  ];

  return (
    <div className={s.tenantRows}>
      {tenants.map((t) => (
        <div key={t.name} className={s.tenantRow}>
          <span className={s.tenantAvatar}>{t.init}</span>
          <span className={s.tenantName}>{t.name}</span>
          <span className={s.tenantStatus}>{t.status}</span>
        </div>
      ))}
    </div>
  );
}

function DepositVisual() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>₹15,000</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Refunded ₹12,500</span>
      </div>
      <div className={s.depositBar}>
        <div className={s.depositBarFill} style={{ width: '83%' }} />
      </div>
      <div className={s.depositMeta}>
        <span className={s.depositMetaText}>Deductions: ₹2,500</span>
        <span className={s.depositMetaText}>83% returned</span>
      </div>
    </>
  );
}

function PropertyVisual() {
  return (
    <div className={s.propSwitcher}>
      <div className={`${s.propItem} ${s.propItemActive}`}>
        <span className={`${s.propItemDot} ${s.propItemDotActive}`} />
        <span className={s.propItemName}>Sunrise PG</span>
        <span className={s.propItemCity}>Noida</span>
      </div>
      <div className={s.propItem}>
        <span className={s.propItemDot} />
        <span className={s.propItemName}>Green Valley PG</span>
        <span className={s.propItemCity}>Gurgaon</span>
      </div>
    </div>
  );
}

function SyncVisual() {
  return (
    <div className={s.syncVisual}>
      <div className={s.syncDevice}>
        <div className={s.syncDeviceBox}><span className={s.syncDeviceDot} /></div>
        <p className={s.syncDeviceLabel}>Web</p>
      </div>
      <span className={s.syncArrow}>⟷</span>
      <div className={s.syncDevice}>
        <div className={s.syncDeviceBoxMobile}><span className={s.syncDeviceDot} /></div>
        <p className={s.syncDeviceLabel}>Android</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════ */

function Reveal({
  children,
  className,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${s.reveal} ${visible ? s.revealVisible : ''} ${className ?? ''}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
