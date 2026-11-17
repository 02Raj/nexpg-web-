import { rentReminderUrl } from '../reminder';

it('prepares an Indian WhatsApp reminder with the right month and amount', () => {
  const url = rentReminderUrl({ phone: '+91 98765 43210', tenantName: 'Asha', amount: 8500, period: '2026-11-01', buildingName: 'Green PG' });
  expect(url).toContain('wa.me/919876543210');
  expect(decodeURIComponent(url!)).toContain('November 2026 rent of ₹8,500');
});

it('rejects numbers that cannot be safely addressed', () => {
  expect(rentReminderUrl({ phone: '1234', tenantName: 'Asha', amount: 8500, period: '2026-11-01', buildingName: 'Green PG' })).toBeNull();
});
