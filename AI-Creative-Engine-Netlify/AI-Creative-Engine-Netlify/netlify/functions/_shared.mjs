export const providerModels = {
  internal: ["gpt-5-mini", "gpt-5-nano", "claude-haiku-4-5", "gemini-3-flash-preview"],
  openai: ["gpt-5.5", "gpt-5", "gpt-5-mini", "gpt-5-nano"],
  codekraft: ["deepseek-v4-flash-0731", "gpt-5.6-luna", "deepseek-v4-pro-0813", "qwen3.8-27b", "kimi-k2.6", "gemini-3.7-flash", "glm-5.3", "claude-opus-5"],
};

export function json(body, status = 200) {
  return { statusCode: status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(body) };
}

export function corsJson(body, status = 200) {
  return { ...json(body, status), headers: { ...json(body, status).headers, "Access-Control-Allow-Origin": "*" } };
}

export function promptFor(surface, context) {
  if (surface === "tiktokshop") return `Crie um roteiro de TikTok Shop em português do Brasil para este contexto: ${context}. Entregue: gancho de 3 segundos, roteiro falado de até 35 segundos, texto curto na tela, CTA e descrição com hashtags moderadas. Não invente descontos, resultados ou características que não foram informados.`;
  return `Gere 5 ideias de vídeos verticais para este contexto: ${context}. Para cada ideia, entregue título, gancho, estrutura em 3 cenas, headline e CTA. Escreva em português do Brasil, com linguagem natural e sem promessas não comprovadas.`;
}

export function textFromMessage(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) return content.map((part) => part?.text || "").join("").trim();
  return "";
}

export async function compatibleChat(provider, model, surface, context) {
  if (provider === "internal") throw new Error("INTERNAL_PROVIDER_ONLY_AVAILABLE_IN_MANUS");
  if (!providerModels[provider]?.includes(model)) throw new Error("MODEL_NOT_ALLOWED_FOR_PROVIDER");
  const codekraft = provider === "codekraft";
  const key = codekraft ? process.env.CODEKRAFT_API_KEY : process.env.OPENAI_API_KEY;
  const base = codekraft ? (process.env.CODEKRAFT_API_BASE || "https://codecraftapi.com/v1") : (process.env.OPENAI_API_BASE || "https://api.openai.com/v1");
  if (!key) throw new Error(`${provider.toUpperCase()}_API_KEY_NOT_CONFIGURED`);
  const response = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ model, messages: [{ role: "system", content: "Você é um roteirista especialista em vídeos curtos e comércio social." }, { role: "user", content: promptFor(surface, context) }], temperature: 0.8 }) });
  if (!response.ok) throw new Error(`${provider.toUpperCase()}_API_ERROR_${response.status}`);
  const text = textFromMessage(await response.json());
  if (!text) throw new Error(`${provider.toUpperCase()}_EMPTY_RESPONSE`);
  return text;
}

function value(item, keys) { for (const key of keys) { const v = item?.[key]; if (v !== undefined && v !== null && String(v)) return String(v); } return ""; }
export function normalizeProduct(item) {
  return { title: value(item, ["title", "name", "productName", "product_title", "商品名称"]) || "Produto sem título", url: value(item, ["url", "productUrl", "product_url", "link", "商品链接"]), image: value(item, ["image", "imageUrl", "image_url", "thumbnail", "cover"]), price: value(item, ["price", "salePrice", "currentPrice", "priceText", "价格"]), sales: value(item, ["sales", "sold", "soldCount", "orders", "销量", "销售量"]), rating: value(item, ["rating", "score", "reviewScore", "评分"]), seller: value(item, ["seller", "shopName", "shop", "merchant", "店铺"]), raw: item };
}
