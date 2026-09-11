import type { Metadata } from 'next';
import { MARKETING_FAQS } from '@/content/marketing';
import { CONTACT } from '@/content/contact';
import {
  DEFAULT_DESCRIPTION,
  GEO_ALTERNATE_NAMES,
  GEO_ENTITY_SUMMARY,
  GEO_SEARCH_PHRASES,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from '@/content/geo';

export { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/content/geo';

export const DEFAULT_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;

export const OG_IMAGE_ALT = 'RunMyPG — PG management software for owners in India';

const INDEXABLE = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true },
} as const;

const NO_INDEX = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
} as const;

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const titleText = title;
  const ogTitle = titleText.includes(SITE_NAME) ? titleText : `${titleText} | ${SITE_NAME}`;
  const resolvedTitle = path === '/' ? { absolute: titleText } : titleText;

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical: url },
    robots: index ? INDEXABLE : NO_INDEX,
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: path.startsWith('/blog/') ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
    },
  };
}

export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: [...GEO_ALTERNATE_NAMES],
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/icon-512.svg`,
        },
        description: DEFAULT_DESCRIPTION,
        knowsAbout: [...GEO_SEARCH_PHRASES],
        areaServed: { '@type': 'Country', name: 'India' },
        email: CONTACT.emails.contact,
        telephone: CONTACT.phoneE164,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: CONTACT.emails.support,
            telephone: CONTACT.phoneE164,
            availableLanguage: ['English', 'Hindi'],
          },
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: CONTACT.emails.sales,
            telephone: CONTACT.phoneE164,
            availableLanguage: ['English', 'Hindi'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: [...GEO_ALTERNATE_NAMES],
        url: SITE_URL,
        description: GEO_ENTITY_SUMMARY,
        inLanguage: 'en-IN',
        publisher: { '@id': `${SITE_URL}/#organization` },
        about: { '@id': `${SITE_URL}/#app` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#app`,
        name: SITE_NAME,
        alternateName: [...GEO_ALTERNATE_NAMES],
        url: SITE_URL,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Property Management',
        operatingSystem: 'Web, Android',
        description: GEO_ENTITY_SUMMARY,
        audience: {
          '@type': 'Audience',
          audienceType: 'PG and hostel owners in India',
          geographicArea: { '@type': 'Country', name: 'India' },
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Bed occupancy map',
          'Rent and bill tracking',
          'Tenant onboarding',
          'Security deposit management',
          'Multi-property PG console',
          'Android owner app',
        ],
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: MARKETING_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };
}
