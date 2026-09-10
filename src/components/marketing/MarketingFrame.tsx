'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
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
      <MarketingFooter />
    </>
  );
}
