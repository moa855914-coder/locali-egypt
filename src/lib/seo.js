import { useEffect } from 'react';

/**
 * Sets document title, meta description, and injects JSON-LD structured data.
 * Call once per page with city-specific data.
 */
export function useSEO({ title, description, jsonLd }) {
  useEffect(() => {
    if (title) document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    if (description) metaDesc.content = description;

    if (jsonLd) {
      const existing = document.getElementById('json-ld-seo');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.id = 'json-ld-seo';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('json-ld-seo');
      if (s) s.remove();
    };
  }, [title, description]);
}

/** Build a FAQPage JSON-LD schema from our FAQ array */
export function buildFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** Build a TouristDestination schema */
export function buildDestinationSchema(name, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name,
    description,
    url: url || window.location.href,
    touristType: { '@type': 'Audience', audienceType: 'International Tourists' },
  };
}