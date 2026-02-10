import { MonitoringClient } from "./monitoringClient";
import { Logger } from "./logger";

const file = "prometheusApi.ts";

export const PrometheusApi = (() => {
  function query(p: { projectId: string, query: string, time: Date }) {
    return Logger.trace(file, "query", { query: p.query }, () => {
      const base =
        `https://monitoring.googleapis.com/v1/projects/${encodeURIComponent(p.projectId)}` +
        `/location/global/prometheus/api/v1/query`;

      const url =
        base +
        `?query=${encodeURIComponent(p.query)}` +
        `&time=${encodeURIComponent(p.time.toISOString())}`;

      const r = MonitoringClient.fetchJson(url, { userProjectId: p.projectId });
      return { status: r.status, json: r.json, text: r.text };
    });
  }

  return Object.freeze({ query });
})();
