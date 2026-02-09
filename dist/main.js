"use strict";
function main() {
    runUpdateAllRows();
}
function runUpdateAllRows() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss)
        throw new Error("Active spreadsheet is null.");
    const sheet = ss.getSheetByName(SheetConfig.SHEET_NAME);
    if (!sheet) {
        const names = ss.getSheets().map(s => s.getName()).join(", ");
        throw new Error(`Sheet not found: "${SheetConfig.SHEET_NAME}". Available: [${names}]`);
    }
    const lastRow = sheet.getLastRow();
    for (let row = SheetConfig.HEADER_ROWS + 1; row <= lastRow; row++) {
        updateRow_(sheet, row);
    }
}
function updateRow_(sheet, row) {
    const datePart = sheet.getRange(row, SheetConfig.COL_DATE).getValue();
    const startPart = sheet.getRange(row, SheetConfig.COL_START_TIME).getValue();
    const endPart = sheet.getRange(row, SheetConfig.COL_END_TIME).getValue();
    const startJst = combineDateAndTime_(datePart, startPart);
    const endJst = combineDateAndTime_(datePart, endPart);
    if (startJst == null || endJst == null || endJst <= startJst) {
        Logger.log(`[main.gs] Invalid time range at row=${row} start=${startJst} end=${endJst}`);
        clearOutputs_(sheet, row);
        return;
    }
    const range = MetricsService.toPromDurationSeconds_(startJst, endJst);
    for (const t of Targets) {
        const outByMetric = OutputColumns[t.key];
        if (!outByMetric) {
            Logger.log(`[main.gs] OutputColumns missing targetKey=${t.key}`);
            continue;
        }
        for (const m of Metrics) {
            const col = outByMetric[m.key];
            if (!col) {
                Logger.log(`[main.gs] OutputColumns missing mapping target=${t.key} metric=${m.key}`);
                continue;
            }
            const promql = m.queryBuilder(t, range);
            Logger.log(`[main.gs/updateRow_] labelsRaw=${JSON.stringify(t.labels)}`);
            Logger.log(`[main.gs/updateRow_] selectorParts=${promql.match(/\{.*\}/)?.[0] ?? "(no selector)"}`);
            Logger.log(`
        [main.gs/updateRow_]
        targetKey: ${t.key}
        metricKey: ${m.key}
        col: ${col}
        promql: ${promql}
      `);
            try {
                const v = MetricsService.fetchScalarMaxInRangeJst({
                    startJst,
                    endJst,
                    promql,
                });
                sheet.getRange(row, col).setValue(v == null ? "" : v);
            }
            catch (e) {
                Logger.log(`[main.gs] row=${row} target=${t.key} metric=${m.key} error=${e}`);
                sheet.getRange(row, col).setValue("");
            }
        }
    }
}
/**
 * 出力列（Targets × Metrics）を空にする
 */
function clearOutputs_(sheet, row) {
    for (const t of Targets) {
        const outByMetric = OutputColumns[t.key];
        if (!outByMetric)
            continue;
        for (const m of Metrics) {
            const col = outByMetric[m.key];
            if (!col)
                continue;
            sheet.getRange(row, col).setValue("");
        }
    }
}
/**
 * 日付セル(Date) と 時刻セル(Date) を合成して JST の Date を作る
 */
function combineDateAndTime_(datePart, timePart) {
    if (!(datePart instanceof Date) || isNaN(datePart.getTime()))
        return null;
    if (!(timePart instanceof Date) || isNaN(timePart.getTime()))
        return null;
    return new Date(datePart.getFullYear(), datePart.getMonth(), datePart.getDate(), timePart.getHours(), timePart.getMinutes(), timePart.getSeconds(), 0);
}
