import { WHATSAPP_URL } from '@/content/contact';
import c from './whatsapp-fab.module.css';

export function WhatsAppFab() {
  return (
    <a
      className={c.fab}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp at +91 87070 54586"
    >
      <span className={c.icon}>WhatsApp</span>
      WA
    </a>
  );
}
