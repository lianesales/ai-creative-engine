import { compatibleChat, corsJson, json, providerModels } from "./_shared.mjs";

export default async (request) => {
  if (request.method === "OPTIONS") return corsJson({}, 204);
  try {
    if (request.method === "GET") return corsJson({ providers: Object.entries(providerModels).map(([id, models]) => ({ id, models })) });
    if (request.method !== "POST") return corsJson({ error: "method_not_allowed" }, 405);
    const body = await request.json();
    const { provider, model, surface, context } = body || {};
    if (!provider || !model || !surface || !String(context || "").trim()) return corsJson({ error: "provider_model_surface_context_required" }, 400);
    const text = await compatibleChat(provider, model, surface, String(context).trim());
    return corsJson({ provider, model, surface, text });
  } catch (error) {
    return corsJson({ error: error instanceof Error ? error.message : "ai_request_failed" }, 400);
  }
};

export const config = { path: "/api/ai-script" };
