export const BLOG_CATEGORIES = ['All', 'Guides', 'Operations', 'Rent & Bills'] as const;

export type BlogCategory = Exclude<(typeof BLOG_CATEGORIES)[number], 'All'>;

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  date: string;
  readMins: number;
  blocks: BlogBlock[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'pg-management-software-india',
    title: 'PG management software in India: what owners actually need',
    description:
      'A practical look at PG management software for Indian owners — occupancy, rent, tenants and deposits — without hotel-style bloat.',
    category: 'Guides',
    date: '2026-09-08',
    readMins: 7,
    blocks: [
      {
        type: 'p',
        text: 'Most paying guest owners in India still run the property from a mix of Excel, WhatsApp groups and a notebook at the gate. It works until you have more than a handful of beds — then empty rooms hide in plain sight, rent chases pile up, and deposits become arguments.',
      },
      {
        type: 'p',
        text: 'PG management software is not hotel PMS. You do not need channel managers or front-desk night audit. You need a clear bed map, monthly bills, tenant records and a phone app when you are on site.',
      },
      {
        type: 'h2',
        text: 'What “good enough” software must cover',
      },
      {
        type: 'ul',
        items: [
          'Bed occupancy by room — vacant, occupied, reserved — in one glance',
          'Rent and other bills for the current month, with paid vs pending',
          'Tenant onboarding: name, contact, rent, security deposit, assigned bed',
          'Deposit tracking so refunds are not guesswork',
          'More than one PG, if you already run two buildings',
          'Web console for desk work and Android for rounds at the property',
        ],
      },
      {
        type: 'h2',
        text: 'Who it is for',
      },
      {
        type: 'p',
        text: 'Owners and managers in Noida, Gurgaon, Bengaluru, Pune and similar cities — student PGs, working-professional hostels, and mixed buildings. If your day is “which bed is empty” and “who has not paid”, you are the user.',
      },
      {
        type: 'h2',
        text: 'How RunMyPG approaches this',
      },
      {
        type: 'p',
        text: 'RunMyPG is built only for this workflow. The web console is the owner dashboard. The Android app uses the same login for work at the property. It is free while we are in beta.',
      },
    ],
  },
  {
    slug: 'track-pg-occupancy',
    title: 'How to track PG occupancy without walking every floor',
    description:
      'Stop guessing empty beds. A simple occupancy map for PG and hostel owners — rooms, beds and status in one view.',
    category: 'Operations',
    date: '2026-09-06',
    readMins: 6,
    blocks: [
      {
        type: 'p',
        text: 'Empty beds leak rent. The usual method is a walkthrough, a caretaker call, or a spreadsheet that nobody updated after the last checkout. By the time you notice a vacancy, you have already lost a week.',
      },
      {
        type: 'h2',
        text: 'Keep one map, not three lists',
      },
      {
        type: 'p',
        text: 'List rooms. Under each room, list beds. Mark each bed occupied or empty. That is the whole model. Colour or labels beat long notes. If a tenant is assigned to bed 2-A, the map should show it without opening a second file.',
      },
      {
        type: 'ul',
        items: [
          'Update the map the same day someone moves in or out',
          'Do not keep a separate “WhatsApp occupancy” chat as the source of truth',
          'If you have two properties, switch buildings — do not mix beds in one sheet',
        ],
      },
      {
        type: 'h2',
        text: 'On-site vs at the desk',
      },
      {
        type: 'p',
        text: 'You check occupancy at the PG on your phone. You plan filling vacancies at home on a laptop. Both views must be the same data. RunMyPG shows rooms and beds on web and Android so you are not reconciling two versions at night.',
      },
    ],
  },
  {
    slug: 'pg-rent-collection',
    title: 'PG rent collection: stop chasing tenants only on WhatsApp',
    description:
      'How PG owners in India can track monthly rent and pending bills without a messy WhatsApp trail.',
    category: 'Rent & Bills',
    date: '2026-09-04',
    readMins: 6,
    blocks: [
      {
        type: 'p',
        text: 'WhatsApp is fine for a reminder. It is a weak ledger. Screenshots, “I’ll pay Monday”, and UPI forwards do not tell you, at month end, who is clear and who is not.',
      },
      {
        type: 'h2',
        text: 'One bill per tenant per month',
      },
      {
        type: 'p',
        text: 'Generate (or record) a bill for the month. Mark it paid when money actually lands. Pending stays pending until then. Optional extras — electricity, Wi-Fi — belong on the same bill or as a clear add-on, not a side chat.',
      },
      {
        type: 'ul',
        items: [
          'Start every month with a pending list, not a memory check',
          'Do not delete old months — you will need them for disputes',
          'Caretaker updates should hit the same system you use at the desk',
        ],
      },
      {
        type: 'h2',
        text: 'What RunMyPG tracks',
      },
      {
        type: 'p',
        text: 'The bills screen is the month’s collection picture: paid and pending, tied to the tenant and bed. Mark paid on the phone when you are at the PG; the web dashboard updates. No second spreadsheet.',
      },
    ],
  },
  {
    slug: 'pg-security-deposit',
    title: 'How PG owners should track security deposits',
    description:
      'Record deposits, deductions and refunds for paying guest tenants so checkout is not an argument.',
    category: 'Rent & Bills',
    date: '2026-09-02',
    readMins: 5,
    blocks: [
      {
        type: 'p',
        text: 'Security deposit fights are rarely about the law first. They are about missing numbers: how much was taken, what was deducted, what is left to refund. If that lives in a chat from 11 months ago, you will lose time — and sometimes a tenant review.',
      },
      {
        type: 'h2',
        text: 'Capture it at onboarding',
      },
      {
        type: 'ul',
        items: [
          'Deposit amount next to rent, on the tenant record',
          'Date received',
          'At checkout: deductions with a one-line reason, then refund amount',
        ],
      },
      {
        type: 'h2',
        text: 'Keep it with the bed, not in a side notebook',
      },
      {
        type: 'p',
        text: 'When the bed is vacated, the deposit story should still be on that tenant. RunMyPG stores deposit with the tenant so you are not hunting Excel tabs named “old PG_final_v3”.',
      },
    ],
  },
  {
    slug: 'excel-vs-pg-software',
    title: 'Excel vs PG software: when spreadsheets start costing you rent',
    description:
      'Spreadsheets work for a 6-bed PG. Here is when Indian owners outgrow Excel and WhatsApp for occupancy and rent.',
    category: 'Guides',
    date: '2026-08-28',
    readMins: 6,
    blocks: [
      {
        type: 'p',
        text: 'Excel is honest: it does exactly what you type. That is also the problem. Nobody types a checkout at 11pm. The sheet and the building drift apart. WhatsApp fills the gap, and now you have two sources of truth.',
      },
      {
        type: 'h2',
        text: 'Signs you have outgrown the sheet',
      },
      {
        type: 'ul',
        items: [
          'You cannot answer “how many empty beds tonight” without a call',
          'Two people edit copies of the same file',
          'Rent pending is a feeling, not a list',
          'You added a second PG and the columns exploded',
        ],
      },
      {
        type: 'h2',
        text: 'What to move first',
      },
      {
        type: 'p',
        text: 'Move occupancy and rent first. Deposits and extra bills next. You do not need a 40-feature hostel suite. RunMyPG is intentionally small: beds, tenants, bills, deposits — web plus Android.',
      },
    ],
  },
  {
    slug: 'manage-multiple-pgs',
    title: 'Manage multiple PGs from one dashboard',
    description:
      'Property switcher, separate occupancy and billing per building — how multi-PG owners stay sane.',
    category: 'Operations',
    date: '2026-08-22',
    readMins: 5,
    blocks: [
      {
        type: 'p',
        text: 'The second PG is where informal systems break. Beds from Noida and Gurgaon in one sheet look fine until you mark the wrong room occupied.',
      },
      {
        type: 'h2',
        text: 'One account, separate properties',
      },
      {
        type: 'p',
        text: 'Each building should have its own rooms, beds, tenants and bills. You switch property in the console instead of opening another workbook. Reports stay per PG so collections are not mixed.',
      },
      {
        type: 'ul',
        items: [
          'Name properties clearly (area + building, not “PG 2”)',
          'Do not share a single occupancy map across cities',
          'Use the same login on phone so on-site staff see the active property',
        ],
      },
      {
        type: 'h2',
        text: 'RunMyPG switcher',
      },
      {
        type: 'p',
        text: 'Add as many properties as you run. The dashboard, beds and bills follow the property you selected. Free during beta — built for owners who already outgrew one address.',
      },
    ],
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getLatestPosts(count = 3): BlogPost[] {
  return getBlogPosts().slice(0, count);
}
