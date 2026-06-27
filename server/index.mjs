import "dotenv/config";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { chatJSON, streamText } from "./ai.mjs";
import { RECIPE_SYSTEM, MEALPLAN_SYSTEM, COACH_SYSTEM, RECIPE_IMPORT_SYSTEM, PAIRING_SYSTEM } from "./prompts.mjs";
import { createCheckoutSession, verifyCheckoutSession } from "./stripe.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = join(__dirname, "..", "client", "dist");

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/recipe", async (req, res) => {
  try {
    const {
      ingredientsText = "",
      photoBase64,
      dietary = "",
      leftoversMode = false,
      tastePreferences = [],
      targetCalories,
    } = req.body;

    const intro = leftoversMode
      ? "These are leftovers/odds and ends that need to become a new meal before they go bad."
      : "Generate recipes using mainly these ingredients, assuming basic pantry staples (oil, salt, pepper, flour) are available.";
    const dietaryLine = dietary ? `Dietary restriction/goal: ${dietary}.` : "";
    const tasteLine = tastePreferences.length ? `User taste preferences (lean into these when relevant): ${tastePreferences.join(", ")}.` : "";
    const calorieLine = targetCalories ? `Target roughly ${targetCalories} calories per serving.` : "";

    const baseText = `${intro} ${dietaryLine} ${tasteLine} ${calorieLine}`;

    let messages;
    if (photoBase64) {
      messages = [
        { role: "system", content: RECIPE_SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: `${baseText}\nFirst identify the food items visible in the photo, then use them as the ingredient list.${ingredientsText ? ` Also account for these additional ingredients: ${ingredientsText}` : ""}` },
            { type: "image_url", image_url: { url: photoBase64 } },
          ],
        },
      ];
    } else {
      messages = [
        { role: "system", content: RECIPE_SYSTEM },
        { role: "user", content: `${baseText}\nIngredients on hand: ${ingredientsText}` },
      ];
    }

    const result = await chatJSON({ model: MODEL, messages });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.post("/api/import-recipe", async (req, res) => {
  try {
    const { url = "", rawText = "" } = req.body;
    let sourceText = rawText;

    if (url) {
      const youtubeId = extractYouTubeId(url);
      if (youtubeId) {
        sourceText = (await fetchYouTubeTranscript(youtubeId)).slice(0, 12000);
      } else {
        let pageRes;
        try {
          pageRes = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (GiantBiteAI recipe importer)" } });
        } catch {
          throw Object.assign(new Error("Couldn't reach that URL — check it's correct and publicly accessible."), { status: 422 });
        }
        if (!pageRes.ok) throw Object.assign(new Error(`Couldn't fetch that link (${pageRes.status})`), { status: 422 });
        const html = await pageRes.text();
        sourceText = htmlToText(html).slice(0, 12000);
      }
    }

    if (!sourceText.trim()) {
      throw Object.assign(new Error("Paste a recipe link or the recipe text."), { status: 400 });
    }

    const messages = [
      { role: "system", content: RECIPE_IMPORT_SYSTEM },
      { role: "user", content: sourceText },
    ];
    const recipe = await chatJSON({ model: MODEL, messages });
    res.json({ recipe });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.post("/api/mealplan", async (req, res) => {
  try {
    const { days = 7, dietary = "", householdSize = 2, budgetLevel = "moderate", goals = "" } = req.body;
    const messages = [
      { role: "system", content: MEALPLAN_SYSTEM },
      {
        role: "user",
        content: `Build a ${days}-day meal plan for a household of ${householdSize}. Budget level: ${budgetLevel}. Dietary restrictions: ${dietary || "none"}. Goals: ${goals || "general healthy eating"}.`,
      },
    ];
    const result = await chatJSON({ model: MODEL, messages });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.post("/api/coach", async (req, res) => {
  try {
    const { messages = [] } = req.body;
    const upstream = await streamText({
      model: MODEL,
      messages: [{ role: "system", content: COACH_SYSTEM }, ...messages],
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for await (const delta of upstream) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: delta } }] })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.post("/api/pairing", async (req, res) => {
  try {
    const { dish = "" } = req.body;
    if (!dish.trim()) throw Object.assign(new Error("Tell me what you're serving."), { status: 400 });
    const messages = [
      { role: "system", content: PAIRING_SYSTEM },
      { role: "user", content: `Dish: ${dish}` },
    ];
    const result = await chatJSON({ model: MODEL, messages });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.post("/api/checkout", async (req, res) => {
  try {
    const { plan = "pro" } = req.body;
    const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;
    const url = await createCheckoutSession({ plan, origin });
    res.json({ url });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get("/api/verify-checkout", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) throw Object.assign(new Error("Missing session_id"), { status: 400 });
    const paid = await verifyCheckoutSession(session_id);
    res.json({ paid });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchYouTubeTranscript(videoId) {
  const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { "User-Agent": "Mozilla/5.0 (GiantBiteAI recipe importer)" },
  });
  if (!watchRes.ok) {
    throw Object.assign(new Error("Couldn't reach that YouTube video — check the link is correct and public."), { status: 422 });
  }
  const watchHtml = await watchRes.text();

  const match = watchHtml.match(/"captionTracks":(\[.*?\])/);
  if (!match) {
    throw Object.assign(
      new Error("That YouTube video doesn't have captions available, so a recipe can't be extracted from it."),
      { status: 422 }
    );
  }

  let tracks;
  try {
    tracks = JSON.parse(match[1].replace(/\\u0026/g, "&"));
  } catch {
    throw Object.assign(new Error("Couldn't read captions for that video."), { status: 422 });
  }

  const track = tracks.find((t) => t.languageCode?.startsWith("en")) || tracks[0];
  if (!track?.baseUrl) {
    throw Object.assign(new Error("Couldn't read captions for that video."), { status: 422 });
  }

  const captionRes = await fetch(track.baseUrl);
  if (!captionRes.ok) {
    throw Object.assign(new Error("Couldn't download captions for that video."), { status: 422 });
  }
  const xml = await captionRes.text();

  const text = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)]
    .map((m) =>
      m[1]
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/<[^>]+>/g, "")
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    throw Object.assign(new Error("That video's captions were empty."), { status: 422 });
  }
  return text;
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

app.use(express.static(CLIENT_DIST));
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(join(CLIENT_DIST, "index.html")));

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`GiantBiteAI server listening on :${PORT}`));
