/**
 * Theme utilities.
 * Theme is stored in localStorage and applied to <html data-theme="...">.
 */

const STORAGE_KEY = "insight.theme";

/** @returns {"light"|"dark"} */
function normalizeTheme(value) {
  return value === "dark" ? "dark" : "light";
}

// PUBLIC_INTERFACE
export function getInitialTheme() {
  /** Returns persisted theme or system preference (fallback). */
  const persisted = localStorage.getItem(STORAGE_KEY);
  if (persisted) return normalizeTheme(persisted);

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

// PUBLIC_INTERFACE
export function applyTheme(theme) {
  /** Applies theme to the root element and persists it. */
  const normalized = normalizeTheme(theme);
  document.documentElement.setAttribute("data-theme", normalized);
  localStorage.setItem(STORAGE_KEY, normalized);
}
