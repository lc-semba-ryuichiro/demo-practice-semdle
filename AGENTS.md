# Repository Guidelines

## プロジェクト構成とモジュール配置

- `app/` は Next.js App Router の画面とルートを保持し、UI コンポーネントは `app/(...)` 配下へ整理してください。
- 共通ロジックと型定義は `types/` と `app/lib/`（必要に応じて作成）へ集約し、`@/` エイリアスで参照します。
- 公開アセットは `public/`、ドキュメントや設計メモは `docs/` にまとめ、ワークスペース定義は `pnpm-workspace.yaml` で管理します。

## ビルド・テスト・開発コマンド

- `pnpm install` でルート依存を準備します（mise により Node と pnpm のバージョンを固定）。
- `pnpm dev` はローカル開発サーバーをポート 3000 で起動、`pnpm build` は本番ビルド、`pnpm start` はビルド成果物の検証に使用します。
- `pnpm lint` は Next.js プリセット付き ESLint を実行し、Git フック前に必ず通過させます。
- `pnpm vitest run` と `pnpm vitest --coverage` は単体テストとカバレッジ計測、E2E は `pnpm playwright test` を想定し、BDD は `pnpm cucumber-js` を使用してください。

## コーディングスタイルと命名規則

- TypeScript は `strict` 設定、JSX は関数コンポーネント主体、コンポーネントは PascalCase、フックは `useCamelCase` を徹底します。
- Tailwind CSS を利用するためユーティリティクラスは論理グルーピング順に記述し、不要なカスタム CSS は控えます。
- フォーマットは Prettier + `prettier-plugin-tailwindcss` を採用し、`pnpm prettier --write "**/*.{ts,tsx,md}"` を補助的に使用できます。
- 文字列は i18n 想定でテンプレートリテラルを優先し、環境変数は `process.env.NEXT_PUBLIC_*` のプレフィックス付きで公開可否を明示します。

## テスト指針

- 単体テストは `tests/unit` もしくは 対象モジュールと同階層に `*.test.ts` で配置し、振る舞いベースのアサーションを行います。
- ビジュアル回帰やユーザーフローは Playwright の `tests/e2e` に格納し、CI で `pnpm playwright test --reporter=list` を実行してください。
- カバレッジは 80% 以上を維持し、低下した場合は `pnpm vitest --runInBand` で対象を特定します。
- `@cucumber/cucumber` を使う場合は `tests/features/*.feature` と `tests/step_definitions` を対応付け、ビジネス用語は用語集に追記します。

## コミットとプルリクエストの方針

- コミットメッセージは Conventional Commits（例: `feat: add scoreboard UI`）に従い、日本語サブジェクトも許容されますが句読点は使用しません。
- 1 コミット 1 目的を意識し、設定や依存更新は `chore:`、CI は `ci:` を選択、破壊的変更は `BREAKING CHANGE:` で明示します。
- PR では概要、スクリーンショットまたは動画、再現手順、関連 issue を記載し、セルフレビューコメントで確認ポイントを示します。
- マージ前に `pnpm lint` と必要なテストを再実行し、CI ステータスがすべて成功していることを確認してください。

## エージェント向けヒント

- 生成系エージェントは CLAUDE.md と GEMINI.md の手順も参照し、重複する整形処理やオフライン作業指示を確認します。
- 自動化スクリプトを追加する場合は `package.json` のスクリプトと整合し、秘密情報は Secretlint が検出可能な形式で管理します。
- レビュー用ログは `docs/decisions/`（必要に応じ新設）に ADR として残し、後続エージェントが設計判断を追跡できるようにしてください。
