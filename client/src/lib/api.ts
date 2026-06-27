export interface Recipe {
  title: string;
  summary: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: { item: string; amount: string }[];
  steps: string[];
  substitutions: string[];
  wasteTip: string;
  estMoneySavedUsd: number;
  nutrition: { calories: number; proteinG: number; carbsG: number; fatG: number };
}

export interface RecipeResponse {
  detectedIngredients: string[];
  recipes: Recipe[];
}

export interface MealPlanDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

export interface MealPlanResponse {
  days: MealPlanDay[];
  shoppingList: { category: string; items: { name: string; qty: string }[] }[];
  estWeeklyCostUsd: number;
  estCaloriesPerDay: number;
  wasteReductionNotes: string[];
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function generateRecipe(input: {
  ingredientsText: string;
  photoBase64?: string;
  dietary?: string;
  leftoversMode?: boolean;
  tastePreferences?: string[];
  targetCalories?: number;
}) {
  return postJSON<RecipeResponse>("/recipe", input);
}

export function importRecipe(input: { url?: string; rawText?: string }) {
  return postJSON<{ recipe: Recipe }>("/import-recipe", input);
}

export function createCheckout(plan: "regular" | "pro") {
  return postJSON<{ url: string }>("/checkout", { plan });
}

export async function verifyCheckout(sessionId: string) {
  const res = await fetch(`/api/verify-checkout?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<{ paid: boolean }>;
}

export interface PairingResponse {
  wine: { suggestion: string; why: string };
  beer: { suggestion: string; why: string };
  cocktail: { suggestion: string; why: string };
  nonAlcoholic: { suggestion: string; why: string };
}

export function generatePairing(dish: string) {
  return postJSON<PairingResponse>("/pairing", { dish });
}

export function generateMealPlan(input: {
  days: number;
  dietary?: string;
  householdSize: number;
  budgetLevel: string;
  goals?: string;
}) {
  return postJSON<MealPlanResponse>("/mealplan", input);
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function* streamCoach(messages: ChatMessage[]): AsyncGenerator<string> {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok || !res.body) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request failed (${res.status})`);
  }

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
      if (payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // ignore partial/non-JSON keep-alive lines
      }
    }
  }
}
