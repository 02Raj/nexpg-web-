import Link from 'next/link';
import { MAILTO, WHATSAPP_URL } from '@/content/contact';
import { CookieBanner } from '@/components/marketing/CookieBanner';
import { WhatsAppFab } from '@/components/marketing/WhatsAppFab';
import s from './marketing.module.css';

export function MarketingFooter() {
  return (
    <>
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div>
            <div className={s.footerBrand}>
              <span className={s.footerBrandMark}>R</span>
              <span className={s.footerBrandName}>RunMyPG</span>
            </div>
            <p className={s.footerDesc}>
              Owner software for Indian PGs and hostels. Tenants, rooms, occupancy, rent and deposits — on the web and on Android.
            </p>
          </div>
          <div>
            <p className={s.footerColTitle}>Product</p>
            <ul className={s.footerLinks}>
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
            <p className={s.footerColTitle}>Company</p>
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
          <div>
            <p className={s.footerColTitle}>Resources</p>
            <ul className={s.footerLinks}>
              <li>
                <Link href="/help" className={s.footerLink}>
                  Help Center
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
            <p className={s.footerColTitle}>Legal</p>
            <ul className={s.footerLinks}>
              <li>
                <Link href="/privacy" className={s.footerLink}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={s.footerLink}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className={s.footerLink}>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className={s.footerLink}>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies/preferences" className={s.footerLink}>
                  Cookie Preferences
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
      <CookieBanner />
      <WhatsAppFab />
    </>
  );
}
