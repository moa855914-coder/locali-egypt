/**
 * verifyPrices — Hybrid pricing intelligence backend
 * Pipeline: Cache → Google Places → AI Fallback
 * 
 * POST payload: { items: [{ item, category, city, lang? }] }
 * Returns: [{ item, city, category, min, max, currency, confidence, source, source_count, updated, notes }]
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

// In-memory server cache (persists across warm invocations)
const SERVER_CACHE = {};
const CACHE_TTL = {
  taxi: 6 * 3600_000,
  food_drinks: 6 * 3600_000,
  activities: 24 * 3600_000,
  accommodation: 48 * 3600_000,
  shopping: 12 * 3600_000,
  telecom: 7 * 24 * 3600_000,
  default: 12 * 3600_000,
};

function cacheKey(item, city, category) {
  return `${category}:${city}:${item}`.toLowerCase().replace(/\s+/g, '_');
}

function getCached(key, category) {
  const entry = SERVER_CACHE[key];
  if (!entry) return null;
  const ttl = CACHE_TTL[category] || CACHE_TTL.default;
  if (Date.now() - entry.ts > ttl) {
    delete SERVER_CACHE[key];
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  SERVER_CACHE[key] = { ts: Date.now(), data };
}

// Query Google Places Text Search for price signals
async function fetchGooglePlacesPrice(item, city, category) {
  if (!GOOGLE_PLACES_API_KEY) return null;

  const query = `${item} price ${city} Egypt`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&language=en&region=eg`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return null;

  // Extract price_level signals and review text
  const places = data.results.slice(0, 5);
  const priceLevels = places.filter(p => p.price_level != null).map(p => p.price_level);
  const ratings = places.filter(p => p.rating).map(p => p.rating);

  if (priceLevels.length === 0) return null;

  // Map Google price_level (0–4) to EGP ranges by category
  const EGP_MAP = {
    taxi:        [[0,0], [40,80],   [80,150],  [150,300], [300,600]],
    food_drinks: [[0,0], [30,80],   [80,200],  [200,500], [500,1500]],
    activities:  [[0,0], [50,200],  [200,600], [600,1500],[1500,5000]],
    accommodation:[[0,0],[300,800], [800,2500],[2500,7000],[7000,20000]],
    shopping:    [[0,0], [20,100],  [100,400], [400,1200],[1200,5000]],
    default:     [[0,0], [30,100],  [100,300], [300,900], [900,3000]],
  };

  const map = EGP_MAP[category] || EGP_MAP.default;
  const avgLevel = Math.round(priceLevels.reduce((a, b) => a + b, 0) / priceLevels.length);
  const [min, max] = map[Math.min(avgLevel, 4)];

  if (min === 0 && max === 0) return null;

  return {
    min,
    max,
    currency: 'EGP',
    source: 'google_places',
    source_count: places.length,
    confidence: priceLevels.length >= 3 ? 'high' : 'medium',
    confidence_score: priceLevels.length >= 3 ? 0.88 : 0.65,
    notes: `Based on ${places.length} Google Places listings in ${city}`,
  };
}

// AI fallback — estimates with city/category context
async function fetchAIPrice(item, city, category, base44) {
  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are a local Egypt pricing expert. Estimate a fair price range for the following item in Egypt.
Item: "${item}"
City: ${city}
Category: ${category}
Rules:
- Return a realistic EGP price range for TOURISTS (not locals)
- Base estimates on current Egypt market (2025–2026)
- Consider tourist-area pricing
- Be conservative — avoid extreme outliers
- If uncertain, widen the range

Return ONLY a JSON object with these exact fields:
{ "min": number, "max": number, "currency": "EGP", "notes": "brief context note", "confidence_score": 0.4 to 0.7 }`,
    response_json_schema: {
      type: 'object',
      properties: {
        min: { type: 'number' },
        max: { type: 'number' },
        currency: { type: 'string' },
        notes: { type: 'string' },
        confidence_score: { type: 'number' },
      },
    },
  });

  if (!result || !result.min) return null;

  return {
    min: result.min,
    max: result.max,
    currency: result.currency || 'EGP',
    source: 'ai_estimated',
    source_count: 0,
    confidence: 'estimated',
    confidence_score: result.confidence_score || 0.5,
    notes: result.notes || 'AI estimation — no live data available',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });

  const base44 = createClientFromRequest(req);

  const { items } = await req.json();
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'items array required' }, { status: 400 });
  }

  // Limit batch to 10
  const batch = items.slice(0, 10);
  const results = [];

  for (const { item, category = 'default', city = 'hurghada' } of batch) {
    const key = cacheKey(item, city, category);

    // 1. Cache hit
    const cached = getCached(key, category);
    if (cached) {
      results.push({ item, city, category, ...cached, from_cache: true });
      continue;
    }

    // 2. Google Places
    let priceData = null;
    try {
      priceData = await fetchGooglePlacesPrice(item, city, category);
    } catch (e) {
      // continue to AI fallback
    }

    // 3. AI fallback
    if (!priceData) {
      try {
        priceData = await fetchAIPrice(item, city, category, base44);
      } catch (e) {
        priceData = null;
      }
    }

    if (!priceData) {
      results.push({ item, city, category, error: 'No data available' });
      continue;
    }

    const output = {
      item,
      city,
      category,
      ...priceData,
      updated: new Date().toISOString(),
      from_cache: false,
    };

    setCache(key, { ...priceData, updated: output.updated });
    results.push(output);
  }

  return Response.json({ results });
});