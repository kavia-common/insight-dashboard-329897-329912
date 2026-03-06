import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { login, status, error } = useAuth();

  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("admin123");

  return (
    <div className="authWrap">
      <section className="panel authCard" aria-label="Login">
        <div className="authHeader">
          <div className="authTitle">Sign in</div>
          <div className="authSub">Use your credentials to access the dashboard.</div>
        </div>

        <form
          className="formGrid"
          onSubmit={async (e) => {
            e.preventDefault();
            await login({ email, password });
            nav("/");
          }}
        >
          <div className="formRow">
            <label className="label" htmlFor="email">
              Username
            </label>
            <input
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin or user"
              autoComplete="username"
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

          {error ? (
            <div
              className="badge"
              style={{ borderColor: "rgba(239,68,68,0.35)", color: "var(--danger-500)" }}
            >
              {error}
            </div>
          ) : null}

          <button className="btn btnPrimary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Signing in…" : "Sign in"}
          </button>

          <div className="helper">
            Backend mock users:
            <ul style={{ margin: "8px 0 0 18px", padding: 0 }}>
              <li>
                <code>admin</code> / <code>admin123</code> (role: admin)
              </li>
              <li>
                <code>user</code> / <code>user123</code> (role: user)
              </li>
            </ul>
          </div>
        </form>
      </section>
    </div>
  );
}
