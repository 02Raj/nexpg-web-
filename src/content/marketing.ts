export const CITIES = [
  'Noida',
  'Gurgaon',
  'Delhi',
  'Ghaziabad',
  'Bangalore',
  'Pune',
  'Lucknow',
  'Ahmedabad',
  'Chandigarh',
];

export const MARKETING_CAPABILITIES = [
  'Tenant management',
  'Rooms & beds',
  'Rent collection',
  'Occupancy',
  'Security deposits',
] as const;

export const MARKETING_FAQS: { q: string; a: string }[] = [
  {
    q: 'What is RunMyPG?',
    a: 'RunMyPG is PG management software for paying guest and hostel owners in India. You run tenants, rooms, occupancy, rent bills and security deposits from one owner dashboard — on the web and on the Android app.',
  },
  {
    q: 'Is RunMyPG really free?',
    a: "Yes. RunMyPG is completely free while we're in beta. We want to build the best PG management tool in India, and your feedback during this period is invaluable. When we introduce paid plans, early users will receive special benefits.",
  },
  {
    q: 'How does the Android app work?',
    a: 'Open Android app from the menu (or /download). Sign in with the same email as the website, tap Request Android app if asked, then install when Download is ready.',
  },
  {
    q: 'Can I manage multiple PGs?',
    a: 'Yes. You can add as many properties as you want. Each property has its own rooms, beds, tenants, and billing — but you manage everything from a single dashboard with a simple property switcher.',
  },
  {
    q: 'Which cities do you support?',
    a: 'RunMyPG works across India. Pick popular cities like Noida, Gurgaon, or Bangalore — or type any city name and select your state. Smaller IT hubs like Lucknow, Ahmedabad, and Chandigarh are fully supported.',
  },
  {
    q: 'How do I contact RunMyPG?',
    a: 'WhatsApp +91 87070 54586, or email contact@runmypg.in, sales@runmypg.in, or support@runmypg.in. There is also a Contact page on the website.',
  },
  {
    q: 'Do I need both the web and mobile app?',
    a: 'No. The website is the full owner dashboard. The Android app is for when you are at the property. Use either, or both.',
  },
];

export const PRICING_ITEMS = [
  'Unlimited beds & rooms',
  'Rent & bill tracking',
  'Tenant onboarding',
  'Security deposit management',
  'Multi-property support',
  'Android app access',
  'Web owner console',
  'No hidden charges',
];
