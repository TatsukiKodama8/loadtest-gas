"use strict";
/**
 * prometheusApi.gs
 * Responsibility: Managed Prometheus (Cloud Monitoring PromQL API) を叩く
 */
const PrometheusApi = (() => {
    /**
     * @param {{ projectId: string, query: string, time: Date }} p
     */
    function query(p) {
        const base = `https://monitoring.googleapis.com/v1/projects/${encodeURIComponent(p.projectId)}` +
            `/location/global/prometheus/api/v1/query`;
        const url = base +
            `?query=${encodeURIComponent(p.query)}` +
            `&time=${encodeURIComponent(p.time.toISOString())}`;
        const r = MonitoringClient.fetchJson(url, { userProjectId: p.projectId });
        return { status: r.status, json: r.json, text: r.text };
    }
    return Object.freeze({ query });
})();
