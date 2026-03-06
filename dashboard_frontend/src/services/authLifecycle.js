import { subscribeAuthEvents } from "./authEvents";
import { logout } from "./authService";

/**
 * Initializes global auth lifecycle handling.
 *
 * Flow name: GlobalUnauthorizedLogoutFlow
 * Entrypoint: initAuthLifecycle()
 * Callers: src/index.js (exactly one)
 *
 * Behavior:
 * - On any 401 from apiClient, we clear local session and redirect to /login.
 * - We avoid calling React hooks here; this is a lightweight app-level side effect.
 */

// PUBLIC_INTERFACE
export function initAuthLifecycle() {
  /** Initializes global 401 handling and returns an unsubscribe cleanup function. */
  return subscribeAuthEvents(async (event) => {
    if (event?.type !== "unauthorized") return;

    // Ensure local session is cleared even if multiple 401s happen quickly.
    await logout();

    // Redirect to login if not already there.
    if (typeof window !== "undefined" && window.location?.pathname !== "/login") {
      window.location.assign("/login");
    }
  });
}
