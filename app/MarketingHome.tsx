'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CITIES, MARKETING_CAPABILITIES, MARKETING_FAQS, PRICING_ITEMS } from '@/content/marketing';
import { getLatestPosts } from '@/content/blog';
import { getCityGuides } from '@/content/cities';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { useAuth } from '@/providers/AuthProvider';
import s from '@/components/marketing/marketing.module.css';
import b from './blog/blog.module.css';

/* ══════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════ */

export function MarketingHome() {
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

  const closeMenu = () => setMobileMenuOpen(false);

  const latestPosts = getLatestPosts(3);
  const primaryHref = isLoggedIn ? '/dashboard' : '/signup';
  const primaryLabel = isLoggedIn ? 'Go to Dashboard' : 'Get started';

  return (
    <>
      <Navbar
        scrolled={navScrolled}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((v) => !v)}
        onCloseMenu={closeMenu}
        primaryHref={primaryHref}
        primaryLabel={primaryLabel}
        isLoggedIn={isLoggedIn}
      />

      <main>
      <section className={s.hero} aria-labelledby="hero-heading">
        <div className={s.heroGrain} />
        <div className={s.heroGridDecor} />
        <div className={s.heroInner}>
          <div className={s.heroContent}>
            <p className={s.heroKicker}>PG management software · India</p>
            <h1 id="hero-heading" className={s.heroTitle}>
              Run your PG<br />
              from <span className={s.heroTitleAccent}>one dashboard.</span>
            </h1>
            <p className={s.heroSubtitle}>
              Manage tenants, rooms, occupancy, rent and deposits in one place. Available as a web console and an Android app.
            </p>
            <ul className={s.heroCaps}>
              {MARKETING_CAPABILITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={s.heroCtas}>
              <Link href={primaryHref} className={s.btnHeroPrimary}>
                {isLoggedIn ? 'Go to Dashboard →' : 'Get started — it\u2019s free'}
              </Link>
              <a href="#product" className={s.btnHeroSecondary}>
                See the product
              </a>
            </div>
          </div>

          <div className={s.heroVisual}>
            <div className={s.heroVisualFrame} />
            <span className={`${s.heroMark} ${s.heroMarkTL}`} />
            <span className={`${s.heroMark} ${s.heroMarkBR}`} />
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className={s.socialProof}>
        <div className={s.socialProofInner}>
            <p className={s.socialProofLabel}>PG management software for owners across India</p>
          <span className={s.socialProofDivider} />
          <div className={s.cityList}>
            {CITIES.map((name) => {
              const guide = getCityGuides().find((city) => city.name === name);
              return guide ? (
                <Link key={name} href={`/cities/${guide.slug}`} className={s.city}>
                  {name}
                </Link>
              ) : (
                <span key={name} className={s.city}>
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCT SHOWCASE (Web + Mobile) ── */}
      <section id="product" className={s.productSection}>
        <div className={s.sectionInner}>
          <Reveal className={s.productHeader}>
            <p className={s.sectionKicker}>Product</p>
            <h2 className={s.sectionTitle}>Web console and Android app.</h2>
            <p className={s.sectionSubtitle}>
              Full owner dashboard in the browser. Android when you are at the property — occupancy, tenants, rent and bills.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className={s.productShowcase}>
              <div className={s.productWebCol}>
                <div className={s.productLabel}>
                  <span className={s.productLabelDot} />
                  Web owner console
                </div>
                <WebConsoleMockup large />
                <p className={s.productCaption}>Dashboard, occupancy, bills and settings — the full owner console.</p>
              </div>

              <div className={s.productMobileCol}>
                <div className={s.productLabel}>
                  <span className={`${s.productLabelDot} ${s.productLabelDotMobile}`} />
                  Android app
                </div>
                <div className={s.phoneRow}>
                  <MobilePhoneMockup screen="dashboard" tilt="left" />
                  <MobilePhoneMockup screen="beds" tilt="center" featured />
                  <MobilePhoneMockup screen="bills" tilt="right" />
                </div>
                <p className={s.productCaption}>On site: check occupancy, add a tenant, mark rent paid.</p>
              </div>
            </div>

          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={s.sectionWrap}>
        <div className={s.sectionInner}>
          <Reveal className={s.featuresHeader}>
            <p className={s.sectionKicker}>Features</p>
            <h2 className={s.sectionTitle}>Everything you need to run your PG. Nothing you don&apos;t.</h2>
            <p className={s.sectionSubtitle}>
              Built for Indian PG and hostel owners: occupancy, tenants, rent and deposits — not hotel PMS.
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
              <p className={s.bentoCardDesc}>Add tenants to beds, set rent and security deposit, and keep contact details in one place.</p>
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
              <h3 className={s.bentoCardTitle}>Web + Android</h3>
              <p className={s.bentoCardDesc}>Owner dashboard on the web. Android app for the property. Same login.</p>
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
              <p className={s.stepDesc}>Enter property name, state, city and address. Define rooms and beds — works in any Indian city.</p>
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
                RunMyPG is free while we&apos;re in beta. When we launch paid plans, early adopters will get priority access and special rates.
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
              {MARKETING_FAQS.map((faq, i) => (
                <Reveal key={faq.q} delay={i * 50}>
                  <div className={s.faqItem}>
                    <button
                      type="button"
                      className={s.faqQuestion}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      aria-controls={`faq-answer-${i}`}
                      id={`faq-question-${i}`}
                    >
                      {faq.q}
                      <span className={`${s.faqIcon} ${openFaq === i ? s.faqIconOpen : ''}`}>+</span>
                    </button>
                    <div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      className={`${s.faqAnswer} ${openFaq === i ? s.faqAnswerOpen : ''}`}
                    >
                      <p className={s.faqAnswerText}>{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className={s.sectionWrapAlt}>
        <div className={s.sectionInner}>
          <Reveal className={s.featuresHeader}>
            <p className={s.sectionKicker}>Our story</p>
            <h2 className={s.sectionTitle}>Built for Indian PG &amp; hostel operators.</h2>
            <p className={s.sectionSubtitle}>
              RunMyPG exists so owners can run occupancy, rent and deposits from one desk — not from Excel, WhatsApp and a walk through every floor.
            </p>
          </Reveal>
          <p style={{ textAlign: 'center', margin: 0 }}>
            <Link href="/about" className={s.footerLink} style={{ fontWeight: 600 }}>
              Read about RunMyPG →
            </Link>
          </p>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section id="blog" className={s.sectionWrap}>
        <div className={s.sectionInner}>
          <Reveal className={s.featuresHeader}>
            <p className={s.sectionKicker}>Blog</p>
            <h2 className={s.sectionTitle}>Guides for PG owners.</h2>
            <p className={s.sectionSubtitle}>
              Occupancy, rent, deposits and software — written for Indian PG operators, not hotel chains.
            </p>
          </Reveal>
          <div className={b.grid} style={{ marginBottom: 28 }}>
            {latestPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={b.card}>
                <div className={b.cardMeta}>
                  <span>{post.category}</span>
                  <span>{post.readMins} min</span>
                </div>
                <h3 className={b.cardTitle}>{post.title}</h3>
                <p className={b.cardDesc}>{post.description}</p>
                <span className={b.cardMore}>Read guide →</span>
              </Link>
            ))}
          </div>
          <p style={{ textAlign: 'center', margin: 0 }}>
            <Link href="/blog" className={s.footerLink} style={{ fontWeight: 600 }}>
              View all guides →
            </Link>
          </p>
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
              Put occupancy, tenants and rent on one dashboard. Free while we are in beta.
            </p>
            <Link href={primaryHref} className={s.finalCtaBtn}>
              {isLoggedIn ? 'Go to Dashboard →' : 'Create free account →'}
            </Link>
          </div>
        </Reveal>
      </section>
      </main>

      <MarketingFooter />
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
  onCloseMenu,
  primaryHref,
  primaryLabel,
  isLoggedIn,
}: {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  primaryHref: string;
  primaryLabel: string;
  isLoggedIn: boolean;
}) {
  return (
    <>
      <header>
      <nav className={`${s.navbar} ${scrolled ? s.navbarScrolled : ''}`} aria-label="Primary">
        <div className={s.navLeft}>
          <Link href="/" className={s.navBrand}>
            <span className={s.navBrandMark}>R</span>
            <span className={s.navBrandName}>RunMyPG</span>
          </Link>
          <ul className={s.navLinks}>
            <li><a href="#product" className={s.navLink}>Product</a></li>
            <li><a href="#features" className={s.navLink}>Features</a></li>
            <li><a href="#pricing" className={s.navLink}>Pricing</a></li>
            <li><Link href="/about" className={s.navLink}>About</Link></li>
            <li><Link href="/blog" className={s.navLink}>Blog</Link></li>
            <li><Link href="/contact" className={s.navLink}>Contact</Link></li>
          </ul>
        </div>
        <div className={s.navRight}>
          {!isLoggedIn && <Link href="/login" className={s.navBtnLogin}>Log in</Link>}
          <Link href={primaryHref} className={s.navBtnPrimary}>
            <span className={s.navCtaLong}>
              {primaryLabel}
              {!isLoggedIn ? ' →' : ''}
            </span>
            <span className={s.navCtaShort}>{isLoggedIn ? 'Open' : 'Start'}</span>
          </Link>
          <button
            type="button"
            className={s.mobileMenuBtn}
            onClick={onToggleMenu}
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      </header>

      {mobileMenuOpen && (
        <div className={s.mobileMenu}>
          <a href="#product" className={s.mobileMenuLink} onClick={onCloseMenu}>Product</a>
          <a href="#features" className={s.mobileMenuLink} onClick={onCloseMenu}>Features</a>
          <a href="#pricing" className={s.mobileMenuLink} onClick={onCloseMenu}>Pricing</a>
          <Link href="/about" className={s.mobileMenuLink} onClick={onCloseMenu}>About</Link>
          <Link href="/blog" className={s.mobileMenuLink} onClick={onCloseMenu}>Blog</Link>
          <Link href="/contact" className={s.mobileMenuLink} onClick={onCloseMenu}>Contact</Link>
          <a href="#faq" className={s.mobileMenuLink} onClick={onCloseMenu}>FAQ</a>
          <div className={s.mobileMenuDivider} />
          {!isLoggedIn && <Link href="/login" className={s.mobileMenuLink} onClick={onCloseMenu}>Log in</Link>}
          <Link href={primaryHref} className={s.mobileMenuLink} onClick={onCloseMenu}>
            {primaryLabel} →
          </Link>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════
   HERO SHOWCASE + PRODUCT MOCKUPS
   ══════════════════════════════════════════════════ */

function HeroShowcase() {
  return (
    <div className={s.heroShowcase}>
      <div className={s.heroShowcaseWeb}>
        <WebConsoleMockup />
      </div>
      <div className={s.heroShowcasePhone}>
        <MobilePhoneMockup screen="beds" featured />
      </div>
    </div>
  );
}

function WebConsoleMockup({ large }: { large?: boolean }) {
  return (
    <div className={[s.webMock, large ? s.webMockLarge : ''].filter(Boolean).join(' ')}>
      <div className={s.webMockChrome}>
        <span className={`${s.mockupDot} ${s.mockupDotRed}`} />
        <span className={`${s.mockupDot} ${s.mockupDotYellow}`} />
        <span className={`${s.mockupDot} ${s.mockupDotGreen}`} />
        <span className={s.mockupLabel}>RunMyPG — Dashboard</span>
      </div>
      <div className={s.webMockBody}>
        <aside className={s.webSidebar}>
          <div className={s.webSidebarBrand}>
            <span className={s.webSidebarMark}>R</span>
            {large ? <span className={s.webSidebarName}>RunMyPG</span> : null}
          </div>
          {large ? (
            <p className={s.webSidebarProperty}>
              <small>Active property</small>
              Sharma PG · Noida
            </p>
          ) : null}
          <nav className={s.webSidebarNav}>
            <span className={`${s.webNavItem} ${s.webNavItemActive}`}>Dashboard</span>
            <span className={s.webNavItem}>Beds</span>
            <span className={s.webNavItem}>Bills</span>
            <span className={s.webNavItem}>Settings</span>
          </nav>
        </aside>
        <main className={s.webMain}>
          <div className={s.webMainTop}>
            <div>
              <p className={s.webMainKicker}>Dashboard</p>
              <h3 className={s.webMainTitle}>Sharma PG</h3>
            </div>
            <span className={s.webMainPill}>September 2026</span>
          </div>
          <div className={s.webStats}>
            <div className={s.webStat}>
              <p>Occupied</p>
              <strong className={s.webStatGreen}>42</strong>
            </div>
            <div className={s.webStat}>
              <p>Empty</p>
              <strong className={s.webStatRed}>6</strong>
            </div>
            <div className={s.webStat}>
              <p>Collected</p>
              <strong>₹14,000</strong>
            </div>
            <div className={s.webStat}>
              <p>Pending</p>
              <strong className={s.webStatOchre}>₹0</strong>
            </div>
          </div>
          <div className={s.webBedSection}>
            <p className={s.webBedLabel}>Quick occupancy</p>
            <div className={s.webRoom}>
              <span>Room 1</span>
              <div className={s.webBeds}>
                <span className={s.webBedOn}>A · Divyansh</span>
                <span className={s.webBedOn}>B · Hridyansh</span>
              </div>
            </div>
            <div className={s.webRoom}>
              <span>Room 2</span>
              <div className={s.webBeds}>
                <span className={s.webBedOn}>A · Priya</span>
                <span className={s.webBedEmpty}>B · Empty</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

type MobileScreen = 'dashboard' | 'beds' | 'bills';

function MobilePhoneMockup({
  screen,
  tilt,
  featured,
}: {
  screen: MobileScreen;
  tilt?: 'left' | 'center' | 'right';
  featured?: boolean;
}) {
  return (
    <div
      className={[
        s.phone,
        featured ? s.phoneFeatured : '',
        tilt === 'left' ? s.phoneTiltLeft : '',
        tilt === 'right' ? s.phoneTiltRight : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={s.phoneFrame}>
        <div className={s.phoneNotch} />
        <div className={s.phoneScreen}>
          {screen === 'dashboard' ? <MobileDashboardScreen /> : null}
          {screen === 'beds' ? <MobileBedsScreen /> : null}
          {screen === 'bills' ? <MobileBillsScreen /> : null}
        </div>
        <div className={s.phoneHomeBar} />
      </div>
      <p className={s.phoneCaption}>
        {screen === 'dashboard' ? 'Dashboard' : screen === 'beds' ? 'Beds' : 'Bills'}
      </p>
    </div>
  );
}

function MobileDashboardScreen() {
  return (
    <div className={s.mScreen}>
      <p className={s.mKicker}>Sharma PG</p>
      <h4 className={s.mTitle}>Overview</h4>
      <div className={s.mStats}>
        <div><span>Occupied</span><strong>2</strong></div>
        <div><span>Empty</span><strong>0</strong></div>
        <div><span>Pending</span><strong className={s.mOchre}>₹0</strong></div>
      </div>
      <div className={s.mCard}>
        <p className={s.mCardTitle}>This month</p>
        <p className={s.mCardValue}>₹14,000 collected</p>
      </div>
      <div className={s.mBottomNav}>
        <span className={s.mNavOn}>Home</span>
        <span>Beds</span>
        <span>Bills</span>
        <span>More</span>
      </div>
    </div>
  );
}

function MobileBedsScreen() {
  return (
    <div className={s.mScreen}>
      <p className={s.mKicker}>Beds</p>
      <h4 className={s.mTitle}>Occupancy</h4>
      <div className={s.mRoomCard}>
        <p>Room 1 · 2/2 filled</p>
        <div className={s.mBedRow}>
          <span className={s.mBedFilled}>A Divyansh</span>
          <span className={s.mBedFilled}>B Hridyansh</span>
        </div>
      </div>
      <div className={s.mRoomCard}>
        <p>Room 2 · 1/2 filled</p>
        <div className={s.mBedRow}>
          <span className={s.mBedFilled}>A Priya</span>
          <span className={s.mBedVacant}>B Empty</span>
        </div>
      </div>
      <div className={s.mBottomNav}>
        <span>Home</span>
        <span className={s.mNavOn}>Beds</span>
        <span>Bills</span>
        <span>More</span>
      </div>
    </div>
  );
}

function MobileBillsScreen() {
  return (
    <div className={s.mScreen}>
      <p className={s.mKicker}>Bills</p>
      <h4 className={s.mTitle}>September 2026</h4>
      <div className={s.mBillRow}>
        <div>
          <strong>Divyansh</strong>
          <span>Room 1-A</span>
        </div>
        <span className={s.mBillPaid}>Paid</span>
      </div>
      <div className={s.mBillRow}>
        <div>
          <strong>Hridyansh</strong>
          <span>Room 1-B</span>
        </div>
        <span className={s.mBillPaid}>Paid</span>
      </div>
      <div className={s.mBillRow}>
        <div>
          <strong>Priya</strong>
          <span>Room 2-A</span>
        </div>
        <span className={s.mBillPending}>Pending</span>
      </div>
      <div className={s.mBottomNav}>
        <span>Home</span>
        <span>Beds</span>
        <span className={s.mNavOn}>Bills</span>
        <span>More</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   DASHBOARD MOCKUP (legacy — used in bento if needed)
   ══════════════════════════════════════════════════ */

function DashboardMockup() {
  return (
    <div className={s.mockup}>
      <div className={s.mockupChrome}>
        <span className={`${s.mockupDot} ${s.mockupDotRed}`} />
        <span className={`${s.mockupDot} ${s.mockupDotYellow}`} />
        <span className={`${s.mockupDot} ${s.mockupDotGreen}`} />
        <span className={s.mockupLabel}>RunMyPG — Dashboard</span>
      </div>
      <div className={s.mockupBody}>
        <div className={s.mockupHeader}>
          <span className={s.mockupHeaderTitle}>Sunrise PG</span>
          <span className={s.mockupHeaderBadge}>This month</span>
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
    { init: 'A', name: 'Amit Sharma', status: 'Room 101-A' },
    { init: 'P', name: 'Priya Rao', status: '₹8,000/mo' },
    { init: 'R', name: 'Rahul Kumar', status: 'Room 102-B' },
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
