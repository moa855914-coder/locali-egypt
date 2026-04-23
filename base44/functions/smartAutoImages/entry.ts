import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PEXELS_KEY = Deno.env.get('PEXELS_API_KEY');
const UNSPLASH_KEY = Deno.env.get('UNSPLASH_API_KEY');

// In-memory set to avoid duplicate URLs within a single run
const usedUrls = new Set();

// Build smart, location-accurate search queries
function buildQueries(name, city, category) {
  const cityEg = `${city} Egypt`.replace(/-/g, ' ');
  const cat = (category || '').replace(/_/g, ' ');
  const n = name || cat;

  // Category-specific realistic photo terms
  const catTerms = {
    restaurant: 'restaurant exterior facade',
    food: 'restaurant dining real',
    transport: 'transportation street',
    taxi: 'taxi street Egypt',
    activities: 'outdoor activity real location',
    accommodation: 'hotel exterior building',
    hotel: 'hotel facade exterior',
    shopping: 'market bazaar real',
    medical: 'clinic hospital exterior',
    telecom: 'mobile store shop',
    beach_club: 'beach club real Egypt',
    nightlife: 'bar lounge exterior night',
    remote_work: 'cafe coworking interior',
    long_stay: 'apartment building exterior',
    kids_family: 'family activity outdoor',
    sim_internet: 'mobile store Egypt',
    other: 'local business Egypt',
    horse_riding: 'horse riding desert Egypt real',
    boat: 'boat sea Egypt real',
    diving: 'diving reef Egypt underwater',
    snorkeling: 'snorkeling Red Sea Egypt',
    adventure: 'adventure outdoor Egypt',
    tour: 'guided tour Egypt real',
    culture: 'cultural site Egypt real',
    temple: 'ancient temple Egypt',
    museum: 'museum Egypt exterior',
  };

  const catHint = catTerms[category] || `${cat} real location`;

  return [
    `${n} ${cityEg} real location exterior`,
    `${n} ${cityEg}`,
    `${catHint} ${cityEg}`,
    `${cat} ${cityEg} real photo`,
    `${cityEg} ${cat} authentic`,
  ].filter(Boolean).map(q => q.trim());
}

// Score a Pexels photo for realism/relevance
function scorePexelsPhoto(photo, query) {
  let score = 0;
  const w = photo.width || 0;
  const h = photo.height || 0;

  // Prefer landscape
  if (w > h) score += 20;
  // Prefer high resolution
  if (w >= 1200) score += 15;
  if (w >= 800) score += 5;

  // Penalize obvious studio/stock shots (portrait orientation = often staged)
  if (h > w * 1.2) score -= 20;

  // Prefer photos with real-world alt text
  const alt = (photo.alt || '').toLowerCase();
  const realTerms = ['street', 'exterior', 'building', 'outdoor', 'beach', 'desert', 'sea', 'restaurant', 'hotel', 'market', 'egypt', 'real', 'location', 'entrance', 'facade', 'nature'];
  const stockTerms = ['white background', 'isolated', 'studio', 'transparent', 'cutout', 'smiling woman', 'smiling man'];

  for (const t of realTerms) { if (alt.includes(t)) score += 5; }
  for (const t of stockTerms) { if (alt.includes(t)) score -= 25; }

  return score;
}

// Score an Unsplash photo
function scoreUnsplashPhoto(photo) {
  let score = 0;
  const w = photo.width || 0;
  const h = photo.height || 0;

  if (w > h) score += 20;
  if (w >= 1200) score += 15;
  if (h > w * 1.2) score -= 20;

  const desc = ((photo.description || '') + ' ' + (photo.alt_description || '')).toLowerCase();
  const realTerms = ['street', 'exterior', 'outdoor', 'beach', 'desert', 'sea', 'restaurant', 'building', 'egypt', 'real', 'location', 'facade', 'market'];
  const stockTerms = ['studio', 'white background', 'isolated', 'portrait smiling'];

  for (const t of realTerms) { if (desc.includes(t)) score += 5; }
  for (const t of stockTerms) { if (desc.includes(t)) score -= 25; }

  // Boost popular/high-quality photos
  if (photo.likes > 100) score += 10;
  if (photo.likes > 500) score += 10;

  return score;
}

async function fetchPexelsBest(queries) {
  if (!PEXELS_KEY) return null;
  let best = null;
  let bestScore = -999;

  for (const query of queries.slice(0, 3)) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      const data = await res.json();
      const photos = data?.photos || [];

      for (const photo of photos) {
        const url = photo?.src?.large || photo?.src?.medium;
        if (!url || usedUrls.has(url)) continue;
        const score = scorePexelsPhoto(photo, query);
        if (score > bestScore) {
          bestScore = score;
          best = { url, score, source: 'pexels', confidence: score > 20 ? 'high' : 'medium' };
        }
      }
      if (best && bestScore > 30) break; // Good enough, stop
    } catch (_) { /* continue */ }
  }
  return best;
}

async function fetchUnsplashBest(queries) {
  if (!UNSPLASH_KEY) return null;
  let best = null;
  let bestScore = -999;

  for (const query of queries.slice(0, 3)) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&order_by=relevant`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
      );
      const data = await res.json();
      const photos = data?.results || [];

      for (const photo of photos) {
        const url = photo?.urls?.regular;
        if (!url || usedUrls.has(url)) continue;
        const score = scoreUnsplashPhoto(photo);
        if (score > bestScore) {
          bestScore = score;
          best = { url, score, source: 'unsplash', confidence: score > 20 ? 'high' : 'medium' };
        }
      }
      if (best && bestScore > 30) break;
    } catch (_) { /* continue */ }
  }
  return best;
}

async function getBestImage(name, city, category) {
  const queries = buildQueries(name, city, category);

  // Try Pexels first
  const pexels = await fetchPexelsBest(queries);
  if (pexels && pexels.score > 15) {
    usedUrls.add(pexels.url);
    return pexels;
  }

  // Fallback to Unsplash
  const unsplash = await fetchUnsplashBest(queries);
  if (unsplash) {
    usedUrls.add(unsplash.url);
    return unsplash;
  }

  // Return whatever we have even if low score
  if (pexels) {
    usedUrls.add(pexels.url);
    return { ...pexels, confidence: 'medium' };
  }

  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow scheduled/internal calls without user auth
    const body = await req.json().catch(() => ({}));
    const isScheduled = body.scheduled === true;

    if (!isScheduled) {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Admin only' }, { status: 403 });
      }
    }

    const limit = body.limit || 20;
    const entityTypes = body.entities || ['Service', 'Place', 'HiddenGemPlace'];

    const log = { updated: 0, failed: 0, skipped: 0, details: [] };

    for (const entity of entityTypes) {
      let records = [];

      try {
        if (entity === 'Service') {
          const all = await base44.asServiceRole.entities.Service.list('-created_date', 300);
          records = all.filter(s => !s.main_image || s.main_image === '').slice(0, limit);
        } else if (entity === 'Place') {
          const all = await base44.asServiceRole.entities.Place.list('-created_date', 300);
          records = all.filter(s => !s.main_image || s.main_image === '').slice(0, limit);
        } else if (entity === 'HiddenGemPlace') {
          const all = await base44.asServiceRole.entities.HiddenGemPlace.list('-created_date', 300);
          records = all.filter(s => (!s.main_image || s.main_image === '') && (!s.image_url || s.image_url === '')).slice(0, limit);
        }
      } catch (_) { continue; }

      for (const record of records) {
        const name = record.name || record.title || '';
        const city = (record.city || '').replace(/-/g, ' ');
        const category = record.category || record.tag || record.type || '';

        if (!name && !category) { log.skipped++; continue; }

        const result = await getBestImage(name, city, category);

        if (!result) {
          log.failed++;
          log.details.push({ entity, name, status: 'no_image', confidence: null });
          continue;
        }

        const updateData = {
          main_image: result.url,
          auto_image_confidence: result.confidence,
          auto_image_source: result.source,
        };

        if (entity === 'HiddenGemPlace') updateData.image_url = result.url;

        try {
          if (entity === 'Service') await base44.asServiceRole.entities.Service.update(record.id, updateData);
          else if (entity === 'Place') await base44.asServiceRole.entities.Place.update(record.id, updateData);
          else if (entity === 'HiddenGemPlace') await base44.asServiceRole.entities.HiddenGemPlace.update(record.id, updateData);

          log.updated++;
          log.details.push({ entity, name, status: 'updated', url: result.url, confidence: result.confidence, source: result.source });
        } catch (err) {
          log.failed++;
          log.details.push({ entity, name, status: 'db_error', error: err.message });
        }
      }
    }

    return Response.json({ success: true, ...log, timestamp: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});