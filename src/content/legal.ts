export const LEGAL_UPDATED = '11 September 2026';

export type LegalSection = { heading: string; paragraphs: string[] };

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Who we are',
    paragraphs: [
      'RunMyPG (“we”, “us”) provides web and Android software for paying guest and hostel owners in India. This policy explains what we collect when you use www.runmypg.in, the owner console, and the Android app.',
      'It is written for how the product actually works today. It is not a copy of another company’s policy. Indian law, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (as applicable), informs how we handle personal data.',
    ],
  },
  {
    heading: 'What we collect',
    paragraphs: [
      'Account data: name, email, and password (stored hashed). We send a confirmation email when you sign up and a reset link if you forget your password.',
      'Property and operations data you enter: building name, address, city, state, rooms, beds, tenant names and contacts, rent amounts, bill status, and security deposits. That data belongs to your account. Other owners cannot see it.',
      'If you email or WhatsApp us, we receive whatever you send (for example a screenshot of an error). We use that only to reply and fix the issue.',
      'Technical logs: browser type, approximate time of requests, and crash or error messages needed to keep the service up. We do not sell this.',
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: [
      'To run the owner console and the Android app — occupancy, tenants, bills and deposits.',
      'To authenticate you, reset passwords, and tell you about service changes that affect your account.',
      'To diagnose bugs you report to support@runmypg.in.',
    ],
  },
  {
    heading: 'Processors',
    paragraphs: [
      'Hosting, authentication and database currently run on our cloud providers. They process data on our instructions, not as a public directory of your tenants.',
      'WhatsApp and email are third-party networks. If you contact us there, those providers’ terms also apply to the message in transit.',
    ],
  },
  {
    heading: 'Cookies',
    paragraphs: [
      'We use strictly necessary cookies or similar storage so you stay signed in and so the site remembers cookie choices you make. We do not run advertising pixels on the marketing site today.',
      'You can review choices on the Cookie preferences page. Turning off necessary storage will stop login from working.',
    ],
  },
  {
    heading: 'Sharing',
    paragraphs: [
      'We do not sell tenant lists or owner emails. We share data only with processors who host the product, if the law requires it, or if you ask us to (for example a data export).',
    ],
  },
  {
    heading: 'Retention and your rights',
    paragraphs: [
      'We keep account and property data while your account is active. If you want deletion, email support@runmypg.in from the same address you use to log in. We will delete or anonymise operational data that is no longer needed, except where we must keep a record of a request.',
      'You may ask for a copy of personal data we hold about you as the account holder.',
    ],
  },
  {
    heading: 'Children',
    paragraphs: [
      'RunMyPG is for property operators, not for children. Do not create an owner account for anyone under 18.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      'Privacy questions: contact@runmypg.in. Support: support@runmypg.in. WhatsApp: +91 87070 54586.',
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'The service',
    paragraphs: [
      'RunMyPG is software for owners to record beds, tenants, rent bills and deposits. It is an operations console. It is not a lawyer, an accountant, a payment gateway, or a tenant-facing portal.',
      'The product is free while we are in beta. Features can change. We will not pretend there is a ₹1 trial or an auto-renewal we do not run.',
    ],
  },
  {
    heading: 'Your account',
    paragraphs: [
      'You must use a real email you control. You are responsible for the password and for activity on the account.',
      'You must have the right to store the tenant and property information you type in. Do not upload data you are not allowed to hold.',
    ],
  },
  {
    heading: 'Acceptable use',
    paragraphs: [
      'Do not probe, scrape, or overload the service. Do not use it to send spam. Do not try to access another owner’s property.',
      'We may suspend an account that harms the service or other users.',
    ],
  },
  {
    heading: 'Beta and availability',
    paragraphs: [
      'Software can fail. Take your own backups of critical numbers if you need them offline. We work to keep the console available but we do not guarantee uninterrupted uptime during beta.',
    ],
  },
  {
    heading: 'Android app',
    paragraphs: [
      'The Android build may be distributed as an APK outside Play Store. You install it at your own device’s risk and must allow unknown sources if Android asks. Sign in with the same email as the website.',
    ],
  },
  {
    heading: 'Liability',
    paragraphs: [
      'To the extent Indian law allows, RunMyPG is provided as-is. We are not liable for lost rent, empty beds you did not notice, or disputes with tenants. The console stores what you enter; it does not verify IDs or police records.',
    ],
  },
  {
    heading: 'Governing law',
    paragraphs: [
      'These terms are governed by the laws of India. If a dispute cannot be resolved by email, courts in India will have jurisdiction.',
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      'If we change these terms in a material way, we will update the date on this page. Continued use after that date means you accept the update.',
    ],
  },
];

export const REFUND_SECTIONS: LegalSection[] = [
  {
    heading: 'Beta: nothing to charge',
    paragraphs: [
      'RunMyPG does not charge a subscription while the product is in beta. There is no card on file for the console, no ₹1 activation fee, and no auto-renewal. If you never paid us, there is no refund to process.',
    ],
  },
  {
    heading: 'If paid plans start later',
    paragraphs: [
      'When we introduce paid plans we will describe price, billing period, and how to cancel on the pricing page before we take money.',
      'If you prepaid for a period and the service is unavailable for a prolonged time that is our fault, email support@runmypg.in. We will refund unused prepaid time in good faith or extend the period — we will say which in writing.',
      'We will not refund because you changed your mind after a paid period has been fully used, or because a tenant did not pay rent. The software is a ledger, not a collection agency.',
    ],
  },
  {
    heading: 'Android app',
    paragraphs: [
      'The Android APK, when we provide it, is free. There is no in-app purchase in the current app.',
    ],
  },
  {
    heading: 'How to ask',
    paragraphs: [
      'Write to support@runmypg.in from the email on your account. Include the date and what you believe you paid (if anything). We aim to reply within a few working days.',
    ],
  },
];

export const COOKIE_SECTIONS: LegalSection[] = [
  {
    heading: 'What we use cookies for',
    paragraphs: [
      'Cookies and similar storage (localStorage) are small files on your device. RunMyPG uses them so the site can function — not to build an advertising profile.',
    ],
  },
  {
    heading: 'Necessary',
    paragraphs: [
      'Session cookies keep you logged into the owner console. Without them you would sign in on every click. Preference storage remembers whether you accepted or limited cookies.',
      'These are required for the product. You can delete them in the browser; you will be signed out.',
    ],
  },
  {
    heading: 'Optional',
    paragraphs: [
      'We do not currently load third-party analytics or ads on the marketing site. If we add a privacy-respecting analytics tool later, it will only run if you switch Optional on in Cookie preferences.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      'Open Cookie preferences to allow or refuse optional storage. Necessary cookies stay on because login cannot work without them.',
      'You can also block cookies in the browser. That may break the console.',
    ],
  },
];
