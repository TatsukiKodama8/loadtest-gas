import { SheetConfig } from "./config/config";
import {
  Targets,
  Metrics,
  OutputColumns,
  TargetKey,
  MetricKey,
} from "./config/definitions";
import { MetricsService } from "./core/metricsService";
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
    const datePart = sheet.getRange(row, SheetConfig.COL_DATE).getValue();
    const startPart = sheet.getRange(row, SheetConfig.COL_START_TIME).getValue();
    const endPart = sheet.getRange(row, SheetConfig.COL_END_TIME).getValue();

    const startJst = combineDateAndTime_(datePart, startPart);
    const endJst = combineDateAndTime_(datePart, endPart);

    if (startJst == null || endJst == null || endJst <= startJst) {
      Logger.info("Invalid time range, skipping row", {
        file,
        func: "updateRow_",
        row,
        startJst,
        endJst,
      });
      clearOutputs_(sheet, row);
      return;
    }

    const range = MetricsService.toPromDurationSeconds_(
      startJst,
      endJst
    );

    for (const [targetKey, labels] of Object.entries(Targets)) {
      const outByMetric = OutputColumns[targetKey as TargetKey];
      if (!outByMetric) continue;

      for (const [metricKey, m] of Object.entries(Metrics)) {
        const col = outByMetric[metricKey as MetricKey];
        if (!col) continue;

        const promql = m.queryBuilder(labels, range);

        try {
          const v = MetricsService.fetchScalarMaxInRangeJst({
            startJst,
            endJst,
            promql,
          });

          sheet.getRange(row, col).setValue(v == null ? "" : v);
        } catch (e) {
          Logger.error("Failed to fetch metric", e, {
            file,
            func: "updateRow_",
            row,
            target: targetKey,
            metric: metricKey,
          });
          sheet.getRange(row, col).setValue("");
        }
      }
    }
  });
}

function clearOutputs_(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number) {
  for (const [targetKey, outByMetric] of Object.entries(OutputColumns)) {
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