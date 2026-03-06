import { apiClient } from "./apiClient";

/**
 * Dashboard data integration for backend.
 *
 * Backend contract:
 * - GET /dashboard/kpis -> { items: KPIItem[] }
 * - GET /dashboard/charts/{chart_id}?days=N -> ChartResponse
 * - GET /dashboard/table?page=&page_size=&sort_by=&sort_dir=&search_field=&search_contains= -> TableResponse
 */

// PUBLIC_INTERFACE
export async function fetchKpis() {
  /** Fetch KPI items for the overview page.
   * @returns {Promise<{items: Array<{id: string, label: string, value: number, unit: string, delta: number, trend: "up"|"down"|"flat"}>}>}
   */
  return apiClient.get("/dashboard/kpis");
}

// PUBLIC_INTERFACE
export async function fetchChart(chartId, { days = 14 } = {}) {
  /** Fetch chart series for a given chart id.
   * @param {string} chartId
   * @param {{days?: number}} opts
   * @returns {Promise<{chart_id: string, series: Array<{id: string, label: string, points: Array<{ts: string, value: number}>}>, meta: Record<string, any>}>}
   */
  return apiClient.get(`/dashboard/charts/${encodeURIComponent(chartId)}`, { days });
}

// PUBLIC_INTERFACE
export async function fetchTable(params) {
  /** Fetch paginated table rows.
   * @param {{page: number, pageSize: number, sortBy?: string, sortDir?: "asc"|"desc", searchField?: string, searchContains?: string}} params
   * @returns {Promise<{rows: Array<{id: string, data: Record<string, any>}>, meta: {page:number, page_size:number, total_items:number, total_pages:number}}>}
   */
  const query = {
    page: params.page,
    page_size: params.pageSize,
    sort_by: params.sortBy,
    sort_dir: params.sortDir,
    search_field: params.searchField,
    search_contains: params.searchContains,
  };
  return apiClient.get("/dashboard/table", query);
}
