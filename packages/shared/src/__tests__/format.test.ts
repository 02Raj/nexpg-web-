import { inr, monthLabel, rpcMessage } from '../format';
import { formatBuildingLocation } from '../locations';

describe('shared formatting', () => {
  it('formats Indian currency and billing months', () => {
    expect(inr(12500)).toContain('12,500');
    expect(monthLabel('2026-11-01')).toBe('November 2026');
  });

  it('normalizes RPC errors', () => {
    expect(rpcMessage({ message: 'ERROR: Tenant not found\nDETAIL: hidden' })).toBe(
      'Tenant not found',
    );
  });

  it('formats a building location consistently', () => {
    expect(
      formatBuildingLocation({ city: 'Noida', state: 'Uttar Pradesh', address: 'Sector 62' }),
    ).toBe('Sector 62 · Noida, Uttar Pradesh');
  });
});
