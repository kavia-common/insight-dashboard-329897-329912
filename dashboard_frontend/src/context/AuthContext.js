import React, { createContext, useContext, useMemo, useState } from "react";
import { getStoredSession, login as doLogin, logout as doLogout } from "../services/authService";

/** @typedef {{ id: string, name: string, email: string, role: "admin"|"user" }} AuthUser */

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authenticated user state and login/logout actions. */
  const [user, setUser] = useState(() => getStoredSession());
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      status,
      error,
      // PUBLIC_INTERFACE
      async login(params) {
        /** Logs in and stores user in context. */
        setStatus("loading");
        setError(null);
        try {
          const next = await doLogin(params);
          setUser(next);
          setStatus("idle");
          return next;
        } catch (e) {
          setStatus("error");
          setError(e?.message || "Login failed");
          throw e;
        }
      },
      // PUBLIC_INTERFACE
      async logout() {
        /** Logs out and clears session. */
        setStatus("loading");
        setError(null);
        try {
          await doLogout();
        } finally {
          setUser(null);
          setStatus("idle");
        }
      },
    };
  }, [user, status, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook for accessing authentication state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
