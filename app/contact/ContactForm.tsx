'use client';

import { CONTACT_TOPICS, submitContactInquiry, type ContactTopic } from '@/api/contact';
import { Button } from '@/components/Button';
import { rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import Link from 'next/link';
import { useState } from 'react';
import c from './contact.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<ContactTopic>('sales');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      toast.error('Enter your name.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      toast.error('Enter a valid email so we can reply.');
      return;
    }
    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      toast.error('Phone should be 10 digits, or leave it blank.');
      return;
    }
    if (message.trim().length < 10) {
      toast.error('Write a short message (at least 10 characters).');
      return;
    }

    setBusy(true);
    try {
      await submitContactInquiry({ fullName, email, phone, topic, message, honeypot });
      setSent(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
      toast.success('Message sent. We will reply by email.');
    } catch (err) {
      toast.error(rpcMessage(err, 'Could not send. Try WhatsApp or email.'));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className={c.formCard}>
        <h2 className={c.formTitle}>Message received</h2>
        <p className={c.formLead}>We will get back to you on the email you entered. For something urgent, WhatsApp is faster.</p>
        <Button label="Send another" variant="secondary" onClick={() => setSent(false)} />
      </div>
    );
  }

  return (
    <form className={c.formCard} onSubmit={onSubmit} noValidate>
      <h2 id="contact-form-title" className={c.formTitle}>
        Contact form
      </h2>
      <p className={c.formLead}>Your name, email, and message. We reply from a @runmypg.in inbox.</p>

      <label className={c.hp} aria-hidden="true">
        Company website
        <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </label>

      <label className={c.field}>
        <span>Full name</span>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} required />
      </label>
      <div className={c.row}>
        <label className={c.field}>
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} required />
        </label>
        <label className={c.field}>
          <span>Phone (optional)</span>
          <input
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10 digits"
          />
        </label>
      </div>
      <label className={c.field}>
        <span>Topic</span>
        <select value={topic} onChange={(e) => setTopic(e.target.value as ContactTopic)}>
          {CONTACT_TOPICS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className={c.field}>
        <span>Message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={5} required />
      </label>
      <p className={c.fine}>
        We use this only to reply.{' '}
        <Link href="/privacy">Privacy Policy</Link>
      </p>
      <Button type="submit" label={busy ? 'Sending…' : 'Send message'} disabled={busy} />
    </form>
  );
}
