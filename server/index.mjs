import "dotenv/config";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { chatJSON, streamText } from "./gemini.mjs";
import { RECIPE_SYSTEM, MEALPLAN_SYSTEM, COACH_SYSTEM, RECIPE_IMPORT_SYSTEM } from "./prompts.mjs";
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
      const pageRes = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (GiantBiteAI recipe importer)" } });
      if (!pageRes.ok) throw Object.assign(new Error(`Couldn't fetch that link (${pageRes.status})`), { status: 422 });
      const html = await pageRes.text();
      sourceText = htmlToText(html).slice(0, 12000);
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

app.post("/api/checkout", async (req, res) => {
  try {
    const { plan = "monthly" } = req.body;
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
