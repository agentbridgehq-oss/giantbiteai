/** Comfort Mode — larger type, higher contrast, simpler chrome for 55+ and anyone who wants it. */

const KEY = "giantbiteai_comfort_v1";

export type ComfortPrefs = {
  comfort: boolean; // large type + big targets
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: ComfortPrefs = {
  comfort: false,
  highContrast: false,
  reduceMotion: false,
};

export function getComfortPrefs(): ComfortPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function setComfortPrefs(next: Partial<ComfortPrefs>): ComfortPrefs {
  const merged = { ...getComfortPrefs(), ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  applyComfortToDom(merged);
  return merged;
}

export function applyComfortToDom(prefs: ComfortPrefs = getComfortPrefs()) {
  const root = document.documentElement;
  root.classList.toggle("gba-comfort", prefs.comfort);
  root.classList.toggle("gba-contrast", prefs.highContrast);
  root.classList.toggle("gba-reduce-motion", prefs.reduceMotion);
  root.dataset.comfort = prefs.comfort ? "on" : "off";
}
