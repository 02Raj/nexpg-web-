import { supabase } from '@/lib/supabase';
import type { FeedbackKind } from '@/lib/feedback-types';
import type { UserFeedbackInsert } from '@/types/database';

export { FEEDBACK_KINDS, feedbackKindLabel, type FeedbackKind } from '@/lib/feedback-types';

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

export async function submitUserFeedback(input: {
  kind: FeedbackKind;
  message: string;
  buildingId?: string | null;
  appSource: FeedbackAppSource;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Sign in to send feedback');

  const row: UserFeedbackInsert = {
    owner_id: user.id,
    building_id: input.buildingId ?? null,
    kind: input.kind,
    message: input.message.trim(),
    app_source: input.appSource,
    status: 'new',
  };
  const { error } = await supabase.from('user_feedback').insert(row);
  if (error) throw error;
}
