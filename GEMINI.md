# loadtest-gas

Google Apps Script (GAS) tool to collect performance metrics from Google Cloud Managed Service for Prometheus and record them in a spreadsheet for load test analysis.

## Project Overview

- **Purpose**: Automate the extraction of Kubernetes container metrics (CPU/Memory utilization) for specific time ranges corresponding to load test executions.
- **Data Source**: Google Cloud Monitoring (Prometheus API).
- **Destination**: Google Spreadsheet (Active Sheet).

## Technical Stack

- **Language**: TypeScript
- **Runtime**: Google Apps Script (V8 engine)
- **Bundler**: `esbuild` (Bundles modules into a single `dist/main.js`)
- **Testing**: `Vitest`
- **Linting**: `ESLint`, `Prettier`
- **Tooling**: `clasp` for deployment.

## Architecture & File Structure

The project uses standard ESModules (`import/export`), which are bundled by `esbuild` for GAS compatibility.

- `src/main.ts`: Entry point. Exposes global functions to GAS.
- `src/const.ts`: Configuration center (Sheet layout, targets, metrics).
- `src/metricsService.ts`: Metric calculation logic.
- `src/prometheusApi.ts`: Prometheus API client.
- `src/monitoringClient.ts`: Auth & HTTP client.
- `src/selector.ts`: PromQL selector builder.
- `src/*.test.ts`: Unit tests.

## Development Workflow

1. **Build**: `npm run build` (bundles everything into `dist/main.js`).
2. **Test**: `npm test` (runs Vitest).
3. **Lint**: `npm run lint` / `npm run format`.
4. **Push**: `npm run push` (builds and pushes to GAS).

## Coding Conventions

- **Modules**: Use the `const ModuleName = (() => { ... })();` pattern.
- **Types**: Use TypeScript. For GAS global objects, rely on `@types/google-apps-script`.
- **Spreadsheet Columns**: Use the `col_("A")` helper in `const.ts` for readability.
- **Naming**: 
    - Private functions within modules should end with an underscore (e.g., `toPromDurationSeconds_`).
    - Constants use PascalCase or UPPER_SNAKE_CASE.

## Key Configuration (src/const.ts)

- `SheetConfig`: Defines columns for Date, Start Time, and End Time.
- `Targets`: List of containers and their labels to monitor.
- `Metrics`: PromQL query templates.
- `OutputColumns`: Mapping of `Target` + `Metric` to specific Spreadsheet columns.
