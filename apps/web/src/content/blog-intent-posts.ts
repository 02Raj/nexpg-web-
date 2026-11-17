import type { BlogPost } from './blog';

/**
 * Search-intent guides (notices, deposits, rent chase, verification, software choice).
 * Written for how owners actually work — not competitor feature lists.
 */
export const INTENT_POSTS: BlogPost[] = [
  {
    slug: 'pg-tenant-notices-whatsapp-email',
    title: 'How PG owners send notices to every tenant (without a group nobody reads)',
    description:
      'Water cut, Wi-Fi down, visiting hours, rent due — a practical way Indian PG owners announce to every occupant using a tenant list, then WhatsApp or email. No fake “broadcast from the app”.',
    category: 'Guides',
    date: '2026-09-30',
    readMins: 8,
    blocks: [
      {
        type: 'p',
        text: 'The PG WhatsApp group is where notices go to die. Tenants mute it. A caretaker forwards one message to three people and forgets the fourth floor. The owner thinks “everyone knows”. They do not.',
      },
      {
        type: 'h2',
        text: 'Start with who actually lives there',
      },
      {
        type: 'p',
        text: 'A notice is only as good as the list. If occupancy lives in a chat, you will message a vacated bed and miss a new move-in. Keep one tenant record per occupied bed: name, phone, and which room. That list is what you copy into WhatsApp (broadcast list or labelled chats) or a simple email BCC — outside the software.',
      },
      {
        type: 'ul',
        items: [
          'Update the list the same day as move-in or checkout',
          'Do not use one group as both “friends of the PG” and official notices',
          'Write the notice once: what, when, what tenants should do, who to call',
        ],
      },
      {
        type: 'h2',
        text: 'WhatsApp vs email in Indian PGs',
      },
      {
        type: 'p',
        text: 'WhatsApp is how tenants actually read. Email is useful when you need a dated copy (rules change, deposit policy). Many owners send both for serious notices and only WhatsApp for “water from 2–4pm”. Delivery “proof” in consumer WhatsApp is a blue tick, not a legal stamp. If a dispute matters, keep the text in your own notes too.',
      },
      {
        type: 'h2',
        text: 'What RunMyPG does (and does not)',
      },
      {
        type: 'p',
        text: 'RunMyPG stores the occupant against the bed so you know who should receive a notice. It does not send WhatsApp or email blasts, and it is not a tenant inbox. You still message people the way you already do — with a list that matches the building.',
      },
    ],
  },
  {
    slug: 'empty-pg-beds-nightly-stays',
    title: 'Empty PG beds: fill the month first, before you think like a hotel',
    description:
      'Nightly OTA-style stays look like free money on an empty bed. For most Indian PGs they create ID checks, linen, and neighbour complaints. How to decide — without hotel software you do not run.',
    category: 'Operations',
    date: '2026-09-30',
    readMins: 8,
    blocks: [
      {
        type: 'p',
        text: 'An empty bed is rent you already lost. Turning it into a nightly listing is a different business: guest IDs, towels, lock-outs at 11pm, and a neighbour who did not sign up for Airbnb traffic. Some hostels do it well. Many PGs try it once and spend the next month explaining to long-stay tenants.',
      },
      {
        type: 'h2',
        text: 'When nightly stays fight your PG model',
      },
      {
        type: 'ul',
        items: [
          'Sharing rooms: a one-night guest in a three-bed room is a trust problem, not a revenue line',
          'Food and Wi-Fi priced for monthly tenants, not hotel guests',
          'Society or local rules that treat paying guest homes differently from lodges',
          'You still do not know which beds are empty this week — then nightly is chaos on top of chaos',
        ],
      },
      {
        type: 'h2',
        text: 'What to do this month instead',
      },
      {
        type: 'p',
        text: 'Count vacant beds honestly. Cut days between checkout and the next monthly tenant: clean, minor repair, list, reply fast. Corporate or college intake beats a random weekday booking if your building is a PG, not a lodge. If you later run a true short-stay floor, treat it as a separate property with its own rules — do not mix nightly guests into a monthly occupancy map.',
      },
      {
        type: 'h2',
        text: 'RunMyPG’s lane',
      },
      {
        type: 'p',
        text: 'RunMyPG is monthly PG and hostel occupancy: beds, tenants, rent bills, deposits. It is not OTA channel management, nightly rates, or hotel PMS. Fill the map you have before you invent a second product.',
      },
    ],
  },
  {
    slug: 'pg-move-out-notice-period-india',
    title: 'PG move-out in India: notice period, checkout, and the deposit argument',
    description:
      'A checkout checklist for Indian PG owners — notice days, deductions, refund timing — and how to keep the numbers on the tenant record so the fight is smaller.',
    category: 'Rent & Bills',
    date: '2026-09-29',
    readMins: 9,
    blocks: [
      {
        type: 'p',
        text: 'Move-out fights are rarely about “the law” on day one. They are about missing numbers: when notice was given, what was deducted, what is left to refund. If that lives in a chat from March, you will lose a Saturday — and sometimes a review.',
      },
      {
        type: 'h2',
        text: 'Agree the rules at move-in, not at the gate',
      },
      {
        type: 'ul',
        items: [
          'Notice period in writing (even a one-page house rule): 15 or 30 days is common; say it before the first rent',
          'What deposit covers (damage, excess stay, unpaid bills) and what it does not (last month’s rent unless you explicitly allow that)',
          'Who inspects the bed and when — same day as keys, not “next week”',
        ],
      },
      {
        type: 'h2',
        text: 'Checkout day, in order',
      },
      {
        type: 'p',
        text: 'Walk the room with the tenant if you can. Note damage in one line. Decide deductions. Mark the bed vacant the same day so the next occupant is not blocked by a ghost. Refund when you actually pay — not when you “plan to”. This is operations, not a courtroom. For legal disputes, talk to a lawyer; software is not legal advice.',
      },
      {
        type: 'h2',
        text: 'Where RunMyPG fits',
      },
      {
        type: 'p',
        text: 'Deposit sits on the tenant, not mixed into monthly rent. After vacate, Settings lists deposits still due for refund; you mark refunded when money has gone back. RunMyPG does not calculate notice-period penalties or send legal notices. It keeps the amount you recorded so checkout is not a treasure hunt.',
      },
    ],
  },
  {
    slug: 'pg-rent-reminders-india',
    title: 'PG rent reminders in India: chase from a pending list, not from memory',
    description:
      'How owners remind tenants about rent on WhatsApp or in person — after the month’s paid-vs-pending list is true. No pretend auto-drip from RunMyPG.',
    category: 'Rent & Bills',
    date: '2026-09-29',
    readMins: 8,
    blocks: [
      {
        type: 'p',
        text: '“I’ll pay Monday” in a chat is not a ledger. Automated reminder products sound perfect until the list is wrong: you nag someone who paid cash yesterday, and you skip the person who quietly vacated. The reminder is the last step. The first step is knowing who is pending.',
      },
      {
        type: 'h2',
        text: 'A reminder habit that does not burn goodwill',
      },
      {
        type: 'ul',
        items: [
          'On billing day: generate the month, then walk pending — not “who do I remember”',
          'First ping polite and specific: month, amount, UPI/cash how you actually collect',
          'Do not shame people in the building group; one-to-one works better in most PGs',
          'After they pay, mark paid the same day so the next reminder cannot lie',
        ],
      },
      {
        type: 'h2',
        text: 'UPI and “online collection” without a payment gateway',
      },
      {
        type: 'p',
        text: 'Most Indian PG rent already moves on UPI. You do not need the software to be a bank. Tenants pay your QR or account; you tick the bill paid. Payment links and auto-debit are a different product. If a vendor promises “effortless online collection”, ask whether they take money through their gateway or only send a message.',
      },
      {
        type: 'h2',
        text: 'RunMyPG',
      },
      {
        type: 'p',
        text: 'Bills show paid vs pending for the month. You mark paid on web or Android when money has landed. RunMyPG does not send WhatsApp or email rent reminders and is not a payment gateway. The pending list is what you chase from.',
      },
    ],
  },
  {
    slug: 'pg-tenant-complaints-without-tickets',
    title: 'PG tenant complaints: close the loop without a “ticket system”',
    description:
      'Wi-Fi, water, a broken lock — how Indian PG owners log and finish complaints when the product is a bed map, not a helpdesk. A notebook that matches the tenant beats a muted group.',
    category: 'Operations',
    date: '2026-09-28',
    readMins: 7,
    blocks: [
      {
        type: 'p',
        text: 'Complaints in a WhatsApp group become noise. The tenant thinks it is logged. The plumber never heard. A week later you are arguing about “I told you”. Software with a tenant-facing ticket inbox is one answer. Another is a short owner habit that smaller PGs actually keep.',
      },
      {
        type: 'h2',
        text: 'A complaint log that fits a 20–80 bed PG',
      },
      {
        type: 'ul',
        items: [
          'One line: date, bed/room, what broke, who is fixing it, done or not',
          'Same-day: tell the tenant the next step, even if the part arrives tomorrow',
          'At month end: unpaid rent and open complaints are different lists — do not mix them as “attitude”',
        ],
      },
      {
        type: 'h2',
        text: 'When a ticket product is worth it',
      },
      {
        type: 'p',
        text: 'If you have a manager, two buildings, and tenants who expect an app, a ticket queue can help. If you are the owner on a scooter after office, a queue you never open is worse than a diary. Do not buy “professional support” you will not staff.',
      },
      {
        type: 'h2',
        text: 'RunMyPG',
      },
      {
        type: 'p',
        text: 'RunMyPG does not include a tenant ticket portal. You still see who lives on which bed when a complaint comes in. Close the issue in your own log; keep occupancy and rent in the console.',
      },
    ],
  },
  {
    slug: 'pg-tenant-portal-do-you-need-one',
    title: 'Tenant portal for a PG: when it helps, and when it is extra noise',
    description:
      '24/7 self-service sounds modern. For many Indian PGs it means another login tenants ignore. What owners actually get asked for — and why RunMyPG stays owner-only.',
    category: 'Guides',
    date: '2026-09-28',
    readMins: 7,
    blocks: [
      {
        type: 'p',
        text: 'Tenants call for “send the QR” and “what do I owe”. A portal can show invoices and let them raise tickets. It can also sit unused while they still ping you on WhatsApp — because that is where they already live.',
      },
      {
        type: 'h2',
        text: 'Questions a portal tries to answer',
      },
      {
        type: 'ul',
        items: [
          'How much this month? — you can answer from a pending list in five seconds if your ledger is true',
          'I paid, why pending? — usually because cash was not marked; portal does not fix a stale owner record',
          'Raise a complaint — useful at scale; a 15-bed PG often needs a plumber, not a ticket ID',
        ],
      },
      {
        type: 'h2',
        text: 'RunMyPG is owner software',
      },
      {
        type: 'p',
        text: 'Tenants cannot log in to RunMyPG. There is no tenant marketplace and no self-service pay button inside the product. You collect the way you already collect; you keep beds, bills and deposits on the owner console and Android app. If you later need a tenant app, that is a different product — do not pretend the occupancy map is one.',
      },
    ],
  },
  {
    slug: 'excel-to-pg-software-without-bulk-import',
    title: 'Moving a PG from Excel to software without a risky bulk import',
    description:
      'Bulk Excel import sounds fast. One wrong column and two tenants sit on the same bed. A safer order for Indian owners: property, rooms, beds, then people — the way RunMyPG is set up today.',
    category: 'Guides',
    date: '2026-09-27',
    readMins: 8,
    blocks: [
      {
        type: 'p',
        text: 'A 40-row sheet looks innocent until “Room 2” means two different rooms in two files. Bulk import tools need clean templates. Most owner sheets are not clean. Speed that creates a wrong occupancy map costs more than a quiet evening of adding rooms in order.',
      },
      {
        type: 'h2',
        text: 'A sequence that matches the building',
      },
      {
        type: 'ul',
        items: [
          'Property first (city, billing day) — one building, one map',
          'Rooms, then bed count per room (sharing is beds, not “flat 4BHK”)',
          'Then tenants onto empty beds: name, contact, rent, deposit',
          'Then the current month’s paid/pending — do not invent history you cannot prove',
        ],
      },
      {
        type: 'h2',
        text: 'If you still love the sheet',
      },
      {
        type: 'p',
        text: 'Use Excel as a checklist while you type into the console, not as a second source of truth after go-live. Print the occupancy once, tick each bed, then stop updating the file. Two systems is how you get “software is wrong” when the caretaker never opened it.',
      },
      {
        type: 'h2',
        text: 'RunMyPG today',
      },
      {
        type: 'p',
        text: 'Setup is property → rooms and beds (up to eight beds per room in setup) → add tenants from empty beds. There is no Excel bulk import in the product. That is slower on day one and harder to silently corrupt. Extra rooms can be added later from Settings.',
      },
    ],
  },
  {
    slug: 'choose-pg-management-software-india-2026',
    title: 'How to choose PG management software in India (2026 checklist)',
    description:
      'What to look for in PG software: bed-level occupancy, monthly rent, deposits, phone plus desk — and what “best” lists usually hide (hotel PMS, tenant apps, gateways you may not need).',
    category: 'Guides',
    date: '2026-09-27',
    readMins: 9,
    blocks: [
      {
        type: 'p',
        text: '“Best PG management software in India 2026” articles are often product pages with a ranking hat. A useful test is simpler: can you answer empty beds and pending rent tonight, on the property and at home, without a second spreadsheet?',
      },
      {
        type: 'h2',
        text: 'Must-haves for a typical Indian PG',
      },
      {
        type: 'ul',
        items: [
          'Bed map, not only “rooms” — sharing inventory is the default',
          'Tenant tied to a bed, with rent and deposit on the same record',
          'Monthly paid vs pending you mark when money actually arrives',
          'Same login on a phone if you walk the building',
          'More than one property without mixing two maps',
        ],
      },
      {
        type: 'h2',
        text: 'Nice-to-have vs different product',
      },
      {
        type: 'p',
        text: 'Payment gateway, tenant portal, ticket inbox, OTA/nightly, Aadhaar KYC, bulk import, staff roles — some owners will want these later. They are not the same as occupancy and rent. If a demo leads with hotel features, ask how a 24-bed sharing PG actually uses it on a Sunday.',
      },
      {
        type: 'h2',
        text: 'RunMyPG on that checklist',
      },
      {
        type: 'p',
        text: 'RunMyPG is built for the must-haves above. It is free while in beta. It is not a payment gateway, tenant portal, or hotel channel manager. Compare it to Excel and WhatsApp first; compare it to a 40-feature suite only if you will use those 40 features.',
      },
    ],
  },
  {
    slug: 'pg-tenant-verification-india',
    title: 'PG tenant verification in India: a practical owner checklist',
    description:
      'Aadhaar, police verification, agreements — what owners typically do in India, what is local practice vs software, and how a tenant record in RunMyPG helps without pretending to be KYC.',
    category: 'Guides',
    date: '2026-09-26',
    readMins: 9,
    blocks: [
      {
        type: 'p',
        text: 'Verification is not one national app button. Cities and local police desks differ. Some owners keep a photocopy and a signed house rule. Some insist on police verification for every stay. Software cannot replace a station visit. It can stop you losing the tenant’s phone number when the photocopy fades.',
      },
      {
        type: 'h2',
        text: 'A checklist owners actually use',
      },
      {
        type: 'ul',
        items: [
          'Government ID as required in your area (often Aadhaar or passport for foreigners) — you store copies as you already do, not inside a mystery vault in the cloud unless you chose that',
          'Local police / tenant verification if your station or society asks — follow current local process, not a blog from another state',
          'Written rent, deposit, notice, food and visitor rules before keys',
          'Emergency contact if the occupant is a student',
        ],
      },
      {
        type: 'h2',
        text: 'Disputes vs onboarding',
      },
      {
        type: 'p',
        text: 'Verification reduces some risk. It does not collect rent. Mix-ups happen when onboarding is slow and the bed is already occupied in the real world but empty on paper. Record the person on the bed the day they move in.',
      },
      {
        type: 'h2',
        text: 'RunMyPG',
      },
      {
        type: 'p',
        text: 'You add name and contact on the tenant record with rent and deposit. RunMyPG is not a police-verification product, not an Aadhaar eKYC app, and not legal advice. Keep official copies in your own files; keep occupancy true in the console.',
      },
    ],
  },
  {
    slug: 'pg-monthly-rent-without-spreadsheet-stress',
    title: 'Managing PG tenants and rent through the month (without spreadsheet stress)',
    description:
      'A month-in-the-life for Indian PG owners: billing day, pending list, move-ins, deposits — how the rhythm works when occupancy and bills share one dashboard.',
    category: 'Rent & Bills',
    date: '2026-09-26',
    readMins: 8,
    blocks: [
      {
        type: 'p',
        text: 'Monthly chaos is usually three jobs colliding: someone new moves in, someone leaves, and rent is due. Excel can hold all three until two people edit copies. The fix is not “work harder on the 1st”. It is one map and one pending list that survive the week.',
      },
      {
        type: 'h2',
        text: 'A simple monthly rhythm',
      },
      {
        type: 'ul',
        items: [
          'Billing day (you choose 1–28): month’s bills exist; start from pending, not from memory',
          'Any day: move-in on an empty bed; checkout marks vacant and starts the deposit/refund story',
          'When UPI or cash lands: mark that bill paid — on the phone if you are at the gate',
          'Week’s end: empty beds older than two weeks get a filling plan, not another mute in the group',
        ],
      },
      {
        type: 'h2',
        text: 'Automation vs a true list',
      },
      {
        type: 'p',
        text: 'Auto-reminders and payment links help only if the occupant list is right. Wrong list plus automation is a harassment machine. Get occupancy and paid/pending honest first. Then you can still send a WhatsApp yourself to the people who are actually pending.',
      },
      {
        type: 'h2',
        text: 'RunMyPG',
      },
      {
        type: 'p',
        text: 'Add tenants to beds, see occupancy, generate the month on your billing day, mark paid, keep deposits separate. Web at the desk, Android on site, free in beta. No gateway, no tenant login — the monthly picture, not a hotel suite.',
      },
    ],
  },
];
