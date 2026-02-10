"use strict";
var GAS_ENTRY = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/main.ts
  var main_exports = {};
  __export(main_exports, {
    combineDateAndTime_: () => combineDateAndTime_,
    main: () => main
  });

  // src/logger.ts
  var Logger = (() => {
    function info(message, context) {
      const payload = {
        severity: "INFO",
        message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        ...context
      };
      console.log(JSON.stringify(payload));
    }
    function error(message, err, context) {
      const payload = {
        severity: "ERROR",
        message,
        exception: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : void 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        ...context
      };
      console.error(JSON.stringify(payload));
    }
    function trace(file6, func, args, execute) {
      const start = Date.now();
      info(`[START] ${func}`, { file: file6, func, args });
      try {
        const result = execute();
        const duration = Date.now() - start;
        info(`[END] ${func}`, { file: file6, func, duration: `${duration}ms` });
        return result;
      } catch (e) {
        const duration = Date.now() - start;
        error(`[FAILED] ${func}`, e, { file: file6, func, duration: `${duration}ms`, args });
        throw e;
      }
    }
    return Object.freeze({
      info,
      error,
      trace
    });
  })();

  // src/selector.ts
  var file = "selector.ts";
  var Selector = (() => {
    function buildSelector(metricName, labels) {
      return Logger.trace(file, "buildSelector", { metricName, labels }, () => {
        const allowedKeys = /* @__PURE__ */ new Set([
          "__name__",
          "monitored_resource",
          "location",
          "cluster",
          "namespace_name",
          "pod_name",
          "container_name"
        ]);
        const merged = { __name__: metricName, ...labels ?? {} };
        const parts = Object.entries(merged).filter(([, v]) => v !== null && v !== void 0 && v !== "").filter(([k]) => allowedKeys.has(k)).map(([k, v]) => `"${k}"="${String(v).replaceAll('"', '"')}"`);
        return `{${parts.join(",")}}`;
      });
    }
    return Object.freeze({ buildSelector });
  })();

  // src/const.ts
  function col_(a1) {
    let n = 0;
    for (const ch of a1.toUpperCase()) {
      n = n * 26 + (ch.charCodeAt(0) - 64);
    }
    return n;
  }
  var SheetConfig = Object.freeze({
    SHEET_NAME: "test",
    HEADER_ROWS: 2,
    COL_DATE: col_("H"),
    COL_START_TIME: col_("I"),
    COL_END_TIME: col_("J")
  });
  var GcpConfig = Object.freeze({
    PROJECT_ID: "shinise-dev",
    LOCATION: "asia-northeast1"
  });
  var Targets = Object.freeze([
    {
      key: "stock-conversion",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "stock-conversion-service-app"
      }
    },
    {
      key: "new-stock",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "new-stock-service-app"
      }
    },
    {
      key: "rabbitmq",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "rabbitmq"
      }
    },
    {
      key: "db-process",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-process-rec-app"
      }
    },
    {
      key: "db-business1",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business1-rec-app"
      }
    },
    {
      key: "db-business2",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business2-rec-app"
      }
    },
    {
      key: "db-business3",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business3-rec-app"
      }
    },
    {
      key: "db-business4",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business4-rec-app"
      }
    },
    {
      key: "db-business5",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business5-rec-app"
      }
    },
    {
      key: "db-business6",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business6-rec-app"
      }
    },
    {
      key: "db-business7",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business7-rec-app"
      }
    },
    {
      key: "db-business8",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business8-rec-app"
      }
    },
    {
      key: "db-business9",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business9-rec-app"
      }
    },
    {
      key: "db-business10",
      labels: {
        monitored_resource: "k8s_container",
        location: "asia-northeast1",
        container_name: "db-business10-rec-app"
      }
    }
  ]);
  var Metrics = Object.freeze([
    {
      key: "cpu-limit-util-max",
      queryBuilder: (t, range) => {
        const sel = Selector.buildSelector(
          "kubernetes.io/container/cpu/limit_utilization",
          t.labels
        );
        return `max_over_time(${sel}[${range}])`;
      }
    },
    {
      key: "mem-limit-util-max",
      queryBuilder: (t, range) => {
        const sel = Selector.buildSelector(
          "kubernetes.io/container/memory/limit_utilization",
          t.labels
        );
        return `max_over_time(${sel}[${range}])`;
      }
    }
  ]);
  var OutputColumns = Object.freeze({
    "stock-conversion": {
      "cpu-limit-util-max": col_("Y"),
      "mem-limit-util-max": col_("Z")
    },
    "new-stock": {
      "cpu-limit-util-max": col_("AA"),
      "mem-limit-util-max": col_("AB")
    },
    "rabbitmq": {
      "cpu-limit-util-max": col_("AC"),
      "mem-limit-util-max": col_("AD")
    },
    "db-process": {
      "cpu-limit-util-max": col_("AE"),
      "mem-limit-util-max": col_("AF")
    },
    "db-business1": {
      "cpu-limit-util-max": col_("AG"),
      "mem-limit-util-max": col_("AH")
    },
    "db-business2": {
      "cpu-limit-util-max": col_("AI"),
      "mem-limit-util-max": col_("AJ")
    },
    "db-business3": {
      "cpu-limit-util-max": col_("AK"),
      "mem-limit-util-max": col_("AL")
    },
    "db-business4": {
      "cpu-limit-util-max": col_("AM"),
      "mem-limit-util-max": col_("AN")
    },
    "db-business5": {
      "cpu-limit-util-max": col_("AO"),
      "mem-limit-util-max": col_("AP")
    },
    "db-business6": {
      "cpu-limit-util-max": col_("AQ"),
      "mem-limit-util-max": col_("AR")
    },
    "db-business7": {
      "cpu-limit-util-max": col_("AS"),
      "mem-limit-util-max": col_("AT")
    },
    "db-business8": {
      "cpu-limit-util-max": col_("AU"),
      "mem-limit-util-max": col_("AV")
    },
    "db-business9": {
      "cpu-limit-util-max": col_("AW"),
      "mem-limit-util-max": col_("AX")
    },
    "db-business10": {
      "cpu-limit-util-max": col_("AY"),
      "mem-limit-util-max": col_("AZ")
    }
  });

  // src/monitoringClient.ts
  var file2 = "monitoringClient.ts";
  var MonitoringClient = (() => {
    function getAccessToken_() {
      return ScriptApp.getOAuthToken();
    }
    function fetchJson(url, opts) {
      const method = opts.method ?? "get";
      const muteHttpExceptions = opts.muteHttpExceptions ?? true;
      const headers = Object.assign({}, opts.headers ?? {}, {
        Authorization: `Bearer ${getAccessToken_()}`,
        "X-Goog-User-Project": opts.userProjectId
      });
      Logger.info("Fetch URL", { file: file2, func: "fetchJson", url, method });
      const res = UrlFetchApp.fetch(url, { method, headers, muteHttpExceptions });
      const status = res.getResponseCode();
      const text = res.getContentText();
      const resHeaders = res.getAllHeaders();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
      }
      if (status >= 400) {
        Logger.error("Fetch failed", text, { file: file2, func: "fetchJson", status, url });
      }
      return { status, json, text, headers: resHeaders };
    }
    return Object.freeze({ fetchJson });
  })();

  // src/prometheusApi.ts
  var file3 = "prometheusApi.ts";
  var PrometheusApi = (() => {
    function query(p) {
      return Logger.trace(file3, "query", { query: p.query }, () => {
        const base = `https://monitoring.googleapis.com/v1/projects/${encodeURIComponent(p.projectId)}/location/global/prometheus/api/v1/query`;
        const url = base + `?query=${encodeURIComponent(p.query)}&time=${encodeURIComponent(p.time.toISOString())}`;
        const r = MonitoringClient.fetchJson(url, { userProjectId: p.projectId });
        return { status: r.status, json: r.json, text: r.text };
      });
    }
    return Object.freeze({ query });
  })();

  // src/metricsService.ts
  var file4 = "metricsService.ts";
  var MetricsService = (() => {
    function toPromDurationSeconds_(startJst, endJst) {
      const sec = Math.max(1, Math.floor((endJst.getTime() - startJst.getTime()) / 1e3));
      return `${sec}s`;
    }
    function fetchScalarMaxInRangeJst(p) {
      return Logger.trace(file4, "fetchScalarMaxInRangeJst", { promql: p.promql }, () => {
        const projectId = GcpConfig.PROJECT_ID;
        const r = PrometheusApi.query({
          projectId,
          query: p.promql,
          time: p.endJst
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
      fetchScalarMaxInRangeJst
    });
  })();

  // src/main.ts
  var file5 = "main.ts";
  function main() {
    Logger.trace(file5, "main", {}, () => {
      runUpdateAllRows();
    });
  }
  function runUpdateAllRows() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error("Active spreadsheet is null.");
    const sheet = ss.getSheetByName(SheetConfig.SHEET_NAME);
    if (!sheet) {
      const names = ss.getSheets().map((s) => s.getName()).join(", ");
      throw new Error(`Sheet not found: "${SheetConfig.SHEET_NAME}". Available: [${names}]`);
    }
    const lastRow = sheet.getLastRow();
    Logger.info("Starting batch update", { file: file5, func: "runUpdateAllRows", lastRow });
    for (let row = SheetConfig.HEADER_ROWS + 1; row <= lastRow; row++) {
      updateRow_(sheet, row);
    }
  }
  function updateRow_(sheet, row) {
    Logger.trace(file5, "updateRow_", { row }, () => {
      const datePart = sheet.getRange(row, SheetConfig.COL_DATE).getValue();
      const startPart = sheet.getRange(row, SheetConfig.COL_START_TIME).getValue();
      const endPart = sheet.getRange(row, SheetConfig.COL_END_TIME).getValue();
      const startJst = combineDateAndTime_(datePart, startPart);
      const endJst = combineDateAndTime_(datePart, endPart);
      if (startJst == null || endJst == null || endJst <= startJst) {
        Logger.info("Invalid time range, skipping row", {
          file: file5,
          func: "updateRow_",
          row,
          startJst,
          endJst
        });
        clearOutputs_(sheet, row);
        return;
      }
      const range = MetricsService.toPromDurationSeconds_(startJst, endJst);
      for (const t of Targets) {
        const outByMetric = OutputColumns[t.key];
        if (!outByMetric) continue;
        for (const m of Metrics) {
          const col = outByMetric[m.key];
          if (!col) continue;
          const promql = m.queryBuilder(t, range);
          try {
            const v = MetricsService.fetchScalarMaxInRangeJst({
              startJst,
              endJst,
              promql
            });
            sheet.getRange(row, col).setValue(v == null ? "" : v);
          } catch (e) {
            Logger.error("Failed to fetch metric", e, {
              file: file5,
              func: "updateRow_",
              row,
              target: t.key,
              metric: m.key
            });
            sheet.getRange(row, col).setValue("");
          }
        }
      }
    });
  }
  function clearOutputs_(sheet, row) {
    for (const t of Targets) {
      const outByMetric = OutputColumns[t.key];
      if (!outByMetric) continue;
      for (const m of Metrics) {
        const col = outByMetric[m.key];
        if (!col) continue;
        sheet.getRange(row, col).setValue("");
      }
    }
  }
  function combineDateAndTime_(datePart, timePart) {
    if (!(datePart instanceof Date) || isNaN(datePart.getTime())) return null;
    if (!(timePart instanceof Date) || isNaN(timePart.getTime())) return null;
    return new Date(
      datePart.getFullYear(),
      datePart.getMonth(),
      datePart.getDate(),
      timePart.getHours(),
      timePart.getMinutes(),
      timePart.getSeconds(),
      0
    );
  }
  return __toCommonJS(main_exports);
})();
function main() { GAS_ENTRY.main(); }
