import { inr, monthLabel, prettyDate, rpcMessage, todayIST } from '@/lib/format';

describe('format', () => {
  it('inr formats whole rupees', () => {
    expect(inr(10733)).toMatch(/10,733/);
  });

  it('todayIST returns YYYY-MM-DD', () => {
    expect(todayIST()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('monthLabel formats billing period', () => {
    expect(monthLabel('2026-09-01')).toMatch(/September/i);
  });

  it('prettyDate formats ISO date', () => {
    expect(prettyDate('2026-09-10')).toMatch(/10/);
  });

  it('rpcMessage extracts message', () => {
    expect(rpcMessage(new Error('ERROR: not allowed'))).toBe('not allowed');
  });

  it('rpcMessage uses fallback', () => {
    expect(rpcMessage(null, 'fallback')).toBe('fallback');
  });
});
