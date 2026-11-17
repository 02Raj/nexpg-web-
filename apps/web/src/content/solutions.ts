export type SolutionFaq = { q: string; a: string };

export type SolutionPage = {
  slug: string;
  path: string;
  kicker: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: { heading: string; body: string; bullets?: string[] }[];
  faqs: SolutionFaq[];
  relatedBlog: string[];
  relatedCities: string[];
};

export const SOLUTION_PAGES: SolutionPage[] = [
  {
    slug: 'pg-management-software',
    path: '/pg-management-software',
    kicker: 'For PG owners in India',
    title: 'PG Management Software in India — Occupancy, Rent & Deposits',
    description:
      'PG management software for Indian paying guest owners. Track beds, tenants, monthly rent and security deposits on web and Android. Free while in beta.',
    h1: 'PG management software for Indian owners',
    lead:
      'RunMyPG is owner software for paying guest homes — not a tenant marketplace, not hotel PMS. You get a bed map, tenant records, monthly rent bills and deposits on one login: website at the desk, Android at the gate.',
    sections: [
      {
        heading: 'What PG management software should do',
        body: 'If you still answer “how many empty beds?” with a walk or a WhatsApp ping, the software is not doing its job. Indian PG ops are bed-level, monthly, and often multi-building. You need that on a phone as well as a laptop.',
        bullets: [
          'Occupancy by room and bed — vacant or occupied, not a flat “unit”',
          'Tenant onboarding tied to a bed, with rent and deposit on the same record',
          'Monthly bills with paid vs pending, including UPI or cash you mark yourself',
          'Deposits stored so checkout is not a hunt through last year’s chat',
          'More than one PG under one account, without mixing two maps',
        ],
      },
      {
        heading: 'Who it is for (and who it is not)',
        body: 'Owners and operators of PGs and hostel-style buildings in India — student, working professional, or mixed. If your day is occupancy and rent, this is the product. It is not for tenants looking for a room, not a payment gateway, and not a hotel channel manager.',
      },
      {
        heading: 'How RunMyPG is different from Excel and WhatsApp',
        body: 'Excel only updates when someone types. WhatsApp is a reminder, not a ledger. RunMyPG keeps the same beds and bills on web and Android so the corridor and the desk cannot drift. Pricing is ₹0 while we are in beta — no credit card, no fake ₹1 trial.',
      },
    ],
    faqs: [
      {
        q: 'Is RunMyPG PG management software or a listing site?',
        a: 'It is owner software. You manage an existing PG. Tenants cannot browse vacancies on RunMyPG.',
      },
      {
        q: 'Does it work across India?',
        a: 'Yes. Add any Indian city when you create a property. City guides on the site are for local search; the console is not limited to that list.',
      },
      {
        q: 'Is there an Android app?',
        a: 'Yes. Same email as the website. Use the web console, the app, or both.',
      },
    ],
    relatedBlog: ['pg-management-software-india', 'excel-vs-pg-software', 'pg-owner-android-app'],
    relatedCities: ['noida', 'bangalore', 'pune'],
  },
  {
    slug: 'hostel-management-software',
    path: '/hostel-management-software',
    kicker: 'Hostels & sharing PGs',
    title: 'Hostel Management Software India — Bed Occupancy & Rent',
    description:
      'Hostel management software for Indian operators who rent by the bed. Occupancy map, tenants, monthly rent and deposits — web console plus Android, free in beta.',
    h1: 'Hostel management software for bed-level inventory',
    lead:
      'Most Indian hostels and sharing PGs do not rent “rooms” the way a hotel does. They rent beds. RunMyPG is built for that: rooms with named beds, occupancy you can check on site, and monthly rent that is not buried in WhatsApp.',
    sections: [
      {
        heading: 'Hotel PMS vs hostel ops',
        body: 'You do not need a front desk night audit or OTA channel manager. You need to know which bed is empty, who lives there, what they owe this month, and what deposit you hold. That is the product.',
        bullets: [
          'Bed map per room (sharing inventory)',
          'Move-in and vacate against a specific bed',
          'Monthly rent picture: paid and pending',
          'Security deposit on the tenant, not a side notebook',
        ],
      },
      {
        heading: 'On site and at the desk',
        body: 'Rounds happen in the corridor. Billing happens at night on a laptop. RunMyPG uses one account for both. The Android app is optional — the website is the full console.',
      },
    ],
    faqs: [
      {
        q: 'Is this hostel software or PG software?',
        a: 'Both, when you rent by the bed. Paying guest homes and hostels in India usually share that model. RunMyPG is not hotel PMS.',
      },
      {
        q: 'Can I run two hostels on one login?',
        a: 'Yes. Each property has its own rooms, beds, tenants and bills. Switch buildings in the dashboard.',
      },
    ],
    relatedBlog: ['track-pg-occupancy', 'manage-multiple-pgs', 'pg-rent-collection'],
    relatedCities: ['bangalore', 'pune', 'hyderabad'],
  },
  {
    slug: 'pg-rent-collection-software',
    path: '/pg-rent-collection-software',
    kicker: 'Rent & bills',
    title: 'PG Rent Collection Software — Paid vs Pending without WhatsApp Chaos',
    description:
      'PG rent collection software for Indian owners. Monthly bills, paid vs pending, mark rent received (UPI or cash) on web or Android. Free while in beta.',
    h1: 'PG rent collection software that is actually a ledger',
    lead:
      'WhatsApp is fine for “rent due”. It is a weak record of who paid. RunMyPG keeps one bill picture per month: pending until you mark it paid, tied to the tenant and bed — on the phone when you collect, on the website when you reconcile.',
    sections: [
      {
        heading: 'What we track (and what we do not)',
        body: 'You generate or record monthly rent for the property’s billing day. You mark bills paid when money actually lands — UPI or cash. RunMyPG is not a payment gateway and not a tenant app that auto-debits. You stay in control of collection; the software stops the chat archaeology.',
        bullets: [
          'Paid vs pending for the current month',
          'History you do not delete when the chat scrolls away',
          'Same list on Android and web',
          'Deposits kept separate from rent so checkout stays clear',
        ],
      },
      {
        heading: 'When this beats a spreadsheet',
        body: 'The sheet is accurate only if everyone updates it the same night. On a 20–80 bed PG, they do not. A caretaker mark on the phone that hits the same dashboard you open at home is the difference.',
      },
    ],
    faqs: [
      {
        q: 'Does RunMyPG collect rent from tenants automatically?',
        a: 'No. Tenants pay you (UPI, cash, or however you already collect). You mark the bill paid in RunMyPG so the pending list is true.',
      },
      {
        q: 'Can I see pending rent for one PG if I run two buildings?',
        a: 'Yes. Bills follow the property you selected. Do not mix two PGs in one occupancy map.',
      },
    ],
    relatedBlog: ['pg-rent-collection', 'pg-security-deposit', 'excel-vs-pg-software'],
    relatedCities: ['delhi', 'gurgaon', 'noida'],
  },
];

export function getSolutionPages(): SolutionPage[] {
  return SOLUTION_PAGES;
}

export function getSolution(slug: string): SolutionPage | undefined {
  return SOLUTION_PAGES.find((p) => p.slug === slug);
}
