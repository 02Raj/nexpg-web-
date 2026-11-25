export type GrowthLead = {
  id: string;
  name: string;
  owner_name: string | null;
  phone: string;
  email?: string | null;
  city: string;
  area: string | null;
  source: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'rejected';
  ai_pitch: string | null;
  email_body?: string | null;
  notes: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchGrowthLeads(filters?: {
  city?: string;
  status?: string;
}): Promise<GrowthLead[]> {
  const params = new URLSearchParams();
  if (filters?.city && filters.city !== 'all') params.set('city', filters.city);
  if (filters?.status && filters.status !== 'all') params.set('status', filters.status);

  const res = await fetch(`/api/platform/leads?${params.toString()}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Could not fetch leads');
  const json = (await res.json()) as { leads?: GrowthLead[] };
  return json.leads ?? [];
}

export async function addGrowthLead(
  lead: {
    name: string;
    owner_name?: string;
    phone: string;
    email?: string;
    city: string;
    area?: string;
    notes?: string;
  },
  generateAiPitch = true
): Promise<GrowthLead> {
  const res = await fetch('/api/platform/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ leads: [lead], generateAiPitch }),
  });
  if (!res.ok) throw new Error('Could not add lead');
  const json = (await res.json()) as { leads?: GrowthLead[] };
  if (!json.leads?.[0]) throw new Error('No lead returned');
  return json.leads[0];
}

export async function updateGrowthLead(
  id: string,
  updates: Partial<GrowthLead>
): Promise<GrowthLead> {
  const res = await fetch('/api/platform/leads', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error('Could not update lead');
  const json = (await res.json()) as { lead?: GrowthLead };
  if (!json.lead) throw new Error('No lead returned');
  return json.lead;
}

export async function regenerateLeadPitch(leadId: string): Promise<string> {
  const res = await fetch('/api/platform/leads/generate-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ leadId, type: 'whatsapp' }),
  });
  if (!res.ok) throw new Error('Could not generate pitch');
  const json = (await res.json()) as { pitch?: string; error?: string };
  if (!json.pitch) throw new Error(json.error || 'Empty pitch returned');
  return json.pitch;
}

export async function regenerateLeadEmail(leadId: string): Promise<string> {
  const res = await fetch('/api/platform/leads/generate-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ leadId, type: 'email' }),
  });
  if (!res.ok) throw new Error('Could not generate email pitch');
  const json = (await res.json()) as { email_body?: string; error?: string };
  if (!json.email_body) throw new Error(json.error || 'Empty email returned');
  return json.email_body;
}

export async function scrapeHubLeads(
  city: string,
  generatePitches = true
): Promise<{ count: number; message: string; leads?: GrowthLead[] }> {
  const res = await fetch('/api/platform/leads/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ city, generatePitches }),
  });
  if (!res.ok) throw new Error('Could not scrape leads');
  return (await res.json()) as { count: number; message: string; leads?: GrowthLead[] };
}
