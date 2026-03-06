import React, { useEffect, useMemo, useState } from "react";
import KpiCard from "../components/KpiCard";
import { BreakdownChart, TrendChart } from "../components/Charts";
import { fetchChart, fetchKpis } from "../services/dashboardService";

function formatKpiValue(value, unit) {
  if (unit === "$") return `$${Math.round(value).toLocaleString()}`;
  if (unit === "%") return `${value.toFixed(2)}%`;
  // Default: friendly number
  return Number.isFinite(value) ? Math.round(value).toLocaleString() : String(value);
}

function mapKpiToCard(kpi) {
  const iconMap = {
    revenue: "💳",
    active_users: "👥",
    conversion: "✨",
    uptime: "🟢",
  };

  const valueStr = formatKpiValue(kpi.value, kpi.unit);
  const delta = typeof kpi.delta === "number" ? kpi.delta : 0;

  return {
    key: kpi.id,
    label: kpi.label,
    value: valueStr,
    delta,
    icon: iconMap[kpi.id] || "•",
  };
}

function toMonthLabel(isoTs) {
  try {
    const d = new Date(isoTs);
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  } catch {
    return String(isoTs);
  }
}

export default function OverviewPage() {
  const [kpisResp, setKpisResp] = useState(null);
  const [trendResp, setTrendResp] = useState(null);
  const [breakdownResp, setBreakdownResp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setError(null);
      try {
        const [kpis, trend, breakdown] = await Promise.all([
          fetchKpis(),
          fetchChart("trend", { days: 30 }),
          fetchChart("breakdown", { days: 30 }),
        ]);
        if (!mounted) return;
        setKpisResp(kpis);
        setTrendResp(trend);
        setBreakdownResp(breakdown);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load dashboard data.");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const kpiCards = useMemo(() => {
    const items = kpisResp?.items || [];
    return items.map(mapKpiToCard);
  }, [kpisResp]);

  const trend = useMemo(() => {
    const s1 = trendResp?.series?.[0];
    const s2 = trendResp?.series?.[1];

    // Charts component expects shape:
    // [{ name, sessions, signups }]
    // Map first two series to sessions/signups.
    const points = s1?.points || [];
    const points2 = s2?.points || [];

    const byTs = new Map();
    for (const p of points) byTs.set(p.ts, { name: toMonthLabel(p.ts), sessions: p.value, signups: 0 });
    for (const p of points2) {
      const cur = byTs.get(p.ts) || { name: toMonthLabel(p.ts), sessions: 0, signups: 0 };
      cur.signups = p.value;
      byTs.set(p.ts, cur);
    }
    return Array.from(byTs.entries())
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
      .map(([, v]) => v);
  }, [trendResp]);

  const breakdown = useMemo(() => {
    // BreakdownChart expects: [{ name, value }]
    const series = breakdownResp?.series?.[0];
    const pts = series?.points || [];
    return pts.map((p) => ({ name: toMonthLabel(p.ts), value: p.value }));
  }, [breakdownResp]);

  if (error) {
    return (
      <section className="panel" style={{ padding: 14 }} aria-label="Overview error">
        <div className="panelTitle">Unable to load overview</div>
        <div className="panelSub" style={{ marginTop: 6 }}>
          {error}
        </div>
      </section>
    );
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <section className="grid gridKpi" aria-label="Key metrics">
        {kpiCards.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} delta={k.delta} icon={k.icon} />
        ))}
      </section>

      <section className="grid gridCharts" aria-label="Charts">
        <div className="panel chartCard">
          <div className="panelHeader">
            <div>
              <div className="panelTitle">Sessions & Signups</div>
              <div className="panelSub">Trend over time</div>
            </div>
            <span className="badge">Live</span>
          </div>
          <TrendChart data={trend} />
        </div>

        <div className="panel chartCardSecondary">
          <div className="panelHeader">
            <div>
              <div className="panelTitle">Acquisition mix</div>
              <div className="panelSub">Share by channel</div>
            </div>
            <span className="badge">Live</span>
          </div>
          <BreakdownChart data={breakdown} />
        </div>
      </section>
    </div>
  );
}
