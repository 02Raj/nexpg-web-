export type HelpTopic = {
  id: string;
  title: string;
  steps: string[];
};

export type HelpCategory = {
  id: string;
  title: string;
  blurb: string;
  topics: HelpTopic[];
};

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'account',
    title: 'Account & sign-in',
    blurb: 'Create the owner login, confirm email, reset the password.',
    topics: [
      {
        id: 'create',
        title: 'Create an account',
        steps: [
          'Open Sign up and enter your name, email and password (at least 6 characters).',
          'Check the inbox for a confirmation link from RunMyPG. Confirm, then sign in.',
          'Use the same email later on the Android app.',
        ],
      },
      {
        id: 'reset',
        title: 'Password will not work',
        steps: [
          'Use Forgot password, enter the same email, and open the reset mail.',
          'If the mail is missing, check spam. Confirmation and reset both come from our auth provider.',
          'Still stuck? Email support@runmypg.in from that address.',
        ],
      },
    ],
  },
  {
    id: 'setup',
    title: 'Set up the PG',
    blurb: 'Property first, then rooms and beds — that order avoids empty maps.',
    topics: [
      {
        id: 'building',
        title: 'Add a property',
        steps: [
          'After login, add the PG name, state, city and address. You can type any Indian city.',
          'Set the billing day (1–28). Rent bills for a month are generated on that day (IST).',
        ],
      },
      {
        id: 'rooms',
        title: 'Add rooms and beds',
        steps: [
          'Create each room, then the number of beds in it (up to 8 per room in setup).',
          'You can add more rooms later from Settings.',
          'If you run a second building, add another property — do not mix two PGs in one occupancy map.',
        ],
      },
    ],
  },
  {
    id: 'occupancy',
    title: 'Beds & occupancy',
    blurb: 'The map is the source of truth — vacant or filled, per bed.',
    topics: [
      {
        id: 'map',
        title: 'Read the bed map',
        steps: [
          'Open Beds. Each room shows its beds. Empty beds are ready for a tenant.',
          'Tap or click a filled bed to open that tenant. Empty beds start Add tenant.',
        ],
      },
    ],
  },
  {
    id: 'tenants',
    title: 'Tenants',
    blurb: 'A tenant lives on a bed, with rent and deposit on the same record.',
    topics: [
      {
        id: 'add',
        title: 'Add a tenant',
        steps: [
          'From an empty bed, add name, contact, monthly rent and security deposit.',
          'That bed then shows as occupied on the occupancy map.',
        ],
      },
      {
        id: 'deposit',
        title: 'Security deposit at vacate',
        steps: [
          'Deposits are not mixed into monthly rent bills.',
          'Settings lists deposits due for refund after vacate. Mark refunded when you have paid the tenant.',
        ],
      },
    ],
  },
  {
    id: 'bills',
    title: 'Rent & bills',
    blurb: 'One month at a time: pending until you mark paid.',
    topics: [
      {
        id: 'month',
        title: 'This month’s bills',
        steps: [
          'Open Bills. You will see tenants and whether this month is paid or pending.',
          'Mark paid when money has actually arrived (UPI, cash, or transfer — the console is the ledger, not the bank).',
          'Bills auto-create on your billing day. Change that day in Settings.',
        ],
      },
    ],
  },
  {
    id: 'android',
    title: 'Android app',
    blurb: 'Owner app on Android. Same email as the website.',
    topics: [
      {
        id: 'get-app',
        title: 'Install the app',
        steps: [
          'Sign in on the website, open Android app / download.',
          'Request the app if asked, wait until Download appears, then install the APK (allow unknown apps if Android asks).',
          'Open RunMyPG on the phone and sign in with the same password.',
        ],
      },
    ],
  },
  {
    id: 'trouble',
    title: 'Something looks wrong',
    blurb: 'Check these before you write to support.',
    topics: [
      {
        id: 'sync',
        title: 'Phone and website disagree',
        steps: [
          'Confirm both use the same email and the same property.',
          'Pull to refresh or reload the page. Then try again.',
          'If totals still differ, email support@runmypg.in with the property name and a screenshot.',
        ],
      },
      {
        id: 'escalate',
        title: 'When to contact us',
        steps: [
          'You cannot sign in after a password reset.',
          'The Android download never becomes ready.',
          'Bills did not generate on the billing day.',
          'Include your account email, city, and roughly when it happened.',
        ],
      },
    ],
  },
];

export const HELP_FAQS: { q: string; a: string }[] = [
  {
    q: 'What order should I set up in?',
    a: 'Account → confirm email → add property → add rooms and beds → add tenants → check Bills after the billing day. Skipping rooms means there is nowhere to seat a tenant.',
  },
  {
    q: 'Do I need the Android app?',
    a: 'No. The website is the full console. Use the phone when you are at the PG.',
  },
  {
    q: 'Is RunMyPG free?',
    a: 'Yes during beta. No card required. Refund policy explains what happens if paid plans start later.',
  },
  {
    q: 'Can my caretaker and I both log in?',
    a: 'Today the product is one owner login per account. Share the password only with people you trust, or wait until we ship separate staff roles.',
  },
];
