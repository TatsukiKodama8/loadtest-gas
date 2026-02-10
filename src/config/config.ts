import { col_ } from "../utils/utils";

export const SheetConfig = Object.freeze({
  SHEET_NAME: "test",
  HEADER_ROWS: 2,

  // 日付、テスト開始時刻、終了時刻
  COL_DATE: col_("H"),
  COL_START_TIME: col_("I"),
  COL_END_TIME: col_("K"),
});

export const GcpConfig = Object.freeze({
  PROJECT_ID: "shinise-dev",
  LOCATION: "asia-northeast1",
});
