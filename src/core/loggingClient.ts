import { MonitoringClient } from "./monitoringClient";
import { Logger } from "../utils/logger";

const file = "loggingClient.ts";

export const LoggingClient = (() => {
  /**
   * Fetches logs from Cloud Logging and returns a processed number.
   * @param projectId GCP Project ID
   * @param filter Cloud Logging filter string
   * @param aggregator A function that takes log payloads and returns a number
   */
  function fetchAndAggregate(
    projectId: string,
    filter: string,
    aggregator: (payloads: string[]) => number
  ): number {
    return Logger.trace(file, "fetchAndAggregate", { filter }, () => {
      const url = "https://logging.googleapis.com/v2/entries:list";
      const allPayloads: string[] = [];
      let pageToken: string | null = null;

      do {
        const body = {
          resourceNames: [`projects/${projectId}`],
          filter: filter,
          pageSize: 1000,
          pageToken: pageToken,
        };

        const res = MonitoringClient.fetchJson(url, {
          userProjectId: projectId,
          method: "post",
          headers: { "Content-Type": "application/json" },
          payload: JSON.stringify(body),
        });

        if (res.status !== 200) {
          throw new Error(`Logging API failed: ${res.status} ${res.text}`);
        }

        const entries = res.json?.entries || [];
        for (const entry of entries) {
          if (entry.textPayload) {
            allPayloads.push(entry.textPayload);
          } else if (entry.jsonPayload) {
            allPayloads.push(JSON.stringify(entry.jsonPayload));
          }
        }

        pageToken = res.json?.nextPageToken || null;
      } while (pageToken);

      return aggregator(allPayloads);
    });
  }

  return Object.freeze({ fetchAndAggregate });
})();