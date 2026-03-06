import { apiClient, clearToken, setToken } from "./apiClient";

/**
 * Note: Backend OpenAPI currently only shows a health endpoint.
 * This auth service provides scaffolding that:
 * - Tries backend endpoints if present in future
 * - Falls back to a mock local login for now (admin/user)
 */

const USER_KEY = "insight.user";

/** @typedef {{ id: string, name: string, email: string, role: "admin"|"user" }} AuthUser */

/** @returns {AuthUser|null} */
function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {AuthUser|null} user */
function saveUser(user) {
  try {
    if (!user) localStorage.removeItem(USER_KEY);
    else localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

/**
 * Mock token generator (NOT secure).
 * @param {AuthUser} user
 */
function makeMockToken(user) {
  // Do not treat as a real JWT. This is only scaffolding.
  return btoa(
    JSON.stringify({ sub: user.id, role: user.role, email: user.email, iat: Date.now() })
  );
}

// PUBLIC_INTERFACE
export function getStoredSession() {
  /** Returns persisted user session (if any). */
  return loadUser();
}

// PUBLIC_INTERFACE
export async function login({ email, password, roleHint }) {
  /**
   * Attempts real backend login (future). Currently uses mock auth fallback.
   * @param {{email: string, password: string, roleHint?: "admin"|"user"}} params
   * @returns {Promise<AuthUser>}
   */
  // Try a conventional endpoint if backend later provides it.
  try {
    const data = await apiClient.post("/auth/login", { email, password });
    // Expected (future): { access_token, user }
    if (data?.access_token) setToken(data.access_token);
    if (data?.user) saveUser(data.user);
    return data.user;
  } catch {
    // Fall back to mock login.
  }

  const normalizedEmail = (email || "").trim().toLowerCase();
  const isAdmin = roleHint
    ? roleHint === "admin"
    : normalizedEmail.includes("admin");

  const user = /** @type {AuthUser} */ ({
    id: isAdmin ? "u_admin_1" : "u_user_1",
    name: isAdmin ? "Alex Admin" : "Jamie User",
    email: normalizedEmail || (isAdmin ? "admin@example.com" : "user@example.com"),
    role: isAdmin ? "admin" : "user",
  });

  // Very light password check to avoid empty login.
  if (!password || password.length < 3) {
    throw new Error("Password must be at least 3 characters (mock auth).");
  }

  setToken(makeMockToken(user));
  saveUser(user);
  return user;
}

// PUBLIC_INTERFACE
export async function logout() {
  /** Clears session locally (and calls backend logout if available). */
  try {
    await apiClient.post("/auth/logout", {});
  } catch {
    // ignore
  }
  clearToken();
  saveUser(null);
}
