import React, { useMemo, useState } from "react";
import { getMockTableRows } from "../services/mockData";

/**
 * @typedef {{ id: string, name: string, status: "healthy"|"warning"|"critical", owner: string, createdAt: string, score: number }} TableRow
 */

function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** @param {TableRow[]} rows */
function filterRows(rows, query, status) {
  const q = (query || "").trim().toLowerCase();
  return rows.filter((r) => {
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.owner.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q);

    const matchesStatus = status === "all" ? true : r.status === status;
    return matchesQuery && matchesStatus;
  });
}

/** @param {TableRow[]} rows */
function sortRows(rows, sortKey, sortDir) {
  const dir = sortDir === "desc" ? -1 : 1;
  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    return compare(av, bv) * dir;
  });
  return sorted;
}

export default function TablePage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState("score");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const allRows = useMemo(() => getMockTableRows(57), []);

  const filtered = useMemo(() => filterRows(allRows, query, status), [allRows, query, status]);
  const sorted = useMemo(() => sortRows(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

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
          <div className="panelSub">Filter, sort, and paginate (mock)</div>
        </div>
        <span className="badge">{total} rows</span>
      </div>

      <div className="tableTools">
        <div className="tableToolsLeft">
          <input
            className="input"
            style={{ width: 260 }}
            placeholder="Search by name, owner, id…"
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
            {pageRows.map((r) => (
              <tr key={r.id}>
                <td className="td">{r.name}</td>
                <td className="td">
                  <span className="badge">
                    {r.status === "healthy" ? "🟢" : r.status === "warning" ? "🟡" : "🔴"} {r.status}
                  </span>
                </td>
                <td className="td">{r.owner}</td>
                <td className="td">{r.createdAt}</td>
                <td className="td">{r.score}</td>
              </tr>
            ))}
            {pageRows.length === 0 ? (
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
          Showing <strong>{pageRows.length}</strong> of <strong>{total}</strong>
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
            Page <strong>{safePage}</strong> / {totalPages}
          </span>
          <button
            className="btn btnGhost"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </button>
          <button
            className="btn btnGhost"
            onClick={() => setPage(totalPages)}
            disabled={safePage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </section>
  );
}
