'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readCookieConsent, writeCookieConsent } from '@/lib/cookies';
import c from './cookie-banner.module.css';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sync = () => setShow(!readCookieConsent().decided);
    sync();
    window.addEventListener('runmypg-cookie-consent', sync);
    return () => window.removeEventListener('runmypg-cookie-consent', sync);
  }, []);

  if (!show) return null;

  return (
    <div className={c.bar} role="dialog" aria-label="Cookie choices">
      <p className={c.text}>
        We use necessary cookies so login works. Optional analytics stay off until you allow them.{' '}
        <Link href="/cookies">Cookie policy</Link>
      </p>
      <div className={c.actions}>
        <button type="button" className={c.ghost} onClick={() => { writeCookieConsent(false); setShow(false); }}>
          Necessary only
        </button>
        <button type="button" className={c.ok} onClick={() => { writeCookieConsent(true); setShow(false); }}>
          Accept
        </button>
      </div>
    </div>
  );
}
