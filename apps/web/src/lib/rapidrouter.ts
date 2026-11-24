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
  const cleanOwner = (lead.ownerName || '').replace(/\s*(ji|garu|kaka|bhaiya|bhai)\s*$/i, '').trim();
  const salutation = cleanOwner ? `${cleanOwner} Ji` : 'Bhaiya';
  const location = lead.area ? `${lead.area}, ${lead.city}` : lead.city;

  const systemPrompt = `You are a high-conversion WhatsApp outreach copywriter for RunMyPG (https://www.runmypg.in).
Your goal: Write a SHORT, punchy, curiosity-inducing WhatsApp message to a PG / Hostel owner.
It MUST NOT look like a generic corporate ad or bot. It should read like a polite, genuine human asking a quick question.

Psychology Rules:
1. Address politely: "Namaste ${salutation} 🙏"
2. Personal verification: "Aapka ${lead.name} (${lead.city}) hai na?"
3. Direct curiosity trigger about their daily pain: "Aapke yahan har mahine tenants ke bijli meter aur rent ka hisab diary mein hota hai ya WhatsApp slip pe?"
4. Low-friction conversational close: "Humne PG owners ke liye free 1-click app banaya hai runmypg.in pe. Ek chhota 1-min demo bhejoon kya?"
5. Super short: strictly under 35-40 words total. Break into 2-3 short, easily scannable lines.
6. Output ONLY the raw WhatsApp message. No quotes, no placeholders.`;

  const userPrompt = `Write the short psychology-driven WhatsApp message for:
Owner: ${salutation}
PG Name: ${lead.name}
Location: ${location}`;

  try {
    const pitch = await rapidrouterChatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      maxTokens: 180,
    });
    return pitch.replace(/^["']|["']$/g, '').trim();
  } catch (err) {
    console.error('Failed to generate pitch with RapidRouter:', err);
    // Psychological high-converting fallback
    return `Namaste ${salutation} 🙏 Aapka ${lead.name} (${lead.city}) hai na?\n\nEk chhota sawal tha — aapke yahan kamre ke bijli meter aur rent ka hisab diary mein hota hai ya WhatsApp slip pe?\n\nHumne PG owners ke liye 1-click free tool banaya hai runmypg.in pe. Ek baar 1-min ka demo bhejoon kya?`;
  }
}
