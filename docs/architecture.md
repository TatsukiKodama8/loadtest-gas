# Architecture

This document describes the system architecture, module dependencies, and data structures of the `loadtest-gas` project.

## Class Diagram

The following diagram illustrates the relationships between type definitions, configuration objects, and core logic modules.

```mermaid
classDiagram
    %% --- Type Definitions ---
    class Labels {
        <<Type>>
        Record~string, string|number|bool~
    }

    class TargetLabels {
        <<Interface>>
        +monitored_resource: string
        +location: string
        +container_name: string
    }
    TargetLabels --|> Labels : extends

    class MetricDefinition {
        <<Interface>>
        +queryBuilder(labels: TargetLabels, range: string) string
    }
    MetricDefinition ..> TargetLabels : uses

    %% --- Configuration Objects ---
    class Targets {
        <<Const Object>>
        Record~TargetKey, TargetLabels~
    }
    Targets --> TargetLabels : contains values

    class Metrics {
        <<Const Object>>
        Record~MetricKey, MetricDefinition~
    }
    Metrics --> MetricDefinition : contains values

    class OutputColumns {
        <<Const Object>>
        Record~TargetKey, Record~MetricKey, number~~
    }
    
    %% --- Core Logic Modules (IIFE) ---
    class Selector {
        <<Module>>
        +buildSelector(metricName: string, labels: Labels) string
    }
    Selector ..> Labels : uses

    class MetricsService {
        <<Module>>
        +toPromDurationSeconds_(start: Date, end: Date) string
        +fetchScalarMaxInRangeJst(params) number?
    }
    MetricsService ..> PrometheusApi : calls

    class PrometheusApi {
        <<Module>>
        +query(params) Response
    }
    PrometheusApi ..> MonitoringClient : calls

    class MonitoringClient {
        <<Module>>
        +fetchJson(url, opts) Response
    }

    class SheetConfig {
        <<Config>>
        +SHEET_NAME: string
        +HEADER_ROWS: number
        +COL_DATE: number
    }

    class GcpConfig {
        <<Config>>
        +PROJECT_ID: string
        +LOCATION: string
    }

    %% --- Main Entry Point ---
    class Main {
        <<Entry Point>>
        +main()
        +runUpdateAllRows()
    }
    Main ..> MetricsService : uses
    Main ..> Targets : iterates
    Main ..> Metrics : iterates
    Main ..> OutputColumns : reads
    Main ..> SheetConfig : reads
```

## Module Responsibilities

### Configuration & Definitions
- **config.ts**: Environment-specific settings (GCP Project ID, Sheet names).
- **definitions.ts**: Domain-specific definitions. Mapping of targets to metrics and their corresponding spreadsheet columns.

### Core Logic
- **main.ts**: Orchestrates the spreadsheet update process.
- **metricsService.ts**: High-level service for fetching and processing metrics.
- **prometheusApi.ts**: Low-level client for the Google Cloud Monitoring Prometheus API.
- **monitoringClient.ts**: Handles HTTP requests and OAuth authentication.
- **selector.ts**: Utility to build PromQL selectors from label maps.
- **logger.ts**: Structured logging utility.
