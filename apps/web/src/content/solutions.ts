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
  {
    slug: 'tenant-management-software',
    path: '/tenant-management-software',
    kicker: 'Tenant records for PG owners',
    title: 'Tenant Management Software for PGs in India',
    description:
      'Tenant management software for Indian PG and hostel owners. Keep each tenant tied to a room, bed, monthly rent and security deposit on web and Android.',
    h1: 'Tenant management software built around the bed they occupy',
    lead:
      'A PG tenant record is useful only when it answers the next operational question: which bed is this person in, what is their monthly rent, and what deposit will need attention at checkout? RunMyPG keeps those details together for owners on web and Android.',
    sections: [
      {
        heading: 'One tenant record, connected to daily operations',
        body: 'A contact list alone is not tenant management. In a PG, the resident belongs to a specific property, room and bed. Their rent and security deposit need to stay with that record from move-in to vacate.',
        bullets: [
          'Assign a tenant to an available bed instead of keeping a separate occupancy sheet',
          'Record contact details, monthly rent and security deposit together',
          'See the same tenant and bed information on the owner website and Android app',
          'Vacate the tenant so the bed becomes available without deleting the operational history',
        ],
      },
      {
        heading: 'Designed for owners, not a tenant marketplace',
        body: 'RunMyPG is an owner console for an existing PG or hostel. It does not publish tenant profiles, advertise rooms, perform Aadhaar eKYC, or replace local police-verification requirements. Keep official identity documents according to your own legal and operational process.',
      },
      {
        heading: 'When a spreadsheet starts to fail',
        body: 'A sheet can store names, but it does not prevent the occupancy map and tenant list from drifting apart. RunMyPG connects the person to the bed and the monthly bill, so an update made at the property is visible when you reconcile at the desk.',
      },
    ],
    faqs: [
      {
        q: 'Can I assign each tenant to a room and bed?',
        a: 'Yes. Add the property, rooms and beds first, then place the tenant on an available bed.',
      },
      {
        q: 'Does RunMyPG perform Aadhaar or police verification?',
        a: 'No. RunMyPG is not an eKYC or police-verification service. Follow the current requirements in your city and keep official documents through your own approved process.',
      },
      {
        q: 'Can tenants log in to RunMyPG?',
        a: 'No. RunMyPG is owner software. Tenants do not need an account to appear in your occupancy and rent records.',
      },
    ],
    relatedBlog: ['pg-tenant-verification-india', 'pg-move-out-notice-period-india', 'excel-vs-pg-software'],
    relatedCities: ['hyderabad', 'bangalore', 'noida'],
  },
  {
    slug: 'room-and-bed-management',
    path: '/room-and-bed-management',
    kicker: 'Room, bed & occupancy control',
    title: 'Room and Bed Management Software for PGs & Hostels',
    description:
      'Room and bed management software for Indian PGs and hostels. Track occupied and vacant beds, tenant allocation and multi-property occupancy on web and Android.',
    h1: 'Room and bed management software for shared accommodation',
    lead:
      'PGs and hostels sell bed capacity, not just room numbers. RunMyPG gives owners a bed-level occupancy map so a double- or triple-sharing room shows exactly which spots are occupied and which are ready for the next move-in.',
    sections: [
      {
        heading: 'See vacancy at bed level',
        body: 'A room marked “occupied” can still have an empty bed. Bed-level inventory makes that vacancy visible without walking every floor or asking a caretaker to check.',
        bullets: [
          'Create properties, rooms and individual beds in the same hierarchy as the building',
          'See occupied and vacant beds without maintaining a second sheet',
          'Assign move-ins to an available bed and release it on checkout',
          'Switch between properties while keeping each building’s occupancy separate',
        ],
      },
      {
        heading: 'Occupancy connected to tenants and rent',
        body: 'The useful answer is not only “Bed B is occupied.” It is who occupies it and whether the monthly record is current. RunMyPG connects beds, tenant records, rent bills and deposits rather than treating room inventory as a standalone diagram.',
      },
      {
        heading: 'For monthly PG and hostel operations',
        body: 'This is not a hotel booking engine, OTA channel manager, or nightly-rate calendar. It is for owners who run monthly paying guest homes, sharing hostels and similar accommodation in India.',
      },
    ],
    faqs: [
      {
        q: 'Can RunMyPG track more than one bed in a room?',
        a: 'Yes. Rooms can contain multiple beds, and each bed can be shown as occupied or vacant.',
      },
      {
        q: 'Can I manage more than one PG or hostel?',
        a: 'Yes. Each property keeps its own rooms, beds, tenants and bills, and you switch properties from one owner account.',
      },
      {
        q: 'Is this a hotel room-booking system?',
        a: 'No. RunMyPG is for monthly PG and hostel operations. It does not manage OTA channels or nightly hotel reservations.',
      },
    ],
    relatedBlog: ['track-pg-occupancy', 'manage-multiple-pgs', 'pg-monthly-rent-without-spreadsheet-stress'],
    relatedCities: ['pune', 'bangalore', 'delhi'],
  },
];

export function getSolutionPages(): SolutionPage[] {
  return SOLUTION_PAGES;
}

export function getSolution(slug: string): SolutionPage | undefined {
  return SOLUTION_PAGES.find((p) => p.slug === slug);
}
