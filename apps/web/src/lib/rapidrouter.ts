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
  const salutation = lead.ownerName ? `${lead.ownerName} Ji` : 'Bhaiya';
  const location = lead.area ? `${lead.area}, ${lead.city}` : lead.city;

  const systemPrompt = `You are a growth & marketing expert for RunMyPG (https://www.runmypg.in) - India's top PG & hostel management app.
Your task is to write a warm, friendly, highly effective 3-sentence WhatsApp pitch in conversational Hinglish (Hindi written in English alphabet) targeted to a PG / Hostel owner.

Rules:
1. Address the owner politely (e.g. "Namaste ${salutation} 🙏").
2. Mention their PG name "${lead.name}" and location "${location}".
3. Hit their biggest pain point: diary/register mein rent hisab, tenant slips bhejna, aur kamre ke bijli sub-meter ka calculation.
4. End with a quick call to action mentioning the free trial on https://www.runmypg.in.
5. Keep it concise, genuine, and punchy (under 60 words).
6. Output ONLY the plain WhatsApp message text. No explanations, no quotes around the response.`;

  const userPrompt = `Write the WhatsApp pitch for:
PG Name: ${lead.name}
Owner/Manager: ${lead.ownerName || 'Unknown'}
Location: ${location}`;

  try {
    const pitch = await rapidrouterChatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      maxTokens: 250,
    });
    return pitch.replace(/^["']|["']$/g, '').trim();
  } catch (err) {
    console.error('Failed to generate pitch with RapidRouter:', err);
    // Reliable fallback pitch
    return `Namaste ${salutation} 🙏 Maine aapka ${lead.name} (${location}) dekha. Kya har mahine tenants ke rent aur bijli sub-meter hisab diary mein jodne mein time waste hota hai? RunMyPG app se automated WhatsApp slips aur sub-meter calculation 1-click mein ho jata hai. Bilkul free trial try karke dekhiye: https://www.runmypg.in`;
  }
}
