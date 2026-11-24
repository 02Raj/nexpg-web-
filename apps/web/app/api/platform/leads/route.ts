import { isPlatformAdminEmail } from '@/lib/platform-admin';
import { generatePersonalizedLeadPitch } from '@/lib/rapidrouter';
import { createClient } from '@/lib/supabase/server';
import type { GrowthLead } from '@nexpg/shared';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isPlatformAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const status = searchParams.get('status');

  let query = supabase
    .from('growth_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (city && city !== 'all') {
    query = query.ilike('city', `%${city}%`);
  }
  if (status && status !== 'all') {
    query = query.eq('status', status as GrowthLead['status']);
  }

  const { data, error } = await query;
  if (error) {
    // If table doesn't exist yet, return empty list gracefully
    return NextResponse.json({ leads: [] });
  }

  const rawLeads = data ?? [];

  // Check for auto-conversion: match registered owner phones
  try {
    const { data: owners } = await supabase
      .from('owner_profiles')
      .select('phone, email')
      .not('phone', 'is', null);

    const registeredPhones = new Set(
      (owners ?? [])
        .map((o) => (o.phone ? o.phone.replace(/\D/g, '').slice(-10) : ''))
        .filter((p) => p.length === 10)
    );

    const leadsToConvert = rawLeads.filter(
      (l) =>
        l.status !== 'converted' &&
        registeredPhones.has(l.phone.replace(/\D/g, '').slice(-10))
    );

    if (leadsToConvert.length > 0) {
      const idsToUpdate = leadsToConvert.map((l) => l.id);
      await supabase
        .from('growth_leads')
        .update({
          status: 'converted',
          updated_at: new Date().toISOString(),
          notes: 'Auto-converted: owner registered on RunMyPG',
        })
        .in('id', idsToUpdate);

      leadsToConvert.forEach((l) => {
        l.status = 'converted';
        l.notes = 'Auto-converted: owner registered on RunMyPG';
      });
    }
  } catch {
    // Non-blocking conversion check
  }

  return NextResponse.json({ leads: rawLeads });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isPlatformAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  let body: {
    leads?: Array<{
      name: string;
      owner_name?: string;
      phone: string;
      city: string;
      area?: string;
      source?: string;
      notes?: string;
    }>;
    generateAiPitch?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const incoming = body.leads ?? [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: 'No leads provided' }, { status: 400 });
  }

  const processed = await Promise.all(
    incoming.map(async (l) => {
      let pitch: string | null = null;
      if (body.generateAiPitch) {
        try {
          pitch = await generatePersonalizedLeadPitch({
            name: l.name,
            ownerName: l.owner_name,
            city: l.city,
            area: l.area,
          });
        } catch {
          pitch = null;
        }
      }
      return {
        name: l.name.trim(),
        owner_name: l.owner_name?.trim() || null,
        phone: l.phone.replace(/\D/g, '').slice(-10),
        city: l.city.trim(),
        area: l.area?.trim() || null,
        source: l.source || 'manual',
        status: 'new',
        ai_pitch: pitch,
        notes: l.notes || null,
      };
    })
  );

  const { data, error } = await supabase
    .from('growth_leads')
    .insert(processed)
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inserted: data?.length ?? 0, leads: data ?? [] });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isPlatformAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  let body: {
    id: string;
    status?: string;
    ai_pitch?: string;
    notes?: string;
    last_contacted_at?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const updates: Partial<GrowthLead> = { updated_at: new Date().toISOString() };
  if (body.status) updates.status = body.status as GrowthLead['status'];
  if (body.ai_pitch !== undefined) updates.ai_pitch = body.ai_pitch;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.last_contacted_at !== undefined) updates.last_contacted_at = body.last_contacted_at;

  const { data, error } = await supabase
    .from('growth_leads')
    .update(updates)
    .eq('id', body.id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead: data });
}
