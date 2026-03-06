import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { applyTheme, getInitialTheme } from "../utils/theme";

const ThemeContext = createContext(null);

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  /** Provides theme state (light/dark) and toggle functionality. */
  const [theme, setTheme] = useState(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(() => {
    return {
      theme,
      // PUBLIC_INTERFACE
      setTheme(next) {
        /** Sets theme explicitly. */
        setTheme(next);
      },
      // PUBLIC_INTERFACE
      toggleTheme() {
        /** Toggles between light and dark themes. */
        setTheme((t) => (t === "light" ? "dark" : "light"));
      },
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Hook for accessing theme state. */
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
