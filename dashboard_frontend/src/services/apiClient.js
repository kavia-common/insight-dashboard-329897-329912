/**
 * Minimal API client wrapper around fetch.
 *
 * Contract:
 * - Base URL: REACT_APP_API_BASE_URL (optional). If omitted, uses relative paths (same origin).
 * - Auth: injects `Authorization: Bearer <token>` if a token exists.
 * - Errors: throws Error with `.status` set. On 401, emits a global auth event.
 * - Side effects: reads/writes localStorage for token via setToken/clearToken.
 */

import { emitAuthEvent } from "./authEvents";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, "") || "";

/** @returns {string} */
function resolveUrl(path, query) {
  const base = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  if (!query || Object.keys(query).length === 0) return base;

  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  const qs = usp.toString();
  return qs ? `${base}?${qs}` : base;
}

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
 * @param {RequestInit & { json?: any, query?: Record<string, any> }} [options]
 * @returns {Promise<T>}
 */
async function request(path, options = {}) {
  const url = resolveUrl(path, options.query);
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

    // Centralized unauthorized handling: emit and let app decide what to do.
    if (res.status === 401) {
      emitAuthEvent({ type: "unauthorized", detail: { path, url } });
    }

    throw err;
  }

  if (isJson) return res.json();
  // @ts-ignore
  return res.text();
}

// PUBLIC_INTERFACE
export const apiClient = {
  /** Generic GET helper */
  get: (path, query) => request(path, { method: "GET", query }),
  /** Generic POST helper */
  post: (path, json) => request(path, { method: "POST", json }),
};
