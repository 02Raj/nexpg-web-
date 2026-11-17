export const CONTACT = {
  emails: {
    contact: 'contact@runmypg.in',
    sales: 'sales@runmypg.in',
    support: 'support@runmypg.in',
  },
  // Public site: hide for now. Set SHOW_PUBLIC_SUPPORT_PHONE true to show WhatsApp again.
  phoneDisplay: '+91 87070 54586',
  phoneE164: '+918707054586',
  whatsappDigits: '918707054586',
} as const;

/** Flip to true to put WhatsApp / support number back on the marketing site. */
export const SHOW_PUBLIC_SUPPORT_PHONE = false;

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(
  'Hi RunMyPG — I have a question about the PG owner console.',
)}`;

export const MAILTO = {
  contact: `mailto:${CONTACT.emails.contact}`,
  sales: `mailto:${CONTACT.emails.sales}`,
  support: `mailto:${CONTACT.emails.support}`,
} as const;
