# プロジェクト概要

このプロジェクトは `create-next-app` でブートストラップされた Next.js プロジェクトです。App Router を使用し、TypeScript で構築されています。`dependency-cruiser` と ESLint ルールによって強制される Feature-Sliced Design (FSD) メソドロジーに従っています。

使用されている主な技術は以下の通りです。

- **フレームワーク:** Next.js (App Router)
- **言語:** TypeScript
- **UI:** React, Tailwind CSS, Storybook
- **バックエンド:** Supabase (認証およびデータベース用)
- **テスト:** Vitest (単体テスト), Playwright (エンドツーエンドテスト)
- **リンティングとフォーマット:** ESLint, Prettier, stylelint, textlint, commitlint
- **パッケージマネージャー:** pnpm

プロジェクトは、以下のレイヤーに構造化されています (`dependency-cruiser.config.cjs` および `eslint.config.mjs` で定義されています)。

- `src/app`: アプリケーションのエントリポイントで、レイアウト、ページ、API ルートを含みます。
- `src/features`: アプリケーションのビジネスロジックと機能を含みます。
- `src/ui`: 再利用可能な UI コンポーネントのセットです。
- `src/lib`: `client`、`server`、`shared` モジュールに分けられたライブラリとユーティリティを含みます。
- `src/config`: アプリケーションの設定を含みます。
- `src/db`: データベース関連の型とスキーマを含みます。
- `src/types`: グローバルな TypeScript の型を含みます。

# ビルドと実行

プロジェクトのビルド、実行、テストのための主要なコマンドは以下の通りです。

- **`pnpm dev`**: Next.js 開発サーバーを起動します。
- **`pnpm build`**: アプリケーションのプロダクションビルドを作成します。
- **`pnpm start`**: プロダクションサーバーを起動します。
- **`pnpm test`**: Vitest の単体テストを実行します。
- **`pnpm test:e2e`**: Playwright のエンドツーエンドテストを実行します。
- **`pnpm storybook`**: UI コンポーネント開発のための Storybook 開発サーバーを起動します。
- **`pnpm lint`**: ESLint を実行してコードの品質とスタイルに関する問題をチェックします。
- **`pnpm format`**: Prettier でコードのフォーマットをチェックします。
- **`pnpm typecheck`**: TypeScript コンパイラを実行して型エラーをチェックします。

# 開発規約

このプロジェクトには、包括的な ESLint 設定によって強制される非常に厳格な開発規約があります。主な規約は以下の通りです。

- **Feature-Sliced Design (FSD):** コードベースはレイヤーに整理されており、どのレイヤーがどの他のレイヤーからインポートできるかについて厳格なルールがあります。これは `dependency-cruiser` と `eslint-plugin-boundaries` によって強制されます。
- **機能の公開 API:** 機能は、その公開 API (つまり `index.ts` ファイル) を通じてのみ使用されるべきです。内部機能モジュールの直接インポートは許可されていません。
- **関数型プログラミング:** ESLint 設定には `eslint-plugin-functional` が含まれており、より関数型プログラミングスタイルを推奨しています。
- **厳格な型付け:** プロジェクトは、厳格な型チェックが有効な `typescript-eslint` を使用しています。
- **インポート順序:** インポートは `prettier` によって自動的にソートおよび整理されます。
- **デフォルトエクスポート:** Next.js 固有のファイルをいくつか例外として、デフォルトエクスポートは一般的に許可されていません。
- **コミットメッセージ:** プロジェクトは `commitlint` を使用して、一貫したコミットメッセージ形式を強制しています。
