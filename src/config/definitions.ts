import { Selector, Labels } from "../core/selector";
import { col_ } from "../utils/utils";

/**
 * Labels for a monitored target.
 */
export interface TargetLabels extends Labels {
  monitored_resource?: string;
  location?: string;
  container_name?: string;
  queue?: string;
}

/**
 * Definition of a metric to be collected.
 */
export interface MetricDefinition {
  type: "prometheus" | "logging";
  queryBuilder: (
    labels: TargetLabels,
    p: { range: string; startIso: string; endIso: string }
  ) => string;
  /** Used only for type: "logging" */
  aggregator?: (payloads: string[]) => number;
}

export const Targets = Object.freeze({
  "stock-conversion": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "stock-conversion-service-app",
  },
  "new-stock": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "new-stock-service-app",
  },
  "rabbitmq": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "rabbitmq",
  },
  "db-process": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-process-rec-app",
  },
  "db-business1": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business1-rec-app",
  },
  "db-business2": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business2-rec-app",
  },
  "db-business3": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business3-rec-app",
  },
  "db-business4": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business4-rec-app",
  },
  "db-business5": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business5-rec-app",
  },
  "db-business6": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business6-rec-app",
  },
  "db-business7": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business7-rec-app",
  },
  "db-business8": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business8-rec-app",
  },
  "db-business9": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business9-rec-app",
  },
  "db-business10": {
    monitored_resource: "k8s_container",
    location: "asia-northeast1",
    container_name: "db-business10-rec-app",
  },
  // RabbitMQ Queues
  "mq-calculate-stock": {
    location: "asia-northeast1",
    queue: "CALCULATE_STOCK_PROCESS",
  },
  "mq-calculate-stock-diff": {
    location: "asia-northeast1",
    queue: "CALCULATE_STOCK_DIFF_PROCESS",
  },
  "mq-calculate-current-stock": {
    location: "asia-northeast1",
    queue: "CALCULATE_CURRENT_STOCK_PROCESS",
  },
  "mq-persistent": {
    location: "asia-northeast1",
    queue: "PERSISTENT_PROCESS",
  },
} as const);

export type TargetKey = keyof typeof Targets;

export const Metrics = Object.freeze({
  "cpu-limit-util-max": {
    type: "prometheus",
    queryBuilder: (labels: TargetLabels, p: any) => {
      const sel = Selector.buildSelector(
        "kubernetes.io/container/cpu/limit_utilization",
        labels
      );
      return `max_over_time(${sel}[${p.range}])`;
    },
  },
  "mem-limit-util-max": {
    type: "prometheus",
    queryBuilder: (labels: TargetLabels, p: any) => {
      const sel = Selector.buildSelector(
        "kubernetes.io/container/memory/limit_utilization",
        labels
      );
      return `max_over_time(${sel}[${p.range}])`;
    },
  },
  "rabbitmq-queue-messages-max": {
    type: "prometheus",
    queryBuilder: (labels: TargetLabels, p: any) => {
      const sel = Selector.buildSelector("rabbitmq_queue_messages", labels);
      return `max_over_time(${sel}[${p.range}])`;
    },
  },
  // Cloud Logging metrics
  "log-delivery-file-count": {
    type: "logging",
    queryBuilder: (labels: TargetLabels, p: any) =>
      `resource.type="k8s_container" ` +
      `AND resource.labels.location="${labels.location}" ` +
      `AND resource.labels.container_name="${labels.container_name}" ` +
      `AND timestamp >= "${p.startIso}" AND timestamp <= "${p.endIso}" ` +
      `AND textPayload:"pubsub processMessage Start File:"`,
    aggregator: (payloads: string[]) => {
      const fileRegex = /(?:File(?:name)?|Path)[:= ]+(\S+)/i;
      const uniqueFiles = new Set<string>();
      for (const p of payloads) {
        const match = p.match(fileRegex);
        if (match) uniqueFiles.add(match[1]);
      }
      return uniqueFiles.size;
    },
  },
  "log-processed-message-count": {
    type: "logging",
    queryBuilder: (labels: TargetLabels, p: any) =>
      `resource.type="k8s_container" ` +
      `AND resource.labels.location="${labels.location}" ` +
      `AND resource.labels.container_name="${labels.container_name}" ` +
      `AND timestamp >= "${p.startIso}" AND timestamp <= "${p.endIso}" ` +
      `AND textPayload:"pubsub processMessage End File:"`,
    aggregator: (payloads: string[]) => payloads.length,
  },
} as const);

export type MetricKey = keyof typeof Metrics;

export const OutputColumns: Record<TargetKey, Partial<Record<MetricKey, number>>> =
  Object.freeze({
    "stock-conversion": {
      "cpu-limit-util-max": col_("Y"),
      "mem-limit-util-max": col_("Z"),
      "log-delivery-file-count": col_("O"),
      "log-processed-message-count": col_("P"),
    },
    "new-stock": {
      "cpu-limit-util-max": col_("AA"),
      "mem-limit-util-max": col_("AB"),
    },
    "rabbitmq": {
      "cpu-limit-util-max": col_("AC"),
      "mem-limit-util-max": col_("AD"),
    },
    "db-process": {
      "cpu-limit-util-max": col_("AE"),
      "mem-limit-util-max": col_("AF"),
    },
    "db-business1": {
      "cpu-limit-util-max": col_("AG"),
      "mem-limit-util-max": col_("AH"),
    },
    "db-business2": {
      "cpu-limit-util-max": col_("AI"),
      "mem-limit-util-max": col_("AJ"),
    },
    "db-business3": {
      "cpu-limit-util-max": col_("AK"),
      "mem-limit-util-max": col_("AL"),
    },
    "db-business4": {
      "cpu-limit-util-max": col_("AM"),
      "mem-limit-util-max": col_("AN"),
    },
    "db-business5": {
      "cpu-limit-util-max": col_("AO"),
      "mem-limit-util-max": col_("AP"),
    },
    "db-business6": {
      "cpu-limit-util-max": col_("AQ"),
      "mem-limit-util-max": col_("AR"),
    },
    "db-business7": {
      "cpu-limit-util-max": col_("AS"),
      "mem-limit-util-max": col_("AT"),
    },
    "db-business8": {
      "cpu-limit-util-max": col_("AU"),
      "mem-limit-util-max": col_("AV"),
    },
    "db-business9": {
      "cpu-limit-util-max": col_("AW"),
      "mem-limit-util-max": col_("AX"),
    },
    "db-business10": {
      "cpu-limit-util-max": col_("AY"),
      "mem-limit-util-max": col_("AZ"),
    },
    "mq-calculate-stock": {
      "rabbitmq-queue-messages-max": col_("BA"),
    },
    "mq-calculate-stock-diff": {
      "rabbitmq-queue-messages-max": col_("BB"),
    },
    "mq-calculate-current-stock": {
      "rabbitmq-queue-messages-max": col_("BC"),
    },
    "mq-persistent": {
      "rabbitmq-queue-messages-max": col_("BD"),
    },
  });
