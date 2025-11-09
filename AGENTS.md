# Repository Guidelines

## プロジェクト構成とモジュール配置
- `src/app` には Next.js App Router のページとレイアウトを集約し、セグメント単位 (`src/app/(marketing)` など) で UI を整理します。共有ウィジェットやフォームは `src/ui` に寄せ、`@/` エイリアスで再利用します。
- ドメインロジック・データアクセスは `src/lib`, `src/features`, `src/db` に配置し、型は `src/types` または ルート `types/` からエクスポートして型安全性を維持します。
- 公開アセットは `public/`、設計判断やガイドは `docs/`、Storybook ビルド成果は `storybook-static/` に保管し、`components.json` でデザインシステム設定を追跡します。
- テスト補助は `tests/` (MSW, setup) と `e2e/` (Playwright) にまとめ、必要に応じて対象モジュール直下に `*.test.ts` を併置してください。

## ビルド・テスト・開発コマンド
- 依存解決は `pnpm install` を使用し、`mise.toml` が固定する Node / pnpm バージョンを必ず適用します。
- `pnpm dev` でローカルサーバー (port 3000) を起動、`pnpm start` は本番ビルドの検証用です。
- `pnpm build` が Next.js 本番バンドルを生成し、`pnpm build-storybook` は Chromatic 連携用の UI カタログを出力します。
- 品質ゲートとして `pnpm lint`, `pnpm format`, `pnpm typecheck` を PR 前に実行し、`pnpm depgraph` で依存構造を可視化できます。
- 単体テストは `pnpm test` (Vitest) / `pnpm test:watch`、E2E は `pnpm test:e2e`、文章校正は `pnpm textlint` を利用します。

## コーディングスタイルと命名規則
- TypeScript `strict` を前提に関数コンポーネントを採用、コンポーネントは PascalCase、フックは `useCamelCase`、ユーティリティは lowerCamelCase で統一します。
- Tailwind クラスはレイアウト → サイズ → タイポ → 状態の順で並べ、カスタム CSS は最小限に抑えます。Prettier + `prettier-plugin-tailwindcss` が並び順を自動補正します。
- 文字列はテンプレートリテラルで定義し、公開可能な環境変数のみ `process.env.NEXT_PUBLIC_*` として参照してください。

## テスト指針
- 単体テストは実装横または `tests/unit` に `*.test.ts` で配置し、`@vitest/coverage-v8` でカバレッジ 80% 以上を維持します。落ちた場合は `pnpm vitest --coverage` や `pnpm vitest --runInBand` で特定します。
- `tests/msw` のハンドラでネットワークをモックし、`tests/setup` でグローバル初期化を行います。E2E 固有のフィクスチャは `e2e/fixtures`、ユーティリティは `e2e/utils` に置いてください。
- BDD が必要な場合は `tests/features/*.feature` と `tests/step_definitions` をセットで追加し、`pnpm cucumber-js` で検証します。
- CI では `pnpm playwright test --reporter=list` を実行し、安定したユーザーフローを確保します。

## コミットとプルリクエスト
- Conventional Commits (`feat: XXXX`, `chore: XXXX`) を徹底し、破壊的変更はフッターに `BREAKING CHANGE:` を追記します。1 コミット 1 トピックを意識してください。
- プッシュ前に `pnpm lint` と関連テスト、必要なら `pnpm build-storybook` を再実行し、UI 変更はスクリーンショットや動画で根拠を残します。
- PR では概要、再現手順、関連 Issue、確認結果を記載し、リスクポイントにはセルフレビューコメントを残します。必要に応じて `docs/decisions/` へ ADR を追記し、後続エージェントが判断を辿れるようにします。

## セキュリティと設定上の注意
- 秘密情報は Secretlint が検出できる形式で管理し、`.env` 類はコミットしないでください。
- 自動化スクリプトを追加する場合は `package.json` の命名規則に揃え、`pnpm workspace` の構成と矛盾しないか確認します。
