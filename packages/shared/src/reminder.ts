/** Prepare a reminder for the owner to review and send in WhatsApp. */
export function rentReminderUrl(input: {
  phone: string;
  tenantName: string;
  amount: number;
  period: string;
  buildingName: string;
}): string | null {
  const digits = input.phone.replace(/\D/g, '');
  const recipient = digits.length === 10 ? `91${digits}` : digits;
  if (recipient.length !== 12 || !recipient.startsWith('91')) return null;
  const month = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
    .format(new Date(`${input.period}T00:00:00+05:30`));
  const amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(input.amount);
  const message = `Hi ${input.tenantName}, this is a reminder that your ${month} rent of ${amount} for ${input.buildingName} is pending. Please pay using your usual method and confirm with us. Thank you.`;
  return `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
}
