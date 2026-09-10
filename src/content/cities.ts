export type CityFaq = { q: string; a: string };

export type CityGuide = {
  slug: string;
  name: string;
  state: string;
  title: string;
  description: string;
  intro: string;
  landscape: string;
  pockets: { name: string; note: string }[];
  onSite: string;
  atDesk: string;
  faqs: CityFaq[];
  related: string[];
};

export const CITY_GUIDES: CityGuide[] = [
  {
    slug: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    title: 'PG management software for Delhi owners',
    description:
      'Run occupancy, rent and deposits for Delhi paying guest buildings from one owner console — web at the desk, Android at the gate.',
    intro:
      'Delhi PG inventory turns over with coaching calendars, campus terms and job hops. The owner who still keeps beds in a register finds out about an empty bed after the broker does. RunMyPG is the desk-and-phone console for that reality — not a hotel front desk.',
    landscape:
      'North and East Delhi lean student and coaching. South and West mix professionals who expect a clean rent record, not a WhatsApp screenshot. One building can hold both. The software has to show beds, not “units”, and it has to travel with you when you walk three floors after dinner.',
    pockets: [
      { name: 'Laxmi Nagar', note: 'Short stays. Beds flip around exam windows.' },
      { name: 'Mukherjee Nagar', note: 'Coaching peaks. Occupancy is a weekly question.' },
      { name: 'South Extension / CR Park', note: 'Longer professional tenancies, deposit fights if records are thin.' },
      { name: 'Dwarka', note: 'Commuter PGs. Owners often manage more than one floor.' },
    ],
    onSite:
      'Open the Android app in the corridor. Occupied, empty, whose rent is pending — same account as the website. No photo of a spreadsheet.',
    atDesk:
      'On the laptop you add a tenant to a bed, set rent and deposit, and generate the month’s picture. Delhi owners who also have Noida or Gurgaon stock switch property instead of opening a second workbook.',
    faqs: [
      {
        q: 'Does RunMyPG work only in Delhi?',
        a: 'No. Delhi is a local guide. You can add a PG in any Indian city. The console is the same.',
      },
      {
        q: 'Can I run a Delhi PG and a Noida PG together?',
        a: 'Yes. Each property has its own rooms, beds, tenants and bills. Switch buildings in the dashboard.',
      },
    ],
    related: ['noida', 'gurgaon', 'ghaziabad'],
  },
  {
    slug: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh',
    title: 'PG management software for Noida owners',
    description:
      'Bed map, rent tracking and deposits for Noida PGs — Sector 62, 18, 137 and beyond. Web console plus Android, one login.',
    intro:
      'Noida PGs sit next to offices that change projects every few months. Move-ins cluster on Sundays. If occupancy lives in the caretaker’s head, you lose a week of rent before anyone says the bed is free.',
    landscape:
      'Sector 62 and 135–137 behave like professional hostels: UPI on the 1st, questions about last month’s total on the 3rd. Sector 18 and older pockets mix students with working tenants. You need a bed-level map, not a flat-level one.',
    pockets: [
      { name: 'Sector 62', note: 'IT crowd. Partial payments are common — pending must stay visible.' },
      { name: 'Sector 18', note: 'Mixed stays. Owners walk the building after work.' },
      { name: 'Sector 137', note: 'Newer inventory. Multiple towers, one owner.' },
      { name: 'Greater Noida', note: 'Student-heavy. Vacancy after semester end is the risk.' },
    ],
    onSite:
      'Mark a bed filled while you are still at the lock. The website updates. That is the whole point of RunMyPG in Noida — the round and the desk are one system.',
    atDesk:
      'Evening on the laptop: who is empty, who has not paid, which deposit you took in March. Then you close the lid. No “final_v4.xlsx”.',
    faqs: [
      {
        q: 'I already use Excel for my Noida PG. Why switch?',
        a: 'Excel does not walk the corridor with you. RunMyPG keeps the same beds on phone and web so the sheet and the building cannot drift.',
      },
      {
        q: 'Can staff use the phone while I use the website?',
        a: 'Same login, same property. Add a tenant on the web or in the Android app.',
      },
    ],
    related: ['delhi', 'gurgaon', 'ghaziabad'],
  },
  {
    slug: 'gurgaon',
    name: 'Gurgaon',
    state: 'Haryana',
    title: 'PG management software for Gurgaon owners',
    description:
      'Run Gurgaon PG occupancy and rent from one desk. Built for Cyber City, Golf Course Road and multi-property owners.',
    intro:
      'Gurgaon rents are high enough that a forgotten pending hurts. Tenants ask for a clear total. Owners run two or three buildings and still take calls at 10pm about “is 4B empty?”',
    landscape:
      'Cyber City and Golf Course Road want professional records. Older sectors still run mixed sharing. The product problem is the same: see every bed, collect rent without a chat archaeology, and keep deposits attached to the person who paid them.',
    pockets: [
      { name: 'Cyber City / DLF', note: 'Corporate stays. Clarity on paid vs pending matters.' },
      { name: 'Golf Course Road', note: 'Premium per-bed pricing. Empty beds are expensive.' },
      { name: 'Sohna Road', note: 'Growing inventory. Owners often add a second PG.' },
      { name: 'Old Gurgaon', note: 'Tighter buildings. Phone-first rounds after office.' },
    ],
    onSite:
      'You are in the basement parking and someone asks for a vacant sharing bed. The app is the answer — not a callback after you reach home.',
    atDesk:
      'Switch property, scan occupancy, close bills for the month. Gurgaon owners who also hold Noida stock keep both under one account.',
    faqs: [
      {
        q: 'Is this hostel software or PG software?',
        a: 'RunMyPG is for paying guest and hostel-style bed inventory — rooms with named beds — which is how most Gurgaon PGs actually rent.',
      },
      {
        q: 'Do I need the Android app?',
        a: 'No. The web console is complete. The app is for when you are at the property. Use one or both.',
      },
    ],
    related: ['delhi', 'noida', 'chandigarh'],
  },
  {
    slug: 'ghaziabad',
    name: 'Ghaziabad',
    state: 'Uttar Pradesh',
    title: 'PG management software for Ghaziabad owners',
    description:
      'Track beds and rent for Ghaziabad PGs — Indirapuram, Vaishali, crossing into Noida. One console, web and Android.',
    intro:
      'Ghaziabad PGs often feed commuters into Delhi and Noida. Rent per bed can be lower, bed count higher. Spreadsheet mistakes scale with the count, not the rent.',
    landscape:
      'Indirapuram and Vaishali mix families’ extra floors with purpose-built PGs. Owners may live in the same building. The risk is informal: cash, a notebook, and a cousin who “knows who paid.”',
    pockets: [
      { name: 'Indirapuram', note: 'Dense sharing. Need a bed map, not a room guess.' },
      { name: 'Vaishali / Kaushambi', note: 'Metro access. Turnover with job changes.' },
      { name: 'Crossing to Noida', note: 'Same owner, two cities — use two properties in the console.' },
    ],
    onSite:
      'Walk the floors with the phone. Empty beds should not wait for Sunday night Excel.',
    atDesk:
      'If you also run a Noida PG, do not merge the two occupancy lists. RunMyPG keeps properties separate and switchable.',
    faqs: [
      {
        q: 'My PG is small. Is software overkill?',
        a: 'A 12-bed PG still loses money when a checkout is not recorded. The console is light on purpose.',
      },
      {
        q: 'Can I type Ghaziabad if it is not in a list?',
        a: 'Yes. City guides are for SEO and context. In setup you can type any Indian city and pick the state.',
      },
    ],
    related: ['noida', 'delhi', 'lucknow'],
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    title: 'PG management software for Bangalore owners',
    description:
      'Whitefield, HSR, Electronic City, Bellandur — run Bangalore PG beds, rent and deposits from web and Android.',
    intro:
      'Bangalore tenants treat a PG like infrastructure: they want the bed to exist in a system, not a group chat. Owners who still reconcile on Sunday lose Monday’s occupancy truth.',
    landscape:
      'IT belts turn over with project ramps. Student pockets near campuses empty on a different calendar. One owner often holds inventory in two ends of the city — that is two properties in RunMyPG, not one tangled sheet.',
    pockets: [
      { name: 'Whitefield', note: 'High bed counts. Pending rent must be a list, not a feeling.' },
      { name: 'HSR / Koramangala', note: 'Professional sharing. Deposits are large enough to document.' },
      { name: 'Electronic City', note: 'Shift workers. You check occupancy on the phone at odd hours.' },
      { name: 'Bellandur / Sarjapur', note: 'New supply. Fill speed is the game.' },
    ],
    onSite:
      'Add a tenant from the Android app when they are standing at the door with bags. The laptop dashboard already shows the bed as filled.',
    atDesk:
      'Month view: collected vs pending, empty beds, which property. Bangalore owners should not keep Whitefield and HSR in one occupancy grid.',
    faqs: [
      {
        q: 'Do Bangalore PGs need GST-style invoices in RunMyPG?',
        a: 'RunMyPG tracks rent and payment status for operations. It is an owner console, not an accounting suite. Keep your CA in the loop for tax filings.',
      },
      {
        q: 'Can I manage two Bangalore buildings?',
        a: 'Yes. Add each as a property and switch. Beds and bills stay isolated.',
      },
    ],
    related: ['hyderabad', 'chennai', 'pune'],
  },
  {
    slug: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    title: 'PG management software for Pune owners',
    description:
      'Student seasons and IT belts in Pune — Baner, Hinjewadi, Kothrud, Kharadi. Occupancy and rent in one RunMyPG console.',
    intro:
      'Pune is two clocks: college years and IT joining dates. Owners who mix both in one notebook miss the empty bed that opened when a batch left in May.',
    landscape:
      'Hinjewadi and Kharadi behave like professional hostels. Kothrud and older campuses swing with academic years. Software has to show beds by room so you can refill the right inventory, not “the building is 80% full” as a vibe.',
    pockets: [
      { name: 'Hinjewadi / Wakad', note: 'IT joining waves. Onboarding happens in clusters.' },
      { name: 'Baner / Balewadi', note: 'Mixed professional. Rent follow-up is weekly work.' },
      { name: 'Kothrud / Shivajinagar', note: 'Student turnover. Deposits need a written trail.' },
      { name: 'Kharadi', note: 'Newer PGs. Owners often start a second property quickly.' },
    ],
    onSite:
      'Semester end: walk rooms with the phone, mark vacant, stop charging rent on that bed. The desk view matches before you reach home.',
    atDesk:
      'See which rooms are short. Pune owners using one sheet for “all PGs” should split properties the day they add the second building.',
    faqs: [
      {
        q: 'Is RunMyPG for hostels or only PGs?',
        a: 'If you rent by bed inside rooms, it fits — student hostel or working PG. That is the Pune pattern.',
      },
      {
        q: 'Will this work if my PG is in Pimpri-Chinchwad?',
        a: 'Yes. Add the city name you use. These city pages are guides, not a whitelist.',
      },
    ],
    related: ['mumbai', 'bangalore', 'hyderabad'],
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    title: 'PG management software for Hyderabad owners',
    description:
      'Gachibowli, HITEC City, Kondapur, Madhapur — PG occupancy and rent tracking for Hyderabad owners. Web + Android.',
    intro:
      'Cyberabad PGs fill and empty with project cycles. A bed that sits unmarked for five days is a rent you will not get back. The console should make emptiness loud.',
    landscape:
      'West Hyderabad is professional, UPI-heavy, impatient about messy totals. Older inner-city PGs still mix cash. RunMyPG does not replace UPI — it replaces the memory of who paid.',
    pockets: [
      { name: 'HITEC City / Madhapur', note: 'Fast move-ins. Assign bed on the phone.' },
      { name: 'Gachibowli / Kondapur', note: 'Large sharing. Occupancy map is the daily tool.' },
      { name: 'Kukatpally', note: 'Student plus professional mix. Two calendars, one building.' },
    ],
    onSite:
      'Night round: three empty beds you thought were full. Mark them. Tomorrow’s desk view is honest.',
    atDesk:
      'Pending list for the month, deposit on each tenant, switch if you also run a second tower.',
    faqs: [
      {
        q: 'Does RunMyPG collect rent from tenants online?',
        a: 'Owners record paid vs pending. Tenants can still pay UPI as they do today. The console is the ledger.',
      },
      {
        q: 'Can I use it for a ladies PG in Hyderabad?',
        a: 'Yes. The product is occupancy and billing for any PG you operate.',
      },
    ],
    related: ['bangalore', 'chennai', 'pune'],
  },
  {
    slug: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    title: 'PG management software for Mumbai owners',
    description:
      'Andheri, Powai, Navi Mumbai, Thane — keep Mumbai PG beds and rent in one place. Desk console and on-site Android.',
    intro:
      'Mumbai rent per bed is unforgiving. A pending you forgot is not a rounding error. Owners spread across Western line, Harbour, and Navi Mumbai cannot keep three notebooks honest.',
    landscape:
      'Andheri and Powai lean professional. Thane and Navi Mumbai often mean more beds, slightly lower rent, same chaos if occupancy is verbal. Local trains do not wait — neither should your vacancy list.',
    pockets: [
      { name: 'Andheri / Jogeshwari', note: 'High rent. Pending must be visible every morning.' },
      { name: 'Powai', note: 'Corporate sharing. Deposits deserve a proper field, not a chat.' },
      { name: 'Navi Mumbai', note: 'Growing stock. Second property is common.' },
      { name: 'Thane', note: 'Commute PGs. Phone checks after you leave the building.' },
    ],
    onSite:
      'You will not go home to “update Excel.” Mark paid or empty on the phone in the lift.',
    atDesk:
      'One login, properties split by location. Mumbai + Thane should never share a single occupancy grid.',
    faqs: [
      {
        q: 'I only have eight beds in Andheri. Do I still need this?',
        a: 'Eight high-rent beds are exactly where a missed vacancy hurts. The console is still simple.',
      },
      {
        q: 'Is there a Mumbai-only version?',
        a: 'No. Same RunMyPG. This page is local context for search and for owners who think in city names.',
      },
    ],
    related: ['pune', 'ahmedabad', 'hyderabad'],
  },
  {
    slug: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    title: 'PG management software for Chennai owners',
    description:
      'OMR, Guindy, Velachery, college belts — PG bed occupancy and rent for Chennai owners. Web console and Android app.',
    intro:
      'Chennai PGs split between OMR professionals and college neighbourhoods. Those two clocks do not match. A single “occupancy %” hides the empty bed in the student wing.',
    landscape:
      'OMR wants tidy monthly records. College belts empty in clusters. Owners who run both need per-property views, not one blended sheet named Chennai_all.',
    pockets: [
      { name: 'OMR / Siruseri', note: 'IT corridor. Bed-level vacancy is money.' },
      { name: 'Guindy / Velachery', note: 'Mixed tenancy. Follow-up lists beat group chats.' },
      { name: 'College belts', note: 'Batch exits. Deposits must be on the tenant record.' },
    ],
    onSite:
      'Tamil and English on the ground; the app is visual — beds, paid, empty. You do not need a training session.',
    atDesk:
      'See OMR and the student PG as two properties. Bills stay in the building they belong to.',
    faqs: [
      {
        q: 'Is the product available in Tamil?',
        a: 'The console is in English today. City pages and support can still help in the language you prefer over WhatsApp.',
      },
      {
        q: 'Can I add a PG outside Chennai later?',
        a: 'Yes. Any Indian city. Switch properties when you travel.',
      },
    ],
    related: ['bangalore', 'hyderabad', 'mumbai'],
  },
  {
    slug: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    title: 'PG management software for Lucknow owners',
    description:
      'Gomti Nagar, Hazratganj, college areas — run Lucknow PG occupancy and rent without a register-and-WhatsApp mix.',
    intro:
      'Lucknow PGs are growing with IT parks and universities. Many owners still trust a notebook because the building is “not that big.” Then the second floor fills and the notebook lies.',
    landscape:
      'Gomti Nagar leans working tenants. Older central pockets mix students. Family-run PGs need something a caretaker can open on a phone without a course.',
    pockets: [
      { name: 'Gomti Nagar', note: 'Newer PGs. Start digital before the second property.' },
      { name: 'Hazratganj / Aminabad side', note: 'Tighter buildings. Phone rounds matter.' },
      { name: 'College belts', note: 'Session-end vacancies. Mark empty the same day.' },
    ],
    onSite:
      'The caretaker updates a bed. You see it on the website from home. That trust is the product.',
    atDesk:
      'Simple occupancy and rent. Lucknow owners do not need hotel software. They need an honest map.',
    faqs: [
      {
        q: 'Is RunMyPG only for metro cities?',
        a: 'No. Lucknow, Chandigarh, Ahmedabad — if you have rooms and beds, the console fits.',
      },
      {
        q: 'How do I get the Android app?',
        a: 'Sign in on the website, open the download page, request the app, install when it is ready. Same email.',
      },
    ],
    related: ['noida', 'chandigarh', 'ahmedabad'],
  },
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    title: 'PG management software for Ahmedabad owners',
    description:
      'SG Highway, Prahlad Nagar, student belts — PG beds and rent in one RunMyPG console for Ahmedabad owners.',
    intro:
      'Ahmedabad’s PG stock is rising with campuses and offices. Owners who copy a Mumbai Excel template still miss Gujarati operating hours: you check the building yourself, often after shop close.',
    landscape:
      'SG Highway and Prahlad Nagar pull professionals. University belts empty on a different rhythm. One owner, two clocks — two properties in the console if the buildings are separate.',
    pockets: [
      { name: 'SG Highway', note: 'Professional sharing. Pending rent should be a screen, not a rumour.' },
      { name: 'Prahlad Nagar / Satellite', note: 'Mixed. Deposits on the tenant card.' },
      { name: 'Campus belts', note: 'Predictable exits. Mark vacant immediately.' },
    ],
    onSite:
      'Evening round with Android. Occupancy is the walk. Billing can wait until you sit down.',
    atDesk:
      'Paid vs pending for the month. If you add a second PG in Gandhinagar or another area, do not merge occupancy.',
    faqs: [
      {
        q: 'Can my manager in Ahmedabad use it while I am travelling?',
        a: 'Same login. Changes on phone show on web. You still see the property remotely.',
      },
      {
        q: 'Is there a Gujarati interface?',
        a: 'The product UI is English. WhatsApp support is happy to talk in the language you use.',
      },
    ],
    related: ['mumbai', 'pune', 'lucknow'],
  },
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    state: 'Chandigarh',
    title: 'PG management software for Chandigarh owners',
    description:
      'Chandigarh, Mohali, Panchkula PGs — occupancy and rent in one console. Web at the desk, Android on sector rounds.',
    intro:
      'Tricity PGs look orderly from the road and chaotic in the register. Sectors, Mohali IT, Panchkula — owners treat them as one market and one spreadsheet. That spreadsheet is usually wrong by Friday.',
    landscape:
      'Student and professional mix is the default. Distances are short, so you do check in person — which is why the phone app matters more than a heavy desktop-only tool.',
    pockets: [
      { name: 'Chandigarh sectors', note: 'Walkable rounds. Update occupancy before you leave the gate.' },
      { name: 'Mohali', note: 'IT plus students. Two properties if you operate both sides.' },
      { name: 'Panchkula', note: 'Quieter stock. Still needs a pending list.' },
    ],
    onSite:
      'Sector-to-sector on a scooter with the app open. That is a better ops design than a PC-only “PG ERP”.',
    atDesk:
      'Evening: empty beds, unpaid rent, deposits. Compact on purpose.',
    faqs: [
      {
        q: 'I have PGs in Mohali and Chandigarh. One account?',
        a: 'One account, two properties. Do not combine beds into a single map.',
      },
      {
        q: 'Is RunMyPG free in Chandigarh?',
        a: 'RunMyPG is free during beta for every city, including Tricity.',
      },
    ],
    related: ['delhi', 'lucknow', 'gurgaon'],
  },
];

export function getCityGuides(): CityGuide[] {
  return CITY_GUIDES;
}

export function getCityGuide(slug: string): CityGuide | undefined {
  return CITY_GUIDES.find((c) => c.slug === slug);
}
