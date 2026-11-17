export async function fetchContactReplyDraft(inquiryId: string): Promise<string> {
  const res = await fetch('/api/platform/contact-draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ inquiryId }),
  });

  const json = (await res.json()) as { draft?: string; error?: string };
  if (!res.ok) {
    throw new Error(json.error ?? 'Could not generate draft');
  }
  if (!json.draft) throw new Error('Empty draft');
  return json.draft;
}
