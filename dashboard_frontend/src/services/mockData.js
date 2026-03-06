/**
 * Mock data for KPI cards, charts, and table.
 * This is used when backend endpoints are not available yet.
 */

// PUBLIC_INTERFACE
export function getMockKpis() {
  /** Returns KPI card data. */
  return [
    { key: "revenue", label: "Revenue", value: "$128,400", delta: +12.4, icon: "💳" },
    { key: "active", label: "Active Users", value: "8,214", delta: +4.1, icon: "👥" },
    { key: "conversion", label: "Conversion", value: "3.72%", delta: -0.6, icon: "✨" },
    { key: "uptime", label: "Uptime", value: "99.96%", delta: +0.02, icon: "🟢" },
  ];
}

// PUBLIC_INTERFACE
export function getMockTrend() {
  /** Returns timeseries trend data for a line/area chart. */
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.slice(0, 10).map((m, i) => ({
    name: m,
    sessions: Math.round(4200 + i * 220 + (i % 3) * 170),
    signups: Math.round(520 + i * 18 + (i % 4) * 15),
  }));
}

// PUBLIC_INTERFACE
export function getMockBreakdown() {
  /** Returns breakdown data for a bar chart. */
  return [
    { name: "Search", value: 44 },
    { name: "Direct", value: 28 },
    { name: "Referral", value: 18 },
    { name: "Social", value: 10 },
  ];
}

/**
 * @typedef {{ id: string, name: string, status: "healthy"|"warning"|"critical", owner: string, createdAt: string, score: number }} TableRow
 */

const STATUSES = ["healthy", "warning", "critical"];
const OWNERS = ["Ops", "Growth", "Core", "Analytics", "Platform"];

// PUBLIC_INTERFACE
export function getMockTableRows(count = 57) {
  /** Returns a list of rows for the data table. */
  const base = new Date("2026-01-05T00:00:00Z").getTime();

  /** @type {TableRow[]} */
  const rows = [];
  for (let i = 1; i <= count; i += 1) {
    const status = STATUSES[i % STATUSES.length];
    const createdAt = new Date(base + i * 86400000).toISOString().slice(0, 10);
    rows.push({
      id: `row_${i}`,
      name: `Dataset ${String(i).padStart(2, "0")}`,
      status,
      owner: OWNERS[i % OWNERS.length],
      createdAt,
      score: Math.round(60 + (i * 7) % 41),
    });
  }
  return rows;
}
