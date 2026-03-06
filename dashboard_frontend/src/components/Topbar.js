import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function usePageMeta(pathname) {
  return useMemo(() => {
    if (pathname === "/") return { title: "Overview", crumb: "Dashboard" };
    if (pathname.startsWith("/table")) return { title: "Data Table", crumb: "Data" };
    if (pathname.startsWith("/settings")) return { title: "Settings", crumb: "Preferences" };
    if (pathname.startsWith("/admin")) return { title: "Admin", crumb: "Admin" };
    if (pathname.startsWith("/unauthorized")) return { title: "Unauthorized", crumb: "Access" };
    return { title: "Dashboard", crumb: "App" };
  }, [pathname]);
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const meta = usePageMeta(pathname);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  function onBlurCapture(e) {
    // Close when focus leaves the menu wrapper.
    if (menuRef.current && !menuRef.current.contains(e.relatedTarget)) {
      setOpen(false);
    }
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbarLeft">
        <div>
          <div className="pageTitle">{meta.title}</div>
          <div className="breadcrumb">{meta.crumb}</div>
        </div>
      </div>

      <div className="topbarRight">
        <button className="iconBtn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "Dark" : "Light"}
        </button>

        <div className="dropdown" ref={menuRef} onBlurCapture={onBlurCapture}>
          <button
            className="userChip"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <span className="avatar" aria-hidden="true" />
            <span className="userMeta">
              <span className="userName">{user?.name || "User"}</span>
              <span className="userRole">{user?.role || "—"}</span>
            </span>
            <span aria-hidden="true">▾</span>
          </button>

          {open ? (
            <div className="menu" role="menu" aria-label="User menu">
              <button
                className="menuItem"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  nav("/settings");
                }}
              >
                <span>Settings</span>
                <span className="sortHint">⌘</span>
              </button>
              <button
                className="menuItem menuItemDanger"
                role="menuitem"
                onClick={async () => {
                  setOpen(false);
                  await logout();
                  nav("/login");
                }}
              >
                <span>Logout</span>
                <span className="sortHint">⇥</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
