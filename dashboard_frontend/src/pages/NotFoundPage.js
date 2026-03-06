import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="authWrap">
      <section className="panel authCard" aria-label="Not found">
        <div className="authHeader">
          <div className="authTitle">Page not found</div>
          <div className="authSub">The page you’re looking for doesn’t exist.</div>
        </div>
        <div className="formGrid">
          <Link className="btn btnPrimary" to="/">
            Back to Overview
          </Link>
          <Link className="btn" to="/table">
            View Table
          </Link>
        </div>
      </section>
    </div>
  );
}
