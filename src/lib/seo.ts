import type { Metadata } from 'next';
import { MARKETING_FAQS } from '@/content/marketing';

export const SITE_URL = 'https://www.runmypg.in';
export const SITE_NAME = 'RunMyPG';
export const SITE_TAGLINE = 'PG Management Software for Owners in India';

export const DEFAULT_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  'RunMyPG is PG management software for Indian owners. Track bed occupancy, tenants, rent, bills and security deposits from web and Android — free while in beta.';

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
      type: 'website',
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
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/icon-512.svg`,
        },
        description: DEFAULT_DESCRIPTION,
        areaServed: { '@type': 'Country', name: 'India' },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'en-IN',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, Android',
        description: DEFAULT_DESCRIPTION,
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
          'Android app with real-time sync',
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
