import { JsonLd } from '@/components/JsonLd';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, homeJsonLd, pageMetadata } from '@/lib/seo';
import { MarketingHome } from './MarketingHome';

export const metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: '/',
  keywords: [
    'PG management software India',
    'hostel management software',
    'PG rent collection software',
    'PG occupancy tracking',
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <MarketingHome />
    </>
  );
}
