const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

function apiKey() {
  return process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY;
}

function headers() {
  if (!apiKey()) {
    throw Object.assign(new Error("Server is missing OPENROUTER_API_KEY"), { status: 503 });
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey()}`,
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:5173",
    "X-Title": process.env.SITE_NAME || "GiantBiteAI",
  };
}

export async function chatJSON({ model, messages, temperature = 0.7 }) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ model, messages, temperature, response_format: { type: "json_object" } }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw Object.assign(new Error(`OpenRouter error: ${detail}`), { status: res.status });
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(stripFence(content));
}

export async function chatStream({ model, messages, temperature = 0.6 }) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ model, messages, temperature, stream: true }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw Object.assign(new Error(`OpenRouter error: ${detail}`), { status: res.status });
  }
  return res.body;
}

function stripFence(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : text.trim();
}
