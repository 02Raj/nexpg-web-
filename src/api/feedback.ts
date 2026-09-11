import { getSupabase } from '@/lib/supabase/client';

export const FEEDBACK_KINDS = [
  { id: 'bug', label: 'Bug', hint: 'Something broke or an error showed up' },
  { id: 'problem', label: 'Stuck', hint: 'I cannot finish what I need to do' },
  { id: 'ux', label: 'Too hectic', hint: 'Confusing or too many steps' },
  { id: 'feature', label: 'Feature idea', hint: 'Something you wish the app had' },
] as const;

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]['id'];
export type FeedbackStatus = 'new' | 'read' | 'archived';
export type FeedbackAppSource = 'web' | 'android' | 'ios' | 'unknown';

export type UserFeedback = {
  id: string;
  owner_id: string;
  owner_email: string | null;
  building_id: string | null;
  kind: FeedbackKind;
  message: string;
  app_source: FeedbackAppSource;
  status: FeedbackStatus;
  created_at: string;
};

export function feedbackKindLabel(kind: string) {
  return FEEDBACK_KINDS.find((k) => k.id === kind)?.label ?? kind;
}

export async function submitUserFeedback(input: {
  kind: FeedbackKind;
  message: string;
  buildingId?: string | null;
  appSource: FeedbackAppSource;
}) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Sign in to send feedback');

  const { error } = await supabase.from('user_feedback').insert({
    owner_id: user.id,
    building_id: input.buildingId ?? null,
    kind: input.kind,
    message: input.message.trim(),
    app_source: input.appSource,
    status: 'new',
  });
  if (error) throw error;
}

export async function fetchUserFeedback(): Promise<UserFeedback[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('user_feedback')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as UserFeedback[]) ?? [];
}

export async function setUserFeedbackStatus(id: string, status: FeedbackStatus) {
  const supabase = getSupabase();
  const { error } = await supabase.from('user_feedback').update({ status }).eq('id', id);
  if (error) throw error;
}
