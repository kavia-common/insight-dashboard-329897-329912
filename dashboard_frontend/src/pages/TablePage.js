import React, { useEffect, useMemo, useState } from "react";
import { fetchTable } from "../services/dashboardService";

/**
 * Backend table row shape:
 *  { id: string, data: Record<string, any> }
 *
 * This UI expects columns: name, status, owner, createdAt, score.
 */

function getCell(row, key, fallback = "—") {
  const v = row?.data?.[key];
  return v === undefined || v === null || v === "" ? fallback : v;
}

export default function TablePage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState("score");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [resp, setResp] = useState(null);
  const [error, setError] = useState(null);

  const total = resp?.meta?.total_items ?? 0;
  const totalPages = resp?.meta?.total_pages ?? 1;
  const safePage = Math.min(page, totalPages);

  const rows = useMemo(() => resp?.rows || [], [resp]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setError(null);
      try {
        const searchField = status !== "all" ? "status" : query ? "name" : undefined;
        const searchContains = status !== "all" ? status : query || undefined;

        const data = await fetchTable({
          page,
          pageSize,
          sortBy: sortKey,
          sortDir,
          searchField,
          searchContains,
        });

        if (!mounted) return;
        setResp(data);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load table.");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [page, pageSize, sortKey, sortDir, query, status]);

  function toggleSort(nextKey) {
    setPage(1);
    if (sortKey !== nextKey) {
      setSortKey(nextKey);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  return (
    <section className="panel" aria-label="Data table">
      <div className="panelHeader">
        <div>
          <div className="panelTitle">Datasets</div>
          <div className="panelSub">Filter, sort, and paginate</div>
        </div>
        <span className="badge">{total} rows</span>
      </div>

      <div className="tableTools">
        <div className="tableToolsLeft">
          <input
            className="input"
            style={{ width: 260 }}
            placeholder="Search by name…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label="Search rows"
          />

          <select
            className="select"
            style={{ width: 180 }}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          <span className="badge">
            Sort: <strong>{sortKey}</strong> <span className="sortHint">({sortDir})</span>
          </span>
        </div>

        <div className="tableToolsLeft">
          <select
            className="select"
            style={{ width: 160 }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Rows per page"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {error ? (
        <div style={{ padding: 12 }}>
          <span
            className="badge"
            style={{ borderColor: "rgba(239,68,68,0.35)", color: "var(--danger-500)" }}
          >
            {error}
          </span>
        </div>
      ) : null}

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th className="th">
                <button className="sortBtn" onClick={() => toggleSort("name")}>
                  Name <span className="sortHint">↕</span>
                </button>
              </th>
              <th className="th">
                <button className="sortBtn" onClick={() => toggleSort("status")}>
                  Status <span className="sortHint">↕</span>
                </button>
              </th>
              <th className="th">
                <button className="sortBtn" onClick={() => toggleSort("owner")}>
                  Owner <span className="sortHint">↕</span>
                </button>
              </th>
              <th className="th">
                <button className="sortBtn" onClick={() => toggleSort("createdAt")}>
                  Created <span className="sortHint">↕</span>
                </button>
              </th>
              <th className="th">
                <button className="sortBtn" onClick={() => toggleSort("score")}>
                  Score <span className="sortHint">↕</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="td">{getCell(r, "name")}</td>
                <td className="td">
                  <span className="badge">
                    {getCell(r, "status") === "healthy"
                      ? "🟢"
                      : getCell(r, "status") === "warning"
                        ? "🟡"
                        : getCell(r, "status") === "critical"
                          ? "🔴"
                          : "•"}{" "}
                    {getCell(r, "status")}
                  </span>
                </td>
                <td className="td">{getCell(r, "owner")}</td>
                <td className="td">{getCell(r, "createdAt")}</td>
                <td className="td">{getCell(r, "score")}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="td" colSpan={5}>
                  <span className="small">No results. Try adjusting filters.</span>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="tableFooter">
        <div className="small">
          Showing <strong>{rows.length}</strong> of <strong>{total}</strong>
        </div>
        <div className="pagination" aria-label="Pagination">
          <button className="btn btnGhost" onClick={() => setPage(1)} disabled={safePage === 1}>
            First
          </button>
          <button
            className="btn btnGhost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            Prev
          </button>
          <span className="badge">
            Page <strong>{safePage}</strong> / {Math.max(1, totalPages)}
          </span>
          <button
            className="btn btnGhost"
            onClick={() => setPage((p) => Math.min(Math.max(1, totalPages), p + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </button>
          <button
            className="btn btnGhost"
            onClick={() => setPage(Math.max(1, totalPages))}
            disabled={safePage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </section>
  );
}
