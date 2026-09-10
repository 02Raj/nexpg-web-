'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { MAILTO, WHATSAPP_URL } from '@/content/contact';
import { WhatsAppFab } from '@/components/marketing/WhatsAppFab';
import s from './marketing.module.css';

export function MarketingFrame({
  children,
  navScrolled,
}: {
  children: React.ReactNode;
  navScrolled?: boolean;
}) {
  const { session } = useAuth();
  const isLoggedIn = Boolean(session);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const primaryHref = isLoggedIn ? '/dashboard' : '/signup';
  const primaryLabel = isLoggedIn ? 'Go to Dashboard' : 'Get started';

  return (
    <>
      <header>
        <nav className={`${s.navbar} ${navScrolled ? s.navbarScrolled : ''}`} aria-label="Primary">
          <div className={s.navLeft}>
            <Link href="/" className={s.navBrand}>
              <span className={s.navBrandMark}>R</span>
              <span className={s.navBrandName}>RunMyPG</span>
            </Link>
            <ul className={s.navLinks}>
              <li>
                <Link href="/#product" className={s.navLink}>
                  Product
                </Link>
              </li>
              <li>
                <Link href="/#features" className={s.navLink}>
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className={s.navLink}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className={s.navLink}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className={s.navLink}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className={s.navLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className={s.navRight}>
            {!isLoggedIn && (
              <Link href="/login" className={s.navBtnLogin}>
                Log in
              </Link>
            )}
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
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>
      </header>
      {mobileMenuOpen ? (
        <div className={s.mobileMenu}>
          <Link href="/#product" className={s.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
            Product
          </Link>
          <Link href="/#features" className={s.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
            Features
          </Link>
          <Link href="/#pricing" className={s.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Link>
          <Link href="/about" className={s.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Link href="/blog" className={s.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
            Blog
          </Link>
          <Link href="/contact" className={s.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          <div className={s.mobileMenuDivider} />
          {!isLoggedIn && (
            <Link href="/login" className={s.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
              Log in
            </Link>
          )}
          <Link href={primaryHref} className={s.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
            {primaryLabel} →
          </Link>
        </div>
      ) : null}
      {children}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div>
            <div className={s.footerBrand}>
              <span className={s.footerBrandMark}>R</span>
              <span className={s.footerBrandName}>RunMyPG</span>
            </div>
            <p className={s.footerDesc}>
              PG management software for Indian owners. Beds, rent, tenants, deposits — simplified.
            </p>
          </div>
          <div>
            <p className={s.footerColTitle}>Product</p>
            <ul className={s.footerLinks}>
              <li>
                <Link href="/#product" className={s.footerLink}>
                  Product
                </Link>
              </li>
              <li>
                <Link href="/#features" className={s.footerLink}>
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className={s.footerLink}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/cities" className={s.footerLink}>
                  Cities
                </Link>
              </li>
              <li>
                <Link href="/download" prefetch={false} className={s.footerLink}>
                  Android App
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className={s.footerColTitle}>Resources</p>
            <ul className={s.footerLinks}>
              <li>
                <Link href="/about" className={s.footerLink}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className={s.footerLink}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className={s.footerLink}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/#faq" className={s.footerLink}>
                  FAQ
                </Link>
              </li>
              <li>
                <a href={WHATSAPP_URL} className={s.footerLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={MAILTO.support} className={s.footerLink}>
                  support@runmypg.in
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className={s.footerColTitle}>Account</p>
            <ul className={s.footerLinks}>
              <li>
                <Link href="/login" className={s.footerLink}>
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/signup" className={s.footerLink}>
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={s.footerBottom}>
          <p className={s.footerCopy}>© {new Date().getFullYear()} RunMyPG. All rights reserved.</p>
          <p className={s.footerCities}>
            <Link href="/cities" className={s.footerLink}>
              Delhi · Noida · Gurgaon · Bengaluru · Pune · Hyderabad · more cities
            </Link>
          </p>
        </div>
      </footer>
      <WhatsAppFab />
    </>
  );
}
