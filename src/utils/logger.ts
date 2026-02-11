/**
 * logger.ts
 * 構造化ログ（Structured Logging）を提供するユーティリティ
 */

export const Logger = (() => {
  /**
   * ログの基本構造
   */
  interface LogContext {
    file: string;
    func: string;
    args?: Record<string, any>;
    [key: string]: any;
  }

  /**
   * INFOレベルのログを出力
   */
  function info(message: string, context: LogContext) {
    const payload = {
      severity: "INFO",
      message,
      timestamp: new Date().toISOString(),
      ...context,
    };
    console.log(JSON.stringify(payload));
  }

  /**
   * ERRORレベルのログを出力
   */
  function error(message: string, err: any, context: LogContext) {
    const payload = {
      severity: "ERROR",
      message,
      exception: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      ...context,
    };
    console.error(JSON.stringify(payload));
  }

  /**
   * 関数の実行をラップし、開始・終了・実行時間を自動で記録する
   */
  function trace<T>(
    file: string,
    func: string,
    args: Record<string, any>,
    execute: () => T
  ): T {
    const start = Date.now();
    info(`[START] ${func}`, { file, func, args });

    try {
      const result = execute();
      const duration = Date.now() - start;
      info(`[END] ${func}`, { file, func, duration: `${duration}ms` });
      return result;
    } catch (e) {
      const duration = Date.now() - start;
      error(`[FAILED] ${func}`, e, { file, func, duration: `${duration}ms`, args });
      throw e;
    }
  }

  return Object.freeze({
    info,
    error,
    trace,
  });
})();
