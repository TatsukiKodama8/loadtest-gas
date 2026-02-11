import { GcpConfig } from "../config/config";
import { PrometheusApi } from "./prometheusApi";
import { Logger } from "../utils/logger";

const file = "metricsService.ts";

export const MetricsService = (() => {
  function toPromDurationSeconds_(startJst: Date, endJst: Date): string {
    const sec = Math.max(1, Math.floor((endJst.getTime() - startJst.getTime()) / 1000));
    return `${sec}s`;
  }

  function fetchScalarMaxInRangeJst(p: { startJst: Date, endJst: Date, promql: string }): number | null {
    return Logger.trace(file, "fetchScalarMaxInRangeJst", { promql: p.promql }, () => {
      const projectId = GcpConfig.PROJECT_ID;

      const r = PrometheusApi.query({
        projectId,
        query: p.promql,
        time: p.endJst,
      });

      if (r.status !== 200) {
        throw new Error(
          `PromQL query failed: status=${r.status} body=${(r.text ?? "").slice(0, 500)}`
        );
      }

      const result0 = r.json?.data?.result?.[0];
      const vStr = result0?.value?.[1];
      if (vStr == null) return null;

      const v = Number(vStr);
      return Number.isFinite(v) ? v : null;
    });
  }

  return Object.freeze({
    toPromDurationSeconds_,
    fetchScalarMaxInRangeJst,
  });
})();
