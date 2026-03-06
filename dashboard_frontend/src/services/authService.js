import { apiClient, clearToken, setToken } from "./apiClient";

/**
 * Auth integration for Insight Dashboard backend.
 *
 * Backend contract (FastAPI):
 * - POST /auth/login
 *    Request: { username, password }
 *    Response: { access_token, token_type, role, username }
 * - GET /auth/me
 *    Response: { username, full_name, role }
 *
 * This service persists:
 * - insight.token (JWT access token)
 * - insight.user  (derived user profile)
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

/** @param {{ username: string, full_name: string, role: string }} profile */
function mapProfileToAuthUser(profile) {
  const role = profile.role === "admin" ? "admin" : "user";
  const username = profile.username || "user";
  const fullName = profile.full_name || username;

  // We don't have email in backend profile; derive a stable placeholder for UI.
  const derivedEmail = `${username}@example.com`;

  return /** @type {AuthUser} */ ({
    id: `user:${username}`,
    name: fullName,
    email: derivedEmail,
    role,
  });
}

// PUBLIC_INTERFACE
export function getStoredSession() {
  /** Returns persisted user session (if any). */
  return loadUser();
}

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /**
   * Logs in against backend and persists token + user.
   *
   * Contract:
   *  - Inputs: { email, password } (UI uses email field; backend expects username)
   *  - Output: AuthUser
   *  - Errors: throws on 401/validation/network errors (message from backend when present)
   *  - Side effects: stores insight.token and insight.user in localStorage
   *
   * @param {{email: string, password: string}} params
   * @returns {Promise<AuthUser>}
   */
  const username = (email || "").trim();
  if (!username) throw new Error("Username is required.");
  if (!password) throw new Error("Password is required.");

  const tokenResp = await apiClient.post("/auth/login", { username, password });
  if (!tokenResp?.access_token) {
    throw new Error("Login failed: missing access_token in response.");
  }

  setToken(tokenResp.access_token);

  // Fetch /me to obtain full_name/role.
  const profile = await apiClient.get("/auth/me");
  const user = mapProfileToAuthUser(profile);

  saveUser(user);
  return user;
}

// PUBLIC_INTERFACE
export async function logout() {
  /** Clears session locally.
   * Contract:
   *  - Inputs: none
   *  - Output: void
   *  - Side effects: clears stored token + user
   */
  clearToken();
  saveUser(null);
}
