import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { getCityGuides } from '@/content/cities';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import c from './cities.module.css';

const DESCRIPTION =
  'PG management software for owners across India — local guides for Delhi, Noida, Bangalore, Pune and more. Occupancy, rent and deposits on web and Android.';

export const metadata = pageMetadata({
  title: 'PG software by city in India',
  description: DESCRIPTION,
  path: '/cities',
  keywords: ['PG software India', 'PG management software Delhi', 'PG software Bangalore', 'PG software Noida'],
});

export default function CitiesPage() {
  const cities = getCityGuides();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${SITE_NAME} city guides`,
    url: `${SITE_URL}/cities`,
    description: DESCRIPTION,
    hasPart: cities.map((city) => ({
      '@type': 'WebPage',
      name: city.title,
      url: `${SITE_URL}/cities/${city.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingFrame navScrolled>
        <div className={c.page}>
          <p className={c.crumb}>
            <Link href="/">Home</Link>
            {' / '}
            Cities
          </p>
          <header className={c.hero}>
            <p className={c.kicker}>Across India</p>
            <h1 className={c.title}>PG management software by city in India</h1>
            <p className={c.lead}>
              RunMyPG works in any Indian city you type at setup. These guides are for local search —
              occupancy, rent and deposits for owners in that market — not a hotel directory.
            </p>
          </header>
          <div className={c.grid}>
            {cities.map((city) => (
              <Link key={city.slug} href={`/cities/${city.slug}`} className={c.card}>
                <span className={c.cardState}>{city.state}</span>
                <h2 className={c.cardName}>{city.name}</h2>
                <span className={c.cardGo}>Owner guide →</span>
              </Link>
            ))}
          </div>
          <p className={c.note}>
            Your city is missing? Add it when you create a property. The console is not limited to this
            list. For product pages, see{' '}
            <Link href="/pg-management-software">PG management software</Link>,{' '}
            <Link href="/hostel-management-software">hostel software</Link>, and{' '}
            <Link href="/pg-rent-collection-software">rent collection</Link>.
          </p>
        </div>
      </MarketingFrame>
    </>
  );
}
