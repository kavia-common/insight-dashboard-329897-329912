import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function tooltipStyle() {
  return {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    boxShadow: "var(--shadow-md)",
    color: "var(--text)",
  };
}

// PUBLIC_INTERFACE
export function TrendChart({ data }) {
  /** Renders sessions/signups trend chart. */
  return (
    <div className="chartWrap" aria-label="Sessions trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.25)" strokeDasharray="4 6" />
          <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle()} />
          <Area
            type="monotone"
            dataKey="sessions"
            stroke="var(--primary-500)"
            fill="rgba(59, 130, 246, 0.18)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="signups"
            stroke="var(--accent-500)"
            fill="rgba(6, 182, 212, 0.16)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// PUBLIC_INTERFACE
export function BreakdownChart({ data }) {
  /** Renders acquisition breakdown chart. */
  return (
    <div className="chartWrap" aria-label="Acquisition breakdown chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.25)" strokeDasharray="4 6" />
          <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle()} />
          <Bar dataKey="value" fill="rgba(59, 130, 246, 0.65)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
