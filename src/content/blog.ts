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
    slug: 'pg-owner-android-app',
    title: 'PG owner app on Android: occupancy and rent when you are at the gate',
    description:
      'Why PG owners need the same occupancy and rent data on the phone as on the laptop — and how RunMyPG’s Android app uses the same login as the website.',
    category: 'Operations',
    date: '2026-09-30',
    readMins: 6,
    blocks: [
      {
        type: 'p',
        text: 'The empty bed is discovered in the corridor, not in a spreadsheet at 11pm. If occupancy lives only on a laptop at home, the caretaker invents a second system — usually WhatsApp. A PG owner app is useful only when it is the same account as the desk, not a separate toy.',
      },
      {
        type: 'h2',
        text: 'What to do on the phone (and what to leave for the desk)',
      },
      {
        type: 'ul',
        items: [
          'On site: check which beds are empty, open a tenant, mark rent paid when cash or UPI lands',
          'On site: start add-tenant from an empty bed so the map cannot lie',
          'At the desk: set up the building, rooms, billing day, and review the month’s pending list',
        ],
      },
      {
        type: 'h2',
        text: 'Same login, optional app',
      },
      {
        type: 'p',
        text: 'RunMyPG’s website is the full owner console. The Android app is for rounds. You request the APK from the download page when you are signed in, then install and use the same email. You do not need the app to run the PG — you need it when you are standing at the lock.',
      },
      {
        type: 'h2',
        text: 'It is not a tenant marketplace app',
      },
      {
        type: 'p',
        text: 'Tenants do not browse beds on RunMyPG. This is owner software. If someone searches “PG owner app India” meaning “find me a room”, they are in the wrong product — and you should not pretend otherwise in listings or ads.',
      },
    ],
  },
  {
    slug: 'how-to-fill-pg-vacant-rooms',
    title: 'How to fill your PG: why beds stay empty and what owners can fix',
    description:
      'A practical guide for Indian PG owners — find why rooms stay vacant, fix listing and trust gaps, and grow occupancy without guessing every night.',
    category: 'Guides',
    date: '2026-09-13',
    readMins: 9,
    blocks: [
      {
        type: 'p',
        text: 'An empty bed is not “bad luck”. It is rent you already lost today. Most owners feel the pain — WhatsApp full of enquiries but no move-ins, or one floor always half empty — and the fix is rarely “build more rooms”. It is seeing why tenants say no, how fast you refill after checkout, and whether your price and promise match what is actually on site.',
      },
      {
        type: 'h2',
        text: 'Why PG owners struggle (and it is not only “market slow”)',
      },
      {
        type: 'ul',
        items: [
          'You do not know exact vacancy — you find out when someone asks “any bed?” and you walk the floor',
          'Checkout to new tenant takes too long: paint, cleaning, broker delay, or deposit arguments',
          'Rent is right for you but high for the room quality or location tenants compare you to',
          'Photos and listing say “premium”; visit shows shared bathroom issues, Wi‑Fi down, or strict rules surprise',
          'Enquiries come from wrong segment — family callers for a boys PG, or interns for a corporate hostel',
          'One bad review or neighbour complaint scares off repeat referrals',
          'Seasonality: colleges, IT parks, and exam months empty beds in waves — you treat every month the same',
        ],
      },
      {
        type: 'h2',
        text: 'Step 1: Count vacancy honestly, every week',
      },
      {
        type: 'p',
        text: 'Before marketing, write down: total beds, occupied, empty, and “reserved but not moved in”. If that number lives in three places — caretaker’s head, a sheet, and a group chat — you will overestimate how full you are. Weekly, ask: which rooms have been empty more than 14 days? Those need a plan, not another generic post.',
      },
      {
        type: 'ul',
        items: [
          'Mark checkout date the day the tenant leaves — not when you remember to update',
          'Note why the last tenant left (job change, price, food, commute) — patterns show up after five exits',
          'Split vacancy by room type: single vs sharing often empty for different reasons',
        ],
      },
      {
        type: 'h2',
        text: 'Step 2: Fix the reasons tenants walk away',
      },
      {
        type: 'p',
        text: 'Walk your building like a new tenant. Same route they take from the gate to the room. Smell, lighting, lock, water pressure, and how the caretaker speaks matter as much as rent.',
      },
      {
        type: 'ul',
        items: [
          'Price: compare two nearby PGs with similar food and AC — adjust sharing rent before single',
          'Trust: show deposit rules and notice period upfront; hidden charges kill word-of-mouth',
          'Food: if you promise meals, keep timing stable; if you do not, say so clearly in the listing',
          'Photos: real room photos beat stock images; update after you repaint or add furniture',
          'Rules: visitors, timing, smoking — state them before visit so serious tenants self-filter',
          'Maintenance: fix leaking taps and broken locks before listing “immediate move-in”',
        ],
      },
      {
        type: 'h2',
        text: 'Step 3: Fill faster — reduce days between tenants',
      },
      {
        type: 'p',
        text: 'Every empty day is the same cost whether you advertise or not. Owners who stay fuller treat checkout like a small project: clean, minor repair, re-list within 48 hours, broker or referral message the same week.',
      },
      {
        type: 'ul',
        items: [
          'Keep a short “ready to show” checklist: cleaned, mattress cover, working fan/AC, Wi‑Fi password ready',
          'Tell past tenants you have a bed — many workplaces have newcomers; offer a small referral thank-you if policy allows',
          'Use brokers where they work for your segment, but track which broker actually sends move-ins, not only calls',
          'List on maps and local search with correct pin, phone, and “single / double / triple” clarity',
          'Reply to enquiries in hours, not days; first serious visit often goes to whoever confirms slot first',
        ],
      },
      {
        type: 'h2',
        text: 'Step 4: Grow occupancy without opening a second building too early',
      },
      {
        type: 'p',
        text: 'Growth for most owners means higher fill rate on existing beds first, then add rooms or a second property when the first runs above ~85% for months — not when one floor is empty and you already struggle to follow up leads.',
      },
      {
        type: 'ul',
        items: [
          'Corporate tie-ups: one HR contact at a nearby company beats ten random online leads',
          'Student cycles: start outreach 3–4 weeks before college intake in your city',
          'Retention: a tenant who stays 11 months beats chasing twelve new ones — listen at renewal time',
          'Mix of tenure: some monthly, some longer lock-in — but do not block quick move-in for rigid rules',
          'Second PG only when one dashboard of beds, rent and deposits is under control — not duplicated chaos',
        ],
      },
      {
        type: 'h2',
        text: 'Where software helps (and where it does not)',
      },
      {
        type: 'p',
        text: 'No app replaces good food, fair rent, or a honest caretaker. Software helps you stop flying blind: see which beds are empty, who has not paid, and how long a room has been vacant so you act this week — not at month end. RunMyPG keeps occupancy, tenants, bills and deposits in one place on web and Android, free while we are in beta — so your energy goes to filling beds, not reconciling Excel and WhatsApp at night.',
      },
    ],
  },
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
      {
        type: 'h2',
        text: 'A weekly occupancy habit that actually sticks',
      },
      {
        type: 'ul',
        items: [
          'Every Sunday: count empty beds and beds empty more than 14 days',
          'Same day as checkout: mark the bed vacant — not “when I remember”',
          'If you run two PGs, switch property before you update — never one mixed sheet',
        ],
      },
      {
        type: 'p',
        text: 'Software does not fill a bed. It stops you discovering vacancy a week late. Pair the map with honest listings and fast turnaround — that is operations, not a dashboard screenshot.',
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

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = getBlogPost(slug);
  const others = getBlogPosts().filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, count);
  const same = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...same, ...rest].slice(0, count);
}
