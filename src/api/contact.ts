import { getSupabase } from '@/lib/supabase/client';

export const CONTACT_TOPICS = [
  { id: 'sales', label: 'Sales / getting started' },
  { id: 'product', label: 'How the product works' },
  { id: 'support', label: 'Account or console issue' },
  { id: 'other', label: 'Something else' },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['id'];
export type ContactInquiryStatus = 'new' | 'read' | 'archived';

export type ContactInquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  topic: ContactTopic;
  message: string;
  status: ContactInquiryStatus;
  created_at: string;
};

export async function submitContactInquiry(input: {
  fullName: string;
  email: string;
  phone: string;
  topic: ContactTopic;
  message: string;
  honeypot: string;
}) {
  if (input.honeypot.trim()) {
    return;
  }

  const supabase = getSupabase();
  const { error } = await supabase.from('contact_inquiries').insert({
    full_name: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim() || null,
    topic: input.topic,
    message: input.message.trim(),
    status: 'new',
  });
  if (error) throw error;
}

export async function fetchContactInquiries(): Promise<ContactInquiry[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ContactInquiry[]) ?? [];
}

export async function setContactInquiryStatus(id: string, status: ContactInquiryStatus) {
  const supabase = getSupabase();
  const { error } = await supabase.from('contact_inquiries').update({ status }).eq('id', id);
  if (error) throw error;
}
