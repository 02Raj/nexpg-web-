const SARVAM_CHAT_URL = 'https://api.sarvam.ai/v1/chat/completions';

export type SarvamChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export async function sarvamChatCompletion(options: {
  messages: SarvamChatMessage[];
  model?: 'sarvam-105b-conversations' | 'sarvam-105b';
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const key = process.env.SARVAM_API_KEY?.trim();
  if (!key) {
    throw new Error('SARVAM_API_KEY is not set on the server. Add it in Vercel / .env.local.');
  }

  const res = await fetch(SARVAM_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': key,
    },
    body: JSON.stringify({
      model: options.model ?? 'sarvam-105b-conversations',
      messages: options.messages,
      max_tokens: options.maxTokens ?? 600,
      temperature: options.temperature ?? 0.3,
      n: 1,
    }),
  });

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
    message?: string;
  };

  if (!res.ok) {
    const msg = json.error?.message ?? json.message ?? res.statusText;
    throw new Error(`Sarvam API error: ${msg}`);
  }

  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Sarvam returned an empty reply.');
  return text;
}
