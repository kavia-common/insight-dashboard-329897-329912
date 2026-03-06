import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <section className="panel" style={{ padding: 14 }} aria-label="Admin">
      <div className="panelHeader" style={{ padding: 0 }}>
        <div>
          <div className="panelTitle">Admin</div>
          <div className="panelSub">Role-protected route (admin only)</div>
        </div>
        <span className="badge">role: {user?.role || "—"}</span>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="badge">Admin actions would live here (user management, audit logs, etc.).</div>
      </div>
    </section>
  );
}
