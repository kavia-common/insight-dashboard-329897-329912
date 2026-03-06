import React, { useMemo } from "react";
import KpiCard from "../components/KpiCard";
import { BreakdownChart, TrendChart } from "../components/Charts";
import { getMockBreakdown, getMockKpis, getMockTrend } from "../services/mockData";

export default function OverviewPage() {
  const kpis = useMemo(() => getMockKpis(), []);
  const trend = useMemo(() => getMockTrend(), []);
  const breakdown = useMemo(() => getMockBreakdown(), []);

  return (
    <div className="grid" style={{ gap: 14 }}>
      <section className="grid gridKpi" aria-label="Key metrics">
        {kpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} delta={k.delta} icon={k.icon} />
        ))}
      </section>

      <section className="grid gridCharts" aria-label="Charts">
        <div className="panel chartCard">
          <div className="panelHeader">
            <div>
              <div className="panelTitle">Sessions & Signups</div>
              <div className="panelSub">Trend over time (mock)</div>
            </div>
            <span className="badge">Live-ready</span>
          </div>
          <TrendChart data={trend} />
        </div>

        <div className="panel chartCardSecondary">
          <div className="panelHeader">
            <div>
              <div className="panelTitle">Acquisition mix</div>
              <div className="panelSub">Share by channel (mock)</div>
            </div>
            <span className="badge">Breakdown</span>
          </div>
          <BreakdownChart data={breakdown} />
        </div>
      </section>
    </div>
  );
}
