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
    'google/gemma-4-31b-it:free';

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
