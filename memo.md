# 作業ログ

## 2026-02-10: 開発環境のモダン化 (esbuild 導入)

### 目的
- GAS のフラットなファイル構造の制約を解消し、`import / export` による構造的な開発を可能にする。
- Vitest によるユニットテストを標準的な手法で実行可能にする。
- ESLint / Prettier による静的解析を安定させる。

### 実施内容
- [x] 基礎的な Lint / Test パッケージのインストール
- [x] esbuild の導入と設定
- [x] 既存コードの ESModules (import/export) 化
- [x] ビルドパイプラインの更新
- [x] テストコードの正常化 (Vitest)
- [x] GAS 実行用のグローバルエントリーポイント設定 (esbuild footer)
- [x] 構造化ログ（Structured Logging）の設計と導入
- [x] const.ts の役割ごとの分解 (config.ts, definitions.ts, utils.ts)

## ログ設計のポイント
- **JSON形式**: Cloud Logging での検索性を高めるため、全てのログを JSON で出力。
- **トレース機能**: `Logger.trace` により、関数の開始・終了・引数・実行時間を自動記録。
- **コンテキスト情報**: ファイル名 (`FILE`) と関数名 (`func`) を常に含め、原因分析を容易に。
- **エラーハンドリング**: スタックトレースを含めた詳細なエラーログを出力。

## 完了した構成
1. **開発**: `src/` 配下で ESModules を利用した構造的な開発。
2. **検証**: `npm test` による高速な単体テスト。
3. **品質**: `npm run lint` / `format` によるコード品質管理。
4. **反映**: `npm run push` による自動ビルド & 1ファイル集約デプロイ。
