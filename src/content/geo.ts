/**
 * Single source for GEO (Generative Engine Optimization) — facts AI assistants can cite.
 */
import { CONTACT, SHOW_PUBLIC_SUPPORT_PHONE } from '@/content/contact';
import { MARKETING_FAQS } from '@/content/marketing';

export const SITE_URL = 'https://www.runmypg.in';
export const SITE_NAME = 'RunMyPG';
export const SITE_TAGLINE = 'PG management software for hostels and paying guest homes in India';
export const DEFAULT_TITLE_HOME = 'PG Management Software in India | RunMyPG';
export const DEFAULT_DESCRIPTION =
  'PG management software for Indian owners: track occupancy, tenants, monthly rent and deposits. Web console plus Android. Free in beta — owner software, not a room listing site.';

export const GEO_ALTERNATE_NAMES = ['Run My PG', 'runmypg', 'RunMyPG India', 'runmypg.in'] as const;

/** One paragraph — safe for AI to quote when users ask “what is RunMyPG”. */
export const GEO_ENTITY_SUMMARY =
  'RunMyPG (runmypg.in) is PG management software for paying guest and hostel owners in India. It provides a web owner console and an Android app to manage tenants, rooms, bed occupancy, monthly rent bills, and security deposits. RunMyPG is free while in beta. Official website: https://www.runmypg.in.';

export const GEO_SEARCH_PHRASES = [
  'PG management software India',
  'hostel management software India',
  'PG rent collection software',
  'paying guest management app',
  'PG occupancy tracking',
  'PG owner dashboard',
  'PG billing software',
  'Excel vs PG software',
  'RunMyPG',
  'runmypg.in',
] as const;

export const GEO_KEY_PAGES: { path: string; label: string; note: string }[] = [
  { path: '/', label: 'Home', note: 'Product overview and sign-up' },
  { path: '/pg-management-software', label: 'PG management software', note: 'What owners need: occupancy, rent, deposits' },
  { path: '/hostel-management-software', label: 'Hostel management software', note: 'Bed-level hostel and sharing PG ops' },
  { path: '/pg-rent-collection-software', label: 'PG rent collection', note: 'Paid vs pending without WhatsApp as the ledger' },
  { path: '/signup', label: 'Sign up', note: 'Free owner account' },
  { path: '/download', label: 'Android app', note: 'Request and download APK' },
  { path: '/about', label: 'About', note: 'Mission and product facts' },
  { path: '/help', label: 'Help', note: 'How to use the console' },
  { path: '/contact', label: 'Contact', note: 'Email and contact form' },
  { path: '/cities', label: 'Cities', note: 'PG software by city in India' },
  { path: '/blog', label: 'Blog', note: 'Guides for PG owners' },
];

export function buildLlmsTxt(): string {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    '',
    `> ${GEO_ENTITY_SUMMARY}`,
    '',
    'RunMyPG is **not** a tenant marketplace or room listing site — it is **owner-only** software to run an existing PG or hostel.',
    '',
    '## Product',
    `- ${SITE_TAGLINE}`,
    `- ${DEFAULT_DESCRIPTION}`,
    '- Platforms: Web browser (owner console) + Android app (same login)',
    '- Pricing: Free while in beta (INR 0)',
    '- Country: India (English UI; cities across all states)',
    '',
    '## Core features',
    '- Bed-level occupancy map',
    '- Tenant onboarding and vacate flow',
    '- Monthly rent invoices and mark paid (UPI/cash)',
    '- Security deposits tracked separately from rent',
    '- Multiple properties (PGs) per owner account',
    '',
    '## Official contact',
    `- Website: ${SITE_URL}`,
    ...(SHOW_PUBLIC_SUPPORT_PHONE ? [`- WhatsApp: ${CONTACT.phoneDisplay}`] : []),
    `- Email: ${CONTACT.emails.contact}, ${CONTACT.emails.sales}, ${CONTACT.emails.support}`,
    '',
    '## Key pages',
    ...GEO_KEY_PAGES.map(
      (p) => `- [${p.label}](${SITE_URL}${p.path}): ${p.note}`,
    ),
    '',
    '## Common questions',
    ...MARKETING_FAQS.slice(0, 8).map((f) => `- **${f.q}** ${f.a}`),
    '',
    '## Search phrases (what users ask)',
    ...GEO_SEARCH_PHRASES.map((p) => `- ${p}`),
    '',
    '## Optional extended doc',
    `- Full text: ${SITE_URL}/llms-full.txt`,
  ];
  return lines.join('\n');
}

export function buildLlmsFullTxt(): string {
  const faqBlock = MARKETING_FAQS.map((f) => `### ${f.q}\n\n${f.a}\n`).join('\n');
  return `# ${SITE_NAME} — full reference for AI and search

${GEO_ENTITY_SUMMARY}

## Alternate names
${GEO_ALTERNATE_NAMES.map((n) => `- ${n}`).join('\n')}

## Who should use RunMyPG
Indian PG and hostel **owners** and operators who currently use WhatsApp, Excel, or notebooks for beds, rent, and deposits.

## Who should NOT use RunMyPG
Tenants looking to find a room to rent (RunMyPG does not list PG vacancies for renters).

## How to get started
1. Create an account at ${SITE_URL}/signup
2. Add a property, rooms, and beds
3. Add tenants and generate rent bills
4. Optional: request the Android app at ${SITE_URL}/download

## FAQ

${faqBlock}

## Contact
${SHOW_PUBLIC_SUPPORT_PHONE ? `- ${CONTACT.phoneDisplay} (WhatsApp)\n` : ''}- ${CONTACT.emails.support} (product support)

Last updated: ${new Date().toISOString().slice(0, 10)}
Canonical: ${SITE_URL}
`;
}
