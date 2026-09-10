import { corsJson, normalizeProduct } from "./_shared.mjs";

export default async (request) => {
  if (request.method === "OPTIONS") return corsJson({}, 204);
  if (request.method !== "POST") return corsJson({ error: "method_not_allowed" }, 405);
  try {
    if (!process.env.APIFY_API_TOKEN) return corsJson({ error: "APIFY_API_TOKEN_NOT_CONFIGURED" }, 400);
    if (!process.env.APIFY_ACTOR_ID) return corsJson({ error: "APIFY_ACTOR_ID_NOT_CONFIGURED" }, 400);
    const body = await request.json();
    const inputOverride = process.env.APIFY_INPUT_JSON ? JSON.parse(process.env.APIFY_INPUT_JSON) : {};
    const input = { ...inputOverride, query: body?.query || "TikTok Shop produtos mais vendidos", search: body?.query || "TikTok Shop produtos mais vendidos", country: body?.country || "BR", maxItems: Math.min(Math.max(Number(body?.limit || 20), 1), 50), limit: Math.min(Math.max(Number(body?.limit || 20), 1), 50) };
    const response = await fetch(`https://api.apify.com/v2/actors/${encodeURIComponent(process.env.APIFY_ACTOR_ID)}/run-sync-get-dataset-items`, { method: "POST", headers: { Authorization: `Bearer ${process.env.APIFY_API_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(input) });
    if (!response.ok) return corsJson({ error: `APIFY_API_ERROR_${response.status}`, detail: (await response.text()).slice(0, 300) }, response.status);
    const data = await response.json();
    const items = Array.isArray(data) ? data.filter((item) => item && typeof item === "object").map(normalizeProduct).slice(0, input.limit) : [];
    return corsJson({ items, count: items.length });
  } catch (error) {
    return corsJson({ error: error instanceof Error ? error.message : "apify_request_failed" }, 400);
  }
};

export const config = { path: "/api/apify-trending" };
