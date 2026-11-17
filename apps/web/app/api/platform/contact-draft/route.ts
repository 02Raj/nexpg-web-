import { growthAgentSystemPrompt, growthAgentUserPrompt } from '@/lib/growth-agent-kb';
import { isPlatformAdminEmail } from '@/lib/platform-admin';
import { sarvamChatCompletion } from '@/lib/sarvam';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isPlatformAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  let body: { inquiryId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const inquiryId = body.inquiryId?.trim();
  if (!inquiryId) {
    return NextResponse.json({ error: 'inquiryId required' }, { status: 400 });
  }

  const { data: row, error } = await supabase
    .from('contact_inquiries')
    .select('full_name, email, phone, topic, message')
    .eq('id', inquiryId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  try {
    const draft = await sarvamChatCompletion({
      messages: [
        { role: 'system', content: growthAgentSystemPrompt() },
        {
          role: 'user',
          content: growthAgentUserPrompt({
            fullName: row.full_name,
            email: row.email,
            phone: row.phone,
            topic: row.topic,
            message: row.message,
          }),
        },
      ],
    });

    return NextResponse.json({ draft });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Draft failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
