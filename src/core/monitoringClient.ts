import { Logger } from "../utils/logger";

const file = "monitoringClient.ts";

export const MonitoringClient = (() => {
  function getAccessToken_(): string {
    return ScriptApp.getOAuthToken();
  }

  function fetchJson(
    url: string,
    opts: {
      userProjectId: string;
      method?: string;
      headers?: any;
      payload?: string;
      muteHttpExceptions?: boolean;
    }
  ) {
    const method = (opts.method ?? "get") as GoogleAppsScript.URL_Fetch.HttpMethod;
    const muteHttpExceptions = opts.muteHttpExceptions ?? true;

    const headers = Object.assign({}, opts.headers ?? {}, {
      Authorization: `Bearer ${getAccessToken_()}`,
      "X-Goog-User-Project": opts.userProjectId,
    });

    Logger.info("Fetch URL", { file, func: "fetchJson", url, method });

    const fetchOpts: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method,
      headers,
      muteHttpExceptions,
    };

    if (opts.payload) {
      fetchOpts.payload = opts.payload;
    }

    const res = UrlFetchApp.fetch(url, fetchOpts);

    const status = res.getResponseCode();
    const text = res.getContentText();
    const resHeaders = res.getAllHeaders();

    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      // ignore
    }

    if (status >= 400) {
      Logger.error("Fetch failed", text, {
        file,
        func: "fetchJson",
        status,
        url,
      });
    }

    return { status, json, text, headers: resHeaders };
  }

  return Object.freeze({ fetchJson });
})();