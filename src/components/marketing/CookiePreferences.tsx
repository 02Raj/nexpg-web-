'use client';

import { useEffect, useState } from 'react';
import { readCookieConsent, writeCookieConsent } from '@/lib/cookies';
import p from './cookie-preferences.module.css';

export function CookiePreferences() {
  const [optional, setOptional] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOptional(readCookieConsent().optional);
  }, []);

  return (
    <div className={p.box}>
      <label className={p.row}>
        <input type="checkbox" checked disabled />
        <span>
          <strong>Necessary</strong>
          <span className={p.hint}>Session and login. Always on so the console can work.</span>
        </span>
      </label>
      <label className={p.row}>
        <input type="checkbox" checked={optional} onChange={(e) => { setOptional(e.target.checked); setSaved(false); }} />
        <span>
          <strong>Optional analytics</strong>
          <span className={p.hint}>Off by default. We do not load analytics today; this switch is ready if we add a privacy-respecting tool later.</span>
        </span>
      </label>
      <button
        type="button"
        className={p.save}
        onClick={() => {
          writeCookieConsent(optional);
          setSaved(true);
        }}
      >
        Save choices
      </button>
      {saved ? <p className={p.ok}>Saved on this browser.</p> : null}
    </div>
  );
}
