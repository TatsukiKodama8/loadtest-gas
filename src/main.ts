import { SheetConfig, GcpConfig } from "./config/config";
import {
  Targets,
  Metrics,
  OutputColumns,
  TargetKey,
  MetricKey,
  MetricDefinition,
  TargetLabels,
} from "./config/definitions";
import { MetricsService } from "./core/metricsService";
import { LoggingClient } from "./core/loggingClient";
import { Logger } from "./utils/logger";

const file = "main.ts";

/**
 * Global entry point for GAS
 */
export function main() {
  Logger.trace(file, "main", {}, () => {
    runUpdateAllRows();
  });
}

function runUpdateAllRows() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Active spreadsheet is null.");

  const sheet = ss.getSheetByName(SheetConfig.SHEET_NAME);
  if (!sheet) {
    const names = ss
      .getSheets()
      .map((s) => s.getName())
      .join(", ");
    throw new Error(
      `Sheet not found: "${SheetConfig.SHEET_NAME}". Available: [${names}]`
    );
  }

  const lastRow = sheet.getLastRow();
  Logger.info("Starting batch update", {
    file,
    func: "runUpdateAllRows",
    lastRow,
  });

  for (let row = SheetConfig.HEADER_ROWS + 1; row <= lastRow; row++) {
    updateRow_(sheet, row);
  }
}

function updateRow_(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number) {
  Logger.trace(file, "updateRow_", { row }, () => {
    const timeRange = getTimeRangeFromRow_(sheet, row);

    if (!timeRange) {
      Logger.info("Invalid time range, skipping row", {
        file,
        func: "updateRow_",
        row,
      });
      clearOutputs_(sheet, row);
      return;
    }

    const { startJst, endJst } = timeRange;
    const range = MetricsService.toPromDurationSeconds_(startJst, endJst);
    const startIso = startJst.toISOString();
    const endIso = endJst.toISOString();

    for (const [targetKey, labels] of Object.entries(Targets)) {
      updateTargetMetrics_(
        sheet,
        row,
        targetKey as TargetKey,
        labels,
        startJst,
        endJst,
        range,
        startIso,
        endIso
      );
    }
  });
}

function getTimeRangeFromRow_(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
): { startJst: Date; endJst: Date } | null {
  const datePart = sheet.getRange(row, SheetConfig.COL_DATE).getValue();
  const startPart = sheet.getRange(row, SheetConfig.COL_START_TIME).getValue();
  const endPart = sheet.getRange(row, SheetConfig.COL_END_TIME).getValue();

  const startJst = combineDateAndTime_(datePart, startPart);
  const endJst = combineDateAndTime_(datePart, endPart);

  if (startJst == null || endJst == null || endJst <= startJst) {
    return null;
  }

  return { startJst, endJst };
}

function updateTargetMetrics_(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  targetKey: TargetKey,
  labels: TargetLabels,
  startJst: Date,
  endJst: Date,
  range: string,
  startIso: string,
  endIso: string
) {
  const outByMetric = OutputColumns[targetKey];
  if (!outByMetric) return;

  for (const [metricKey, m] of Object.entries(Metrics)) {
    const col = outByMetric[metricKey as MetricKey];
    if (!col) continue;

    fetchAndWriteMetric_(
      sheet,
      row,
      col,
      m,
      labels,
      startJst,
      endJst,
      range,
      startIso,
      endIso,
      targetKey,
      metricKey as MetricKey
    );
  }
}

function fetchAndWriteMetric_(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  metric: MetricDefinition,
  labels: TargetLabels,
  startJst: Date,
  endJst: Date,
  range: string,
  startIso: string,
  endIso: string,
  targetKey: string,
  metricKey: string
) {
  const query = metric.queryBuilder(labels, { range, startIso, endIso });

  try {
    let v: number | null = null;

    if (metric.type === "prometheus") {
      v = MetricsService.fetchScalarMaxInRangeJst({
        startJst,
        endJst,
        promql: query,
      });
    } else if (metric.type === "logging") {
      v = LoggingClient.fetchAndAggregate(
        GcpConfig.PROJECT_ID,
        query,
        metric.aggregator!
      );
    }

    sheet.getRange(row, col).setValue(v == null ? "" : v);
  } catch (e) {
    Logger.error("Failed to fetch metric", e, {
      file,
      func: "fetchAndWriteMetric_",
      row,
      target: targetKey,
      metric: metricKey,
      type: metric.type,
    });
    sheet.getRange(row, col).setValue("");
  }
}

function clearOutputs_(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number) {
  for (const outByMetric of Object.values(OutputColumns)) {
    if (!outByMetric) continue;

    for (const col of Object.values(outByMetric)) {
      if (!col) continue;
      sheet.getRange(row, col).setValue("");
    }
  }
}

export function combineDateAndTime_(datePart: any, timePart: any): Date | null {
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
