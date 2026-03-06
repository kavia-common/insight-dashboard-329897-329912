/**
 * Auth event bus used by the API client to notify the app about auth lifecycle events
 * (e.g., "unauthorized" on 401).
 *
 * This avoids patchy per-request 401 handling and provides one canonical flow
 * for logout + redirect.
 */

const listeners = new Set();

/**
 * @typedef {"unauthorized"} AuthEventType
 * @typedef {{ type: AuthEventType, detail?: any }} AuthEvent
 */

// PUBLIC_INTERFACE
export function subscribeAuthEvents(listener) {
  /** Subscribe to auth events.
   * Contract:
   *  - Input: (event) => void
   *  - Output: unsubscribe() function
   *  - Side effects: adds listener to in-memory set
   */
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// PUBLIC_INTERFACE
export function emitAuthEvent(event) {
  /** Emit an auth event to all listeners.
   * Contract:
   *  - Input: {type, detail?}
   *  - Output: void
   *  - Errors: listener errors are caught and logged to avoid breaking emit chain
   */
  for (const fn of listeners) {
    try {
      fn(event);
    } catch (e) {
      // Keep event emission resilient; listeners should not break global handling.
      // eslint-disable-next-line no-console
      console.error("authEvents listener failed", e);
    }
  }
}
