# loadtest-gas

Google Apps Script (GAS) tool to collect performance metrics from Google Cloud Managed Service for Prometheus and record them in a spreadsheet for load test analysis.

## Project Structure

- `src/`: TypeScript source code.
- `dist/`: Bundled JavaScript files for deployment to GAS.
- `docs/`: Project documentation and logs.
- `tests/`: (Implicit in `src/*.test.ts`) Unit tests.

## Documentation

- [Architecture (アーキテクチャ詳細)](docs/architecture.md)
- [Setup Guide (環境構築)](docs/環境構築.md)
- [Development Memo (作業ログ)](docs/memo.md)

## Getting Started

### Installation

```bash
npm install
```

### Development Workflow

- **Build**: `npm run build` - Bundles the source code into `dist/main.gs`.
- **Push**: `npm run push` - Builds and pushes the code to Google Apps Script.
- **Test**: `npm test` - Runs unit tests using Vitest.
- **Lint**: `npm run lint` - Checks for code style and errors.

## License

ISC
