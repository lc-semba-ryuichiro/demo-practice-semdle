# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## 開発コマンド

### 基本ワークフロー
- `pnpm dev` – Next.js 開発サーバーをポート 3000 で起動
- `pnpm build` – プロダクションビルドを作成
- `pnpm typecheck` – `tsc --noEmit` で厳格な TypeScript チェックを実行
- `pnpm lint` – ESLint を max-warnings=0 で実行
- `pnpm format` – Prettier フォーマットをチェック

### テスト
- `pnpm test` – すべての Vitest ユニットテストを実行
- `pnpm test:watch` – Vitest をウォッチモードで実行
- `pnpm test:e2e` – Playwright e2e テストを実行（`./e2e/tests` ディレクトリを使用）
- `pnpm test:e2e:ui` – Playwright を UI モードで実行

### Storybook & ドキュメント
- `pnpm storybook` – Storybook をポート 6006 で起動
- `pnpm build-storybook` – Storybook 静的サイトをビルド
- `pnpm textlint` – Markdown ドキュメントを lint

### その他のツール
- `pnpm depgraph` – dependency-cruiser を使用して依存関係グラフを可視化

## アーキテクチャ概要

このプロジェクトは **Next.js 16 App Router** アプリケーションで、厳格なレイヤー強制を伴う **Feature-Sliced Design (FSD)** 原則を採用しています。

### レイヤー階層（上から下）

```
app → features → ui → lib (client/server/shared) → config/types/db
```

**重要なルール:**
1. **Features は public API 経由でエクスポート** (`index.ts`) – feature 内部からのインポートは禁止（例: `@/features/auth/components/X` は禁止、`@/features/auth` を使用）
2. **Client/Server の分離** – `lib/server` は `lib/client` からインポート不可
3. **UI コンポーネントはダム** – `src/ui` は `features` や `app` からインポート不可
4. **上位への依存禁止** – 下位レイヤーは上位レイヤーからインポート不可

### ディレクトリ構造

- **`src/app/`** – Next.js App Router のページ、レイアウト、API ルート
  - `(marketing)/` – マーケティングページグループ
  - `app/` – 認証済みアプリセクション
  - `api/health/` – ヘルスチェックエンドポイント
  - `auth/callback/` – OAuth コールバックハンドラー
- **`src/features/`** – ビジネスドメインロジック（auth、user など）
  - 各 feature は `index.ts` 経由でエクスポート
  - 含まれるもの: `components/`, `hooks/`, `lib/`, `types/`
- **`src/ui/`** – 再利用可能な UI コンポーネント（Button など）
  - ストーリー、テスト、ドキュメントを同じ場所に配置
- **`src/lib/`**
  - `client/` – ブラウザ専用コード（Supabase クライアント、アナリティクス）
  - `server/` – サーバー専用コード（認証、アクション、キャッシュ、管理）
  - `shared/` – 同型ユーティリティ（cn、fetcher、schema）
- **`src/config/`** – 環境変数、ルート、定数
- **`src/db/`** – データベース型とスキーマ
- **`tests/`** – テストセットアップ、MSW ハンドラー
- **`e2e/tests/`** – Playwright e2e テスト

### パスエイリアス

```typescript
@/*           → src/*
@app/*        → src/app/*
@config/*     → src/config/*
@features/*   → src/features/*
@lib/*        → src/lib/*
@lib/client/* → src/lib/client/*
@lib/server/* → src/lib/server/*
@lib/shared/* → src/lib/shared/*
@ui/*         → src/ui/*
@types/*      → src/types/*
@db/*         → src/db/*
```

### 技術スタック

- **Framework:** Next.js 16 (App Router) + React 19
- **Database:** Supabase
- **Styling:** Tailwind CSS v4 + class-variance-authority
- **State:** Zustand + TanStack Query
- **Testing:** Vitest (unit) + Playwright (e2e) + MSW (mocking)
- **Docs:** Storybook + Astro Starlight (`docs/`)
- **Validation:** Zod
- **Package Manager:** pnpm with workspace catalog

## コード品質ルール

### TypeScript
- `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` などを含む極めて厳格な設定
- すべてのコードはエラーゼロで `pnpm typecheck` に合格する必要がある

### ESLint ハイライト
- **関数型プログラミング** を `eslint-plugin-functional` で強制
  - `let` の使用禁止（ループ初期化または `mut_` プレフィックスを除く）
  - イミュータブルデータ（`draft`, `mut_` プレフィックス、React refs, `.current` を除き変更禁止）
  - フレームワーク実用主義: Next.js 互換性のため `void` 戻り値、式文、条件文は許可
- **インポート規律:**
  - `simple-import-sort` による自動ソートインポート
  - 循環依存禁止
  - レイヤー境界を厳格に強制
- **デフォルトエクスポート** は Next.js 特別ファイル（`page.tsx`, `layout.tsx` など）のみ許可

### テスト戦略
- **ユニットテスト:** `src/` 内に `*.test.tsx` として同じ場所に配置、Vitest + jsdom + MSW を使用
- **E2E テスト:** `e2e/tests/` 内の Playwright
- MSW サーバーセットアップは `tests/msw/` にあり

### 環境変数
- `src/config/env.ts` で Zod を使用して検証
- サーバー変数は `env.server`、クライアント変数は `env.client` 経由でアクセス
- 必須変数:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`（デフォルトは localhost）

## Feature の操作

新しい feature を追加する場合:

1. `src/features/{feature-name}/` 配下に feature ディレクトリを作成
2. 標準構造を使用:
   ```
   {feature-name}/
   ├── components/     # UI コンポーネント
   ├── hooks/          # カスタムフック
   ├── lib/            # ビジネスロジック、アクション
   ├── types.ts        # TypeScript 型
   └── index.ts        # Public API エクスポート
   ```
3. 必要なものだけを `index.ts` 経由でエクスポート
4. 他の feature からは `@/features/{name}` 経由でインポート（深いインポートは禁止）

## 一般的なパターン

### Middleware
- 認証セッション更新は `middleware.ts` で Supabase 経由で行われる
- `@/lib/server/supabase/middleware` から `updateSession` を呼び出す

### Supabase の使用
- **Client-side:** `@/lib/client/supabase`（ブラウザ専用）
- **Server-side:** `@/lib/server/supabase`（Server Components、Route Handlers）
- **Admin:** `@/lib/server/supabase/admin`（service role key）

### UI コンポーネント構造
`src/ui/` 内の各コンポーネントは以下に従う:
- `ComponentName.tsx` – 実装
- `ComponentName.stories.tsx` – Storybook ストーリー
- `ComponentName.test.tsx` – Vitest テスト
- `ComponentName.docs.mdx` – ドキュメント
- `component-variants.ts` – CVA バリアント（必要な場合）
- `index.ts` – Public エクスポート

## 備考

- 一元化されたバージョン管理のために pnpm workspace catalog を使用
- Lefthook が git hooks を処理
- ビジュアルリグレッションテストのための Chromatic 統合
- Stryker 経由でミューテーションテストが利用可能
- ドキュメントサイトは `docs/` 内の Astro Starlight を使用
