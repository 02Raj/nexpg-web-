import { GEO_ENTITY_SUMMARY } from '@/content/geo';
import Link from 'next/link';
import s from './geo-entity.module.css';

/** Visible factual block for humans + generative search (matches JSON-LD / llms.txt). */
export function GeoEntitySection() {
  return (
    <section className={s.wrap} aria-labelledby="geo-entity-heading">
      <div className={s.inner}>
        <p className={s.kicker}>About RunMyPG</p>
        <h2 id="geo-entity-heading" className={s.title}>
          PG management software for owners in India
        </h2>
        <p className={s.body}>{GEO_ENTITY_SUMMARY}</p>
        <p className={s.note}>
          Owner-only software — not a room listing site for tenants.{' '}
          <Link href="/llms.txt" className={s.link}>
            AI / llms.txt reference
          </Link>
        </p>
      </div>
    </section>
  );
}
