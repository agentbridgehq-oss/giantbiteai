import * as gemini from "./gemini.mjs";
import * as openrouter from "./openrouter.mjs";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function chatJSON({ messages, temperature }) {
  try {
    return await gemini.chatJSON({ model: MODEL, messages, temperature });
  } catch (err) {
    console.error("Gemini chatJSON failed, falling back to OpenRouter:", err.message);
    return await openrouter.chatJSON({ messages, temperature });
  }
}

export async function streamText({ messages, temperature, search }) {
  try {
    return await gemini.streamText({ model: MODEL, messages, temperature, search });
  } catch (err) {
    console.error("Gemini streamText failed, falling back to OpenRouter (no live search support):", err.message);
    return await openrouter.streamText({ messages, temperature });
  }
}
