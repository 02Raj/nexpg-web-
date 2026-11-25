import { isPlatformAdminEmail } from '@/lib/platform-admin';
import {
  generatePersonalizedLeadPitch,
  generatePersonalizedLeadEmail,
} from '@/lib/rapidrouter';
import { createClient } from '@/lib/supabase/server';
import type { GrowthLead } from '@nexpg/shared';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isPlatformAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  let body: {
    leadId?: string;
    type?: 'whatsapp' | 'email' | 'all';
    name?: string;
    ownerName?: string;
    city?: string;
    area?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  let name = body.name?.trim();
  let ownerName = body.ownerName?.trim();
  let city = body.city?.trim() || 'India';
  let area = body.area?.trim();

  if (body.leadId) {
    const { data: lead } = await supabase
      .from('growth_leads')
      .select('name, owner_name, city, area')
      .eq('id', body.leadId)
      .maybeSingle();

    if (lead) {
      name = lead.name;
      ownerName = lead.owner_name ?? undefined;
      city = lead.city;
      area = lead.area ?? undefined;
    }
  }

  if (!name) {
    return NextResponse.json({ error: 'PG name required' }, { status: 400 });
  }

  try {
    const targetType = body.type || 'whatsapp';
    let pitch: string | undefined;
    let emailResult: { subject: string; body: string } | undefined;
    const updates: Partial<GrowthLead> = { updated_at: new Date().toISOString() };

    if (targetType === 'whatsapp' || targetType === 'all') {
      pitch = await generatePersonalizedLeadPitch({
        name,
        ownerName,
        city,
        area,
      });
      updates.ai_pitch = pitch;
    }

    if (targetType === 'email' || targetType === 'all') {
      emailResult = await generatePersonalizedLeadEmail({
        name,
        ownerName,
        city,
        area,
      });
      // Store full body formatted with subject line on top if needed
      updates.email_body = `Subject: ${emailResult.subject}\n\n${emailResult.body}`;
    }

    if (body.leadId) {
      await supabase
        .from('growth_leads')
        .update(updates)
        .eq('id', body.leadId);
    }

    return NextResponse.json({
      pitch,
      email_subject: emailResult?.subject,
      email_body: updates.email_body,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error generating pitch';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
