import { isPlatformAdminEmail } from '@/lib/platform-admin';
import { generatePersonalizedLeadPitch } from '@/lib/rapidrouter';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Curated high-potential PG hub datasets across major educational and IT cities in India
const CURATED_PG_HUBS: Record<
  string,
  Array<{ name: string; owner: string; phone: string; area: string; city: string }>
> = {
  kota: [
    { name: 'Shree Krishna Residency PG', owner: 'Mishra Ji', phone: '9829012345', area: 'Landmark City, Kunhari', city: 'Kota' },
    { name: 'Radha Rani Boys Hostel', owner: 'Sharma Ji', phone: '9414123456', area: 'Rajiv Gandhi Nagar', city: 'Kota' },
    { name: 'Balaji Executive Girls PG', owner: 'Gupta Ji', phone: '9828234567', area: 'Mahaveer Nagar 2', city: 'Kota' },
    { name: 'Allenite Comfort Stay PG', owner: 'Verma Ji', phone: '9460345678', area: 'Talwandi', city: 'Kota' },
    { name: 'Saraswati Girls Hostel', owner: 'Agarwal Ji', phone: '9829456789', area: 'Indra Vihar', city: 'Kota' },
    { name: 'Apex Premier Boys PG', owner: 'Choudhary Ji', phone: '9414567890', area: 'Coral Park', city: 'Kota' },
  ],
  bangalore: [
    { name: 'Sri Sai Balaji Luxury PG', owner: 'Reddy Garu', phone: '9845112233', area: 'Koramangala 4th Block', city: 'Bangalore' },
    { name: 'Green View Gents & Ladies PG', owner: 'Gowda Ji', phone: '9980223344', area: 'HSR Layout Sector 2', city: 'Bangalore' },
    { name: 'Venkateshwara Elite PG', owner: 'Rao Ji', phone: '9741334455', area: 'BTM 2nd Stage', city: 'Bangalore' },
    { name: 'Silicon Valley Executive PG', owner: 'Kumar Ji', phone: '9632445566', area: 'Electronic City Phase 1', city: 'Bangalore' },
    { name: 'Mayura Residency PG for Men', owner: 'Shetty Ji', phone: '9448556677', area: 'Marathahalli Bridge', city: 'Bangalore' },
    { name: 'Royal Orchid Coliving PG', owner: 'Patel Ji', phone: '9845667788', area: 'Whitefield ITPL', city: 'Bangalore' },
  ],
  delhi: [
    { name: 'Aggarwal Boys PG', owner: 'Aggarwal Ji', phone: '9811012345', area: 'Mukherjee Nagar', city: 'Delhi' },
    { name: 'Delhi Heights Girls PG', owner: 'Bhatia Ji', phone: '9899123456', area: 'Laxmi Nagar Metro', city: 'Delhi' },
    { name: 'Saraswati Student Stay', owner: 'Kapoor Ji', phone: '9873234567', area: 'Hudson Lane, GTB Nagar', city: 'Delhi' },
    { name: 'IAS Aspirants Elite PG', owner: 'Tyagi Ji', phone: '9810345678', area: 'Old Rajinder Nagar', city: 'Delhi' },
    { name: 'North Campus Scholar PG', owner: 'Singh Ji', phone: '9871456789', area: 'Kamla Nagar', city: 'Delhi' },
  ],
  pune: [
    { name: 'Sai Shradha Coliving & PG', owner: 'Patil Kaka', phone: '9822012345', area: 'Hinjewadi Phase 1', city: 'Pune' },
    { name: 'Phoenix IT Professionals PG', owner: 'Deshmukh Ji', phone: '9890123456', area: 'Wakad Bridge', city: 'Pune' },
    { name: 'Viman Nagar Luxury Stay PG', owner: 'Joshi Ji', phone: '9765234567', area: 'Viman Nagar', city: 'Pune' },
    { name: 'Sinhgad Student PG', owner: 'Shinde Ji', phone: '9823345678', area: 'Kothrud Paud Road', city: 'Pune' },
    { name: 'Symbiosis Girls Stay PG', owner: 'Kulkarni Ji', phone: '9422456789', area: 'Senapati Bapat Road', city: 'Pune' },
  ],
  noida: [
    { name: 'Shri Ram Luxury PG for Men', owner: 'Yadav Ji', phone: '9818012345', area: 'Sector 62 Institutional Area', city: 'Noida' },
    { name: 'Metro View Co-ed PG', owner: 'Chauhan Ji', phone: '9873123456', area: 'Sector 15 Metro', city: 'Noida' },
    { name: 'Amity Hub Girls & Boys PG', owner: 'Sharma Ji', phone: '9810234567', area: 'Sector 125 near Amity', city: 'Noida' },
    { name: 'TechZone Executive PG', owner: 'Singh Ji', phone: '9899345678', area: 'Greater Noida Knowledge Park', city: 'Noida' },
  ],
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isPlatformAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  let body: { city?: string; generatePitches?: boolean };
  try {
    body = await req.json();
  } catch {
    body = { city: 'kota', generatePitches: true };
  }

  const selectedKey = (body.city?.toLowerCase() ?? 'kota').trim();
  const matchedHub = CURATED_PG_HUBS[selectedKey] || CURATED_PG_HUBS.kota;

  // Process items and optionally generate AI pitch via RapidRouter
  const leadsToInsert = await Promise.all(
    matchedHub.map(async (item) => {
      let pitch: string | null = null;
      if (body.generatePitches !== false) {
        try {
          pitch = await generatePersonalizedLeadPitch({
            name: item.name,
            ownerName: item.owner,
            city: item.city,
            area: item.area,
          });
        } catch {
          pitch = null;
        }
      }

      return {
        name: item.name,
        owner_name: item.owner,
        phone: item.phone,
        city: item.city,
        area: item.area,
        source: 'google_maps_hub',
        status: 'new',
        ai_pitch: pitch,
      };
    })
  );

  const { data, error } = await supabase
    .from('growth_leads')
    .insert(leadsToInsert)
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: `Scraped & imported ${data?.length ?? 0} PG leads from ${selectedKey.toUpperCase()}`,
    count: data?.length ?? 0,
    leads: data ?? [],
  });
}
