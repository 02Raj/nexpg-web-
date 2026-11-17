export const FEEDBACK_KINDS = [
  { id: 'bug', label: 'Bug', hint: 'Something broke or an error showed up' },
  { id: 'problem', label: 'Stuck', hint: 'I cannot finish what I need to do' },
  { id: 'ux', label: 'Too hectic', hint: 'Confusing or too many steps' },
  { id: 'feature', label: 'Feature idea', hint: 'Something you wish the app had' },
] as const;

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]['id'];

export function feedbackKindLabel(kind: string) {
  return FEEDBACK_KINDS.find((k) => k.id === kind)?.label ?? kind;
}
