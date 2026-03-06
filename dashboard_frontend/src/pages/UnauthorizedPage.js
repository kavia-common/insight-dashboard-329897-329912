import React from "react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="authWrap">
      <section className="panel authCard" aria-label="Unauthorized">
        <div className="authHeader">
          <div className="authTitle">Unauthorized</div>
          <div className="authSub">You don’t have permission to view that page.</div>
        </div>

        <div className="formGrid">
          <Link className="btn btnPrimary" to="/">
            Go to Overview
          </Link>
          <Link className="btn" to="/settings">
            Open Settings
          </Link>
        </div>
      </section>
    </div>
  );
}
