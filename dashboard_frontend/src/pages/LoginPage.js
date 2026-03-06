import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { login, status, error } = useAuth();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("demo");
  const [roleHint, setRoleHint] = useState("admin");

  return (
    <div className="authWrap">
      <section className="panel authCard" aria-label="Login">
        <div className="authHeader">
          <div className="authTitle">Sign in</div>
          <div className="authSub">
            Auth scaffolding with protected routes. Use role hint to simulate admin/user.
          </div>
        </div>

        <form
          className="formGrid"
          onSubmit={async (e) => {
            e.preventDefault();
            await login({ email, password, roleHint });
            nav("/");
          }}
        >
          <div className="formRow">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="formRow">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••"
              type="password"
              autoComplete="current-password"
            />
          </div>

          <div className="formRow">
            <label className="label" htmlFor="role">
              Role (mock)
            </label>
            <select
              id="role"
              className="select"
              value={roleHint}
              onChange={(e) => setRoleHint(e.target.value)}
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>

          {error ? (
            <div className="badge" style={{ borderColor: "rgba(239,68,68,0.35)", color: "var(--danger-500)" }}>
              {error}
            </div>
          ) : null}

          <button className="btn btnPrimary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Signing in…" : "Sign in"}
          </button>

          <div className="helper">
            Note: backend OpenAPI currently only exposes <code>/</code> health check; UI is wired for
            future auth endpoints (<code>/auth/login</code>).
          </div>
        </form>
      </section>
    </div>
  );
}
