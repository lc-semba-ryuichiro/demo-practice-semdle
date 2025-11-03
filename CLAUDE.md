# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

TypeScript を使用した Next.js 16 (App Router) プロジェクトです。パッケージマネージャーには pnpm を使用しています。コード品質、テスト、ドキュメント化のための包括的なツールを備えており、コミットメッセージとドキュメントで日本語をサポートしています。

## 開発コマンド

### コア開発

```bash
pnpm dev          # 開発サーバーを起動 (http://localhost:3000)
pnpm build        # 本番用ビルド
pnpm start        # 本番サーバーを実行
pnpm lint         # ESLint を実行
```

### 品質保証

```bash
secretlint "**/*"  # シークレット情報の漏洩をチェック
remark .           # Markdown ファイルを Lint (日本語 TOC 対応)
textlint "**/*.md" # 日本語技術文書を Lint
```

## パッケージ管理

- **パッケージマネージャー**: pnpm (strict catalog mode)
- **ワークスペース設定**: `pnpm-workspace.yaml` で集中管理されたバージョンカタログを定義
- **カタログモード**: すべての依存関係は `catalog:` 参照を使用し、pnpm-workspace.yaml のバージョンを参照
- パッケージを追加・更新する際は、個別の package.json ではなく pnpm-workspace.yaml のカタログを更新すること

## コードアーキテクチャ

### Next.js 構造

- **App Directory**: Next.js 14+ の App Router パターンを使用
- **レイアウト**: ルートレイアウト (app/layout.tsx) で Geist フォントとグローバルスタイルを設定
- **スタイリング**: Tailwind CSS 4.x (postcss.config.mjs でカスタム設定)
- **パスエイリアス**: `@/*` はプロジェクトルートにマップ (tsconfig.json で設定)

### TypeScript 設定

- ターゲット: ES2017
- Strict モード有効
- JSX transform: react-jsx (React 19)
- モジュール解決: bundler

## Lint とコード品質

### ESLint

- 設定ファイル: `eslint.config.mjs` (flat config 形式)
- プリセット: eslint-config-next (core-web-vitals と TypeScript)
- 保存時に自動フォーマット (VS Code)

### コミットメッセージ

- Commitlint と Conventional Commits 形式を使用
- 日本語メッセージをサポートするため、subject case 検証を無効化 (commitlint.config.mjs:4)

### Markdown とドキュメント

- Remark による Lint (GFM サポート)
- 日本語と英語の TOC ヘッダーに対応: "目次|table of contents"
- Textlint による日本語技術文書の検証

### セキュリティ

- Secretlint による認証情報漏洩検出 (推奨プリセット設定済み)

## 状態管理

- Zustand が状態管理に利用可能 (dependencies を参照)

## 利用可能なテストツール

プロジェクトにはテスト用の依存関係が設定されていますが、テストファイルはまだありません:

- **Vitest**: ユニットテスト (@vitest/coverage-v8 でカバレッジ測定)
- **Playwright**: E2E テスト
- **Stryker**: ミューテーションテスト
- **Cucumber**: BDD テスト
- **MSW**: API モック

## ツール

- **mise**: Node.js と pnpm のバージョン管理 (最新版を使用する設定)
- **Prettier**: 保存時に自動フォーマット (Tailwind プラグイン使用)
- **VS Code**: デフォルトで保存時フォーマットが有効

## 開発上の注意事項

- プロジェクトは日本語と英語の両方のドキュメントをサポート
- ダークモードは Tailwind CSS クラスで実装済み
- VS Code 設定でデフォルトで保存時フォーマットが有効
