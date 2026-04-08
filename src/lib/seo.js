import { useEffect } from 'react';

// ─── Auto date helpers ────────────────────────────────────────────────────────
const NOW = new Date();
const MONTH_YEAR = NOW.toLocaleString('en-US', { month: 'long', year: 'numeric' }); // e.g. "April 2026"
const YEAR = NOW.getFullYear();
const ISO_DATE = NOW.toISOString().split('T')[0]; // e.g. "2026-04-08"

/** Replace or append current month/year in a string */
function injectDate(text) {
  if (!text) return text;
  // Replace existing year patterns like "2025" or "2026" with current year
  return text
    .replace(/\b202[0-9]\b/g, YEAR)
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+202[0-9]\b/gi, MONTH_YEAR);
}

/** Ensure title ends with current month/year marker if not already present */
function ensureDateInTitle(title) {
  if (!title) return title;
  if (title.includes(YEAR.toString())) return title; // already has year
  return `${title} — ${MONTH_YEAR}`;
}

// ─── Core SEO hook ────────────────────────────────────────────────────────────
/**
 * Sets document title, meta tags, Open Graph, canonical URL, and JSON-LD.
 * Automatically injects current month/year into titles and descriptions.
 */
export function useSEO({ title, description, jsonLd, image, nodate = false }) {
  const finalTitle = nodate ? title : ensureDateInTitle(injectDate(title));
  const finalDesc = injectDate(description);
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const siteImage = image || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&q=80';

  useEffect(() => {
    // ── Title ──
    if (finalTitle) document.title = finalTitle;

    // ── Meta description ──
    setMeta('name', 'description', finalDesc || '');

    // ── Canonical URL ──
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // ── Open Graph ──
    setMeta('property', 'og:title', finalTitle || '');
    setMeta('property', 'og:description', finalDesc || '');
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', siteImage);
    setMeta('property', 'og:site_name', 'Locali Egypt');
    setMeta('property', 'og:locale', 'en_US');

    // ── Twitter Card ──
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', finalTitle || '');
    setMeta('name', 'twitter:description', finalDesc || '');
    setMeta('name', 'twitter:image', siteImage);

    // ── Robots ──
    setMeta('name', 'robots', 'index, follow');

    // ── dateModified (helps Google know content is fresh) ──
    setMeta('name', 'revised', ISO_DATE);

    // ── JSON-LD ──
    if (jsonLd) {
      const existing = document.getElementById('json-ld-seo');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.id = 'json-ld-seo';
      script.type = 'application/ld+json';
      // Inject dateModified into any schema automatically
      const enriched = Array.isArray(jsonLd)
        ? jsonLd.map(item => ({ ...item, dateModified: ISO_DATE }))
        : { ...jsonLd, dateModified: ISO_DATE };
      script.text = JSON.stringify(enriched);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('json-ld-seo');
      if (s) s.remove();
    };
  }, [finalTitle, finalDesc]);
}

// ─── Meta tag helper ──────────────────────────────────────────────────────────
function setMeta(attrName, attrValue, content) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.content = content;
}

// ─── Schema builders ──────────────────────────────────────────────────────────

/** FAQPage JSON-LD */
export function buildFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    dateModified: ISO_DATE,
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** TouristDestination JSON-LD */
export function buildDestinationSchema(name, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name,
    description,
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
    dateModified: ISO_DATE,
    touristType: { '@type': 'Audience', audienceType: 'International Tourists' },
  };
}

/** WebSite JSON-LD for homepage */
export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Locali Egypt',
    url: 'https://localiegy.com',
    dateModified: ISO_DATE,
    description: `The #1 tourist safety and local guide platform for Egypt — ${MONTH_YEAR}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://localiegy.com/services?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Article/Guide JSON-LD for content pages */
export function buildArticleSchema({ title, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
    datePublished: '2025-01-01',
    dateModified: ISO_DATE,
    author: { '@type': 'Organization', name: 'Locali Egypt' },
    publisher: {
      '@type': 'Organization',
      name: 'Locali Egypt',
      logo: { '@type': 'ImageObject', url: 'https://localiegy.com/logo.png' },
    },
  };
}

// ─── Export current date helpers for use in components ────────────────────────
export { MONTH_YEAR, YEAR, ISO_DATE };