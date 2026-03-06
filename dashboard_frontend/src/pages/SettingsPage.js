import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  const { user, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <section className="panel" style={{ padding: 14 }} aria-label="Settings">
      <div className="panelHeader" style={{ padding: 0 }}>
        <div>
          <div className="panelTitle">Settings</div>
          <div className="panelSub">Theme, profile, and access</div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 14, gap: 12 }}>
        <div className="panel" style={{ padding: 14 }}>
          <div className="panelTitle">Theme</div>
          <div className="panelSub">Choose light or dark mode.</div>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button
              className={`btn ${theme === "light" ? "btnPrimary" : ""}`}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              className={`btn ${theme === "dark" ? "btnPrimary" : ""}`}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="panel" style={{ padding: 14 }}>
          <div className="panelTitle">Account</div>
          <div className="panelSub">Current session (scaffolding)</div>

          <div className="grid" style={{ marginTop: 12, gap: 8 }}>
            <div className="badge">
              Email: <strong>{user?.email || "—"}</strong>
            </div>
            <div className="badge">
              Role: <strong>{user?.role || "—"}</strong>
            </div>
            <div className="badge">
              Admin UI: <strong>{isAdmin ? "enabled" : "hidden"}</strong>
            </div>
          </div>

          <div className="helper">
            Role-based UI is implemented in the sidebar and via protected routes (admin-only page).
          </div>
        </div>
      </div>
    </section>
  );
}
