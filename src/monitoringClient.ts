export const MonitoringClient = (() => {
  function getAccessToken_(): string {
    return ScriptApp.getOAuthToken();
  }

  function fetchJson(url: string, opts: { userProjectId: string, method?: string, headers?: any, muteHttpExceptions?: boolean }) {
    const method = (opts.method ?? "get") as GoogleAppsScript.URL_Fetch.HttpMethod;
    const muteHttpExceptions = opts.muteHttpExceptions ?? true;

    const headers = Object.assign({}, opts.headers ?? {}, {
      Authorization: `Bearer ${getAccessToken_()}`,
      "X-Goog-User-Project": opts.userProjectId,
    });

    const res = UrlFetchApp.fetch(url, { method, headers, muteHttpExceptions });

    const status = res.getResponseCode();
    const text = res.getContentText();
    const resHeaders = res.getAllHeaders();

    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      // ignore
    }

    return { status, json, text, headers: resHeaders };
  }

  return Object.freeze({ fetchJson });
})();