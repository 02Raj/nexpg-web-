import { FEEDBACK_KINDS, feedbackKindLabel } from '@/lib/feedback-types';

describe('feedback', () => {
  it('has four kinds', () => {
    expect(FEEDBACK_KINDS.map((k) => k.id)).toEqual(['bug', 'problem', 'ux', 'feature']);
  });

  it('feedbackKindLabel resolves known kind', () => {
    expect(feedbackKindLabel('bug')).toBe('Bug');
  });

  it('feedbackKindLabel passes through unknown', () => {
    expect(feedbackKindLabel('other')).toBe('other');
  });
});
