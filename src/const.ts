import { Selector } from "./selector";

export function col_(a1: string) {
  let n = 0;
  for (const ch of a1.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n;
}

export const SheetConfig = Object.freeze({
  SHEET_NAME: "test",
  HEADER_ROWS: 2,
  COL_DATE: col_("H"),
  COL_START_TIME: col_("I"),
  COL_END_TIME: col_("J"),
});

export const GcpConfig = Object.freeze({
  PROJECT_ID: "shinise-dev",
  LOCATION: "asia-northeast1",
});

export const Targets = Object.freeze([
  {
    key: "stock-conversion",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "stock-conversion-service-app",
    },
  },
  {
    key: "new-stock",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "new-stock-service-app",
    },
  },
  {
    key: "rabbitmq",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "rabbitmq",
    },
  },
  {
    key: "db-process",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-process-rec-app",
    },
  },
  {
    key: "db-business1",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business1-rec-app",
    },
  },
  {
    key: "db-business2",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business2-rec-app",
    },
  },
  {
    key: "db-business3",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business3-rec-app",
    },
  },
  {
    key: "db-business4",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business4-rec-app",
    },
  },
  {
    key: "db-business5",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business5-rec-app",
    },
  },
  {
    key: "db-business6",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business6-rec-app",
    },
  },
  {
    key: "db-business7",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business7-rec-app",
    },
  },
  {
    key: "db-business8",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business8-rec-app",
    },
  },
  {
    key: "db-business9",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business9-rec-app",
    },
  },
  {
    key: "db-business10",
    labels: {
      monitored_resource: "k8s_container",
      location: "asia-northeast1",
      container_name: "db-business10-rec-app",
    },
  },
]);

export const Metrics = Object.freeze([
  {
    key: "cpu-limit-util-max",
    queryBuilder: (t: any, range: string) => {
      const sel = Selector.buildSelector(
        "kubernetes.io/container/cpu/limit_utilization", 
        t.labels
      );
      return `max_over_time(${sel}[${range}])`;
    },
  },
  {
    key: "mem-limit-util-max",
    queryBuilder: (t: any, range: string) => {
      const sel = Selector.buildSelector(
        "kubernetes.io/container/memory/limit_utilization", 
        t.labels
      );
      return `max_over_time(${sel}[${range}])`;
    },
  },
])

export const OutputColumns: Record<string, Record<string, number>> = Object.freeze({
  "stock-conversion": {
    "cpu-limit-util-max": col_("Y"),
    "mem-limit-util-max": col_("Z"),
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
  }
});