import aiScript from './netlify/functions/ai-script.mjs';
import apifyTrending from './netlify/functions/apify-trending.mjs';

const request = (method, body) => ({ method, async json() { return body; } });
const aiCatalog = await aiScript(request('GET'));
const apifyNoKey = await apifyTrending(request('POST', { query: 'TikTok Shop', country: 'BR', limit: 5 }));
console.log(JSON.stringify({ aiCatalogStatus: aiCatalog.statusCode, aiCatalogHasProviders: JSON.parse(aiCatalog.body).providers?.length > 0, apifyStatus: apifyNoKey.statusCode, apifyError: JSON.parse(apifyNoKey.body).error }, null, 2));
