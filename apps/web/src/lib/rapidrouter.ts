export type RapidRouterChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function rapidrouterChatCompletion(options: {
  messages: RapidRouterChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const apiKey =
    process.env.RAPIDROUTER_API_KEY?.trim() ||
    'sk-rr-v1-eIDjjYBIT7yvqYoa1SJt8YCqwCEETISN';
  const baseUrl =
    process.env.RAPIDROUTER_BASE_URL?.trim() || 'https://rapidrouter.ai/api/v1';
  const model =
    options.model ||
    process.env.RAPIDROUTER_MODEL?.trim() ||
    'openai/gpt-4o-mini';

  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      max_tokens: options.maxTokens ?? 300,
      temperature: options.temperature ?? 0.6,
    }),
  });

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
    message?: string;
  };

  if (!res.ok) {
    const msg = json.error?.message ?? json.message ?? res.statusText;
    throw new Error(`RapidRouter API error: ${msg}`);
  }

  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('RapidRouter returned an empty completion.');
  }

  return content;
}

export async function generatePersonalizedLeadPitch(lead: {
  name: string;
  ownerName?: string | null;
  city: string;
  area?: string | null;
}): Promise<string> {
  const cleanOwner = (lead.ownerName || '')
    .replace(/\s*(ji|garu|kaka|bhaiya|bhai|mr\.?|shri)\s*$/i, '')
    .replace(/^\s*(mr\.?|shri)\s*/i, '')
    .trim();
  const salutation = cleanOwner ? `Mr. ${cleanOwner}` : 'Sir';
  const location = lead.area ? `${lead.area}, ${lead.city}` : lead.city;

  const systemPrompt = `You are a B2B sales outreach copywriter for RunMyPG (https://www.runmypg.in).
Write a SHORT, professional, high-converting WhatsApp message in plain ENGLISH (no Hindi/Hinglish) to a PG / Hostel owner.
Do NOT sound like an automated ad. Sound like a polite, helpful human asking a genuine question.

Rules:
1. Address politely in English: "Hello ${salutation},"
2. Mention their property: "Hope you're well! Reaching out regarding ${lead.name} in ${location}."
3. Trigger daily pain with curiosity: "Quick question — do you still calculate electricity sub-meters and rent manually in diaries, or send automated WhatsApp slips?"
4. Low-friction conversational ask: "We built a free 1-click management tool at runmypg.in for PG owners. Mind if I share a quick 1-min demo?"
5. Keep it short (strictly under 35-40 words).
6. Format in 3 short, easy-to-read paragraphs.
7. Output ONLY the raw English text. No quotes, no placeholders.`;

  const userPrompt = `Write the English outreach message for:
Owner: ${salutation}
PG Name: ${lead.name}
Location: ${location}`;

  try {
    const pitch = await rapidrouterChatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      maxTokens: 160,
    });
    return pitch.replace(/^["']|["']$/g, '').trim();
  } catch (err) {
    console.error('Failed to generate pitch with RapidRouter:', err);
    // Reliable English fallback
    return `Hello ${salutation},\n\nHope you're well! Reaching out regarding ${lead.name} in ${location}.\n\nQuick question: are you still calculating electricity sub-meters and rent in paper diaries? We built a free 1-click tool at runmypg.in to send automated WhatsApp slips. Mind if I share a 1-min demo?`;
  }
}

export async function generatePersonalizedLeadEmail(lead: {
  name: string;
  ownerName?: string | null;
  city: string;
  area?: string | null;
}): Promise<{ subject: string; body: string }> {
  const cleanOwner = (lead.ownerName || '')
    .replace(/\s*(ji|garu|kaka|bhaiya|bhai|mr\.?|shri)\s*$/i, '')
    .replace(/^\s*(mr\.?|shri)\s*/i, '')
    .trim();
  const salutation = cleanOwner ? `Mr. ${cleanOwner}` : 'Property Owner';
  const location = lead.area ? `${lead.area}, ${lead.city}` : lead.city;

  const systemPrompt = `You are a B2B sales outreach copywriter for RunMyPG (https://www.runmypg.in).
Write a SHORT, professional, highly converting cold email in clean ENGLISH (no Hindi/Hinglish) to a PG / Hostel owner.
Rules:
1. Subject line: Curious, high-open-rate, no spam words (e.g. "Quick question regarding ${lead.name}" or "Automating rent & electricity slips for ${lead.name}").
2. Body:
   - Polite opening: "Hello ${salutation},"
   - Mention property: "Hope you are having a productive week. Reaching out regarding ${lead.name} in ${location}."
   - The Core Problem: "Most PG owners lose hours each month tracking room occupancies, calculating individual electricity sub-meters, and following up on unpaid rents across paper diaries or spreadsheets."
   - The Solution: "We created RunMyPG (https://www.runmypg.in) — a simple, modern management platform built specifically for Indian PG owners to send automated rent slips on WhatsApp and track bed vacancies in 1 click."
   - Call to action: "Would you be open to a quick 2-minute demo or a free trial to see how it works for ${lead.name}?"
   - Sign-off: "Best regards,\nDivyansh Raj\nFounder, RunMyPG\ncontact@runmypg.in"
3. Output format: strictly valid JSON with keys: "subject" and "body". No markdown fences or backticks.`;

  const userPrompt = `Generate the cold email for:
Owner: ${salutation}
PG Name: ${lead.name}
Location: ${location}`;

  try {
    const raw = await rapidrouterChatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      maxTokens: 350,
    });

    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned) as { subject?: string; body?: string };
    if (parsed.subject && parsed.body) {
      return { subject: parsed.subject.trim(), body: parsed.body.trim() };
    }
  } catch (err) {
    console.error('Failed to generate email with RapidRouter:', err);
  }

  // Reliable Fallback
  return {
    subject: `Quick question regarding ${lead.name} (${location})`,
    body: `Hello ${salutation},\n\nHope you're having a productive week. Reaching out regarding ${lead.name} in ${location}.\n\nMost PG owners we speak with lose hours every month calculating electricity sub-meter readings and chasing rent manually across notebooks.\n\nWe built RunMyPG (https://www.runmypg.in) — a simple, 1-click management tool for Indian PG owners to send automated rent slips on WhatsApp and track room vacancies.\n\nWould you be open to a quick 2-minute demo or a free trial for ${lead.name}?\n\nBest regards,\nRunMyPG Team\nhttps://www.runmypg.in`,
  };
}
