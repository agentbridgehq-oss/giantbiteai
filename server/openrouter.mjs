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
    "HTTP-Referer": process.env.SITE_URL || "https://giantbiteai-production.up.railway.app",
    "X-Title": "GiantBiteAI",
  };
}

function stripFence(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : text.trim();
}

export async function chatJSON({ messages, temperature = 0.7 }) {
  const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1:free";
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

export async function streamText({ messages, temperature = 0.6 }) {
  const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1:free";
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ model, messages, temperature, stream: true }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw Object.assign(new Error(`OpenRouter error: ${detail}`), { status: res.status });
  }

  return (async function* () {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const text = json.choices?.[0]?.delta?.content ?? "";
          if (text) yield text;
        } catch {
          // ignore partial/non-JSON keep-alive lines
        }
      }
    }
  })();
}
