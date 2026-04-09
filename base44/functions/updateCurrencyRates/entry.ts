import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const ALERT_THRESHOLD = 0.5; // Alert if USD changes by more than 0.5 EGP

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch live rates from internet
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Get today's official exchange rates to Egyptian Pound (EGP) from Central Bank of Egypt, XE.com, or Google Finance. 
Return ONLY a JSON object with these exact keys: USD, EUR, GBP, RUB, PLN, CAD, AUD, SAR. 
Each value is a number: how many EGP does 1 unit of that currency buy.
Example: {"USD": 49.85, "EUR": 54.20, "GBP": 62.90, "RUB": 0.555, "PLN": 12.15, "CAD": 36.20, "AUD": 31.50, "SAR": 13.30}`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          USD: { type: 'number' },
          EUR: { type: 'number' },
          GBP: { type: 'number' },
          RUB: { type: 'number' },
          PLN: { type: 'number' },
          CAD: { type: 'number' },
          AUD: { type: 'number' },
          SAR: { type: 'number' },
        },
      },
    });

    if (!result?.USD || !result?.EUR) {
      return Response.json({ error: 'Failed to fetch rates from internet' }, { status: 500 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Get previous record to calculate change & detect big moves
    const existing = await base44.asServiceRole.entities.CurrencyRate.list('-created_date', 2);
    const previous = existing.find(r => r.rate_date !== today);

    const changeUsd = previous?.usd ? parseFloat((result.USD - previous.usd).toFixed(3)) : 0;
    const changeEur = previous?.eur ? parseFloat((result.EUR - previous.eur).toFixed(3)) : 0;

    let alert = null;
    if (Math.abs(changeUsd) >= ALERT_THRESHOLD) {
      alert = `⚠️ USD changed by ${changeUsd > 0 ? '+' : ''}${changeUsd} EGP vs yesterday (${previous.usd} → ${result.USD})`;
    }

    const rateRecord = {
      usd: result.USD,
      eur: result.EUR,
      gbp: result.GBP,
      rub: result.RUB,
      pln: result.PLN,
      cad: result.CAD,
      aud: result.AUD,
      sar: result.SAR,
      rate_date: today,
      source: 'Central Bank of Egypt / XE.com (AI-fetched)',
      change_usd: changeUsd,
      change_eur: changeEur,
      alert: alert || null,
    };

    // Check if we already have a record for today — update it, else create
    const todayRecord = existing.find(r => r.rate_date === today);
    if (todayRecord) {
      await base44.asServiceRole.entities.CurrencyRate.update(todayRecord.id, rateRecord);
    } else {
      await base44.asServiceRole.entities.CurrencyRate.create(rateRecord);
    }

    return Response.json({
      success: true,
      rates: rateRecord,
      change_usd: changeUsd,
      alert,
      message: `Rates updated for ${today}`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});