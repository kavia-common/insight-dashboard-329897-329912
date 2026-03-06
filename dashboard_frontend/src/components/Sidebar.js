import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function linkClass({ isActive }) {
  return isActive ? "navLink navLinkActive" : "navLink";
}

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="brand" aria-label="Insight Dashboard">
        <div className="brandMark" aria-hidden="true" />
        <div className="brandText">
          <div className="brandTitle">Insight</div>
          <div className="brandSub">Ops dashboard</div>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={linkClass}>
          <span className="navIcon" aria-hidden="true">
            ⬚
          </span>
          Overview
        </NavLink>

        <NavLink to="/table" className={linkClass}>
          <span className="navIcon" aria-hidden="true">
            ≣
          </span>
          Data Table
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          <span className="navIcon" aria-hidden="true">
            ⚙
          </span>
          Settings
        </NavLink>

        {isAdmin ? (
          <NavLink to="/admin" className={linkClass}>
            <span className="navIcon" aria-hidden="true">
              ⛨
            </span>
            Admin
          </NavLink>
        ) : null}
      </nav>
    </aside>
  );
}
