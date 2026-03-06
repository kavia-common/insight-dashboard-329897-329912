/**
 * Minimal API client wrapper around fetch.
 * Uses REACT_APP_API_BASE_URL and includes Authorization header when token is present.
 */

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, "") || "";

/** @returns {string | null} */
function getToken() {
  try {
    return localStorage.getItem("insight.token");
  } catch {
    return null;
  }
}

/** @param {string} token */
export function setToken(token) {
  try {
    localStorage.setItem("insight.token", token);
  } catch {
    // ignore
  }
}

/** Clears stored auth token. */
export function clearToken() {
  try {
    localStorage.removeItem("insight.token");
  } catch {
    // ignore
  }
}

/**
 * @template T
 * @param {string} path
 * @param {RequestInit & { json?: any }} [options]
 * @returns {Promise<T>}
 */
async function request(path, options = {}) {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  const headers = new Headers(options.headers || {});

  // Default to JSON requests when a json body is provided.
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    if (isJson) {
      try {
        const data = await res.json();
        message = data?.detail || data?.message || message;
      } catch {
        // ignore
      }
    }
    const err = new Error(message);
    // @ts-ignore
    err.status = res.status;
    throw err;
  }

  if (isJson) return res.json();
  // @ts-ignore
  return res.text();
}

// PUBLIC_INTERFACE
export const apiClient = {
  /** Generic GET helper */
  get: (path) => request(path, { method: "GET" }),
  /** Generic POST helper */
  post: (path, json) => request(path, { method: "POST", json }),
};
