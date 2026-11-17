const KEY = 'runmypg-cookie-consent';

export type CookieConsent = {
  necessary: true;
  optional: boolean;
  decided: boolean;
};

const DEFAULT: CookieConsent = { necessary: true, optional: false, decided: false };

export function readCookieConsent(): CookieConsent {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    return {
      necessary: true,
      optional: Boolean(parsed.optional),
      decided: Boolean(parsed.decided),
    };
  } catch {
    return DEFAULT;
  }
}

export function writeCookieConsent(optional: boolean) {
  const value: CookieConsent = { necessary: true, optional, decided: true };
  localStorage.setItem(KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('runmypg-cookie-consent'));
  return value;
}
