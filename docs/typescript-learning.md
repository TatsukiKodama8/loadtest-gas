# TypeScript と Kotlin の思想の違い：型システムの学び

このドキュメントでは、本プロジェクトのリファクタリングを通じて得られた、TypeScript の型システム（構造的部分型）と Kotlin（名前的型付け）の思想的な違いについてまとめます。

## 1. 構造的部分型 (Structural Typing) vs 名前的型付け (Nominal Typing)

### Kotlin (Nominal Typing / 名前的型付け)
- **「家柄」を重視するシステム**です。
- あるクラスがインターフェースを満たすためには、明示的に `class MyMetric : MetricDefinition` と宣言（implements）する必要があります。
- 例え中身が同じでも、名前（ラベル）が違えば別物として扱われます。

### TypeScript (Structural Typing / 構造的部分型)
- **「持ち物」を重視するシステム**です。
- オブジェクトが必要なプロパティ（例：`queryBuilder` 関数）を持っているなら、明示的に宣言していなくてもその型であるとみなします（ダック・タイピング）。
- **メリット**: JavaScript 由来の柔軟なオブジェクトリテラル `{}` をそのまま安全に扱えます。

## 2. なぜ `interface` を定義するのか？

プロジェクト内で `MetricDefinition` インターフェースを定義している理由は、明示的に `implements` するためではなく、**「設計図」として機能させるため**です。

1.  **静的なチェック**: オブジェクトを作る際、プロパティ名の一文字でも間違えれば、TypeScript が「設計図と違う」と即座にエラーを出します。
2.  **安全な利用**: `main.ts` などでメトリクスを扱う際、そのオブジェクトが確実に `queryBuilder` を持っていることをコンパイラが保証してくれます。
3.  **拡張性**: 将来的に `unit`（単位）や `threshold`（閾値）が必要になった際、インターフェースを修正するだけで、修正が必要な箇所をコンパイラが教えてくれます。

## 3. `as const` と型推論の活用

`src/definitions.ts` では以下のパターンを採用しています。

```typescript
export const Targets = Object.freeze({ ... } as const);
export type TargetKey = keyof typeof Targets;
```

- **`as const`**: 値を「書き換え不可な定数」として固定し、TypeScript にその中身を詳細に把握させます。
- **`keyof typeof`**: 定数の中身から自動的に「キーの集まり（型）」を抽出します。
- **学び**: これにより、`Targets` に新しい項目を追加するだけで、自動的に `TargetKey` 型が更新され、`OutputColumns` のキーチェックなども連動するようになります（Single Source of Truth）。

## 4. 安全性の守り方

TypeScript は「名前」で型を判定しませんが、**「構造」については非常に厳格**です。

- **レントゲン写真のようなチェック**: コンパイラは名札を見るのではなく、オブジェクトの内部構造を常にスキャンしています。
- **意図の固定**: `const Metrics: Record<string, MetricDefinition>` のように型アノテーションを添えることで、開発者の意図（これはメトリクスとして作っている）を固定し、想定外の混入を防ぐことができます。
