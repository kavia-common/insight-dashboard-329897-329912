import React from "react";

/**
 * @param {{ label: string, value: string, delta: number, icon?: string }} props
 */
export default function KpiCard({ label, value, delta, icon }) {
  const isUp = delta >= 0;
  return (
    <section className="panel kpiCard" aria-label={label}>
      <div className="kpiRow">
        <div>
          <div className="kpiLabel">{label}</div>
          <div className="kpiValue">{value}</div>
          <div className={`kpiDelta ${isUp ? "deltaUp" : "deltaDown"}`}>
            <span aria-hidden="true">{isUp ? "▲" : "▼"}</span>
            <span>{Math.abs(delta).toFixed(2)}%</span>
            <span className="sortHint">vs last period</span>
          </div>
        </div>
        <div className="kpiIcon" aria-hidden="true">
          {icon || "•"}
        </div>
      </div>
    </section>
  );
}
