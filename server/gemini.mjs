const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function apiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(new Error("Server is missing GEMINI_API_KEY"), { status: 503 });
  }
  return process.env.GEMINI_API_KEY;
}

function toParts(content) {
  if (typeof content === "string") return [{ text: content }];
  return content.map((part) => {
    if (part.type === "text") return { text: part.text };
    if (part.type === "image_url") {
      const match = /^data:(.+?);base64,(.*)$/.exec(part.image_url.url);
      if (match) return { inlineData: { mimeType: match[1], data: match[2] } };
    }
    return { text: "" };
  });
}

function splitMessages(messages) {
  const systemParts = messages.filter((m) => m.role === "system").flatMap((m) => toParts(m.content));
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: toParts(m.content) }));
  return { systemInstruction: systemParts.length ? { parts: systemParts } : undefined, contents };
}

function stripFence(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : text.trim();
}

// Gemini occasionally returns malformed JSON: literal newlines/tabs inside string values
// instead of \n/\t, and literal unescaped " characters inside string content (e.g. quoting
// a word) instead of \". Both break JSON.parse. Repair both cases before parsing.
function safeJsonParse(text) {
  let inString = false;
  let escaped = false;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        out += ch;
        escaped = false;
      } else if (ch === "\\") {
        out += ch;
        escaped = true;
      } else if (ch === '"') {
        // Decide if this quote really ends the string: a real closing quote is followed
        // (after whitespace) by a JSON structural character. Otherwise it's a literal
        // quote embedded in the text — escape it instead of ending the string.
        let j = i + 1;
        while (j < text.length && /\s/.test(text[j])) j++;
        const next = text[j];
        const isRealClose = next === undefined || ",}]:".includes(next);
        if (isRealClose) {
          out += ch;
          inString = false;
        } else {
          out += '\\"';
        }
      } else if (ch === "\n") {
        out += "\\n";
      } else if (ch === "\r") {
        out += "\\r";
      } else if (ch === "\t") {
        out += "\\t";
      } else {
        out += ch;
      }
    } else {
      out += ch;
      if (ch === '"') inString = true;
    }
  }
  return JSON.parse(out);
}

async function callGemini(path, body) {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw Object.assign(new Error(`AI provider error: ${detail}`), { status: res.status });
  }
  return res;
}

export async function chatJSON({ model, messages, temperature = 0.7 }) {
  const { systemInstruction, contents } = splitMessages(messages);
  const res = await callGemini(`${model}:generateContent`, {
    contents,
    systemInstruction,
    generationConfig: { temperature, responseMimeType: "application/json" },
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ?? "{}";
  return safeJsonParse(stripFence(text));
}

export async function streamText({ model, messages, temperature = 0.6, search = false }) {
  const { systemInstruction, contents } = splitMessages(messages);
  const res = await callGemini(`${model}:streamGenerateContent?alt=sse`, {
    contents,
    systemInstruction,
    generationConfig: { temperature },
    ...(search ? { tools: [{ google_search: {} }] } : {}),
  });

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
        if (!payload) continue;
        try {
          const json = JSON.parse(payload);
          const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ?? "";
          if (text) yield text;
        } catch {
          // ignore partial/non-JSON keep-alive lines
        }
      }
    }
  })();
}
