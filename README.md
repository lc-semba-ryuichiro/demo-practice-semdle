# semdle

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=lc-semba-ryuichiro_demo-practice-semdle&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=lc-semba-ryuichiro_demo-practice-semdle)

リンクを開いて◯/△/×をタップするだけで日程調整が完了する、モバイルファーストのスケジューリングツールです。

## 目次

- [概要](#概要)
  - [主な機能](#主な機能)
- [技術スタック](#技術スタック)
- [クイックスタート](#クイックスタート)
  - [前提条件](#前提条件)
  - [セットアップ](#セットアップ)
- [開発コマンド](#開発コマンド)
  - [基本ワークフロー](#基本ワークフロー)
  - [テスト](#テスト)
  - [Storybook](#storybook)
  - [その他](#その他)
- [ディレクトリ構造（Feature-Sliced Design）](#ディレクトリ構造feature-sliced-design)
- [貢献](#貢献)
- [ドキュメント](#ドキュメント)
- [ライセンス](#ライセンス)

## 概要

**semdle** は、複数候補から最小の摩擦で合意を取るための日程調整ツールです。Doodleが確立した三択グリッド（◯/△/×）UIを採用し、以下の課題を解決します。

- 初回回答率の向上: 匿名＋CAPTCHA で「参加は最短ワンクリック」
- 決定までの時間短縮: 締切＋自動リマインダで"決めどき"を作る
- 心理的負担の軽減: 参加者非表示トグルで公開範囲の不安を解消

### 主な機能

- 三択グリッド（Yes/If-need-be/No） による直感的な回答
- 匿名即投票: アカウント不要、CAPTCHA で保護
- タイムゾーン自動調整: 誤解による不一致を防止
- 参加者非表示オプション: プライバシーと心理的安全性を確保
- 締切＋自動リマインド: 未回答を掘り起こし
- モバイル最適化: レスポンシブWebで完結

## 技術スタック

- Framework: Next.js 16 (App Router) + React 19
- Database: Supabase
- Styling: Tailwind CSS v4 + class-variance-authority
- State Management: Zustand + TanStack Query
- Testing: Vitest (unit) + Playwright (e2e) + MSW (API mocking)
- Docs: Storybook + Astro Starlight
- Validation: Zod
- Package Manager: pnpm (workspace catalog)

## クイックスタート

### 前提条件

- Node.js 20.x 以上
- pnpm 9.x 以上
- Supabase アカウント（ローカル開発の場合は Supabase CLI）

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local
# .env.local を編集して Supabase の認証情報を設定

# 開発サーバーの起動
pnpm dev
```

ブラウザで <http://localhost:3000> を開いてください。

## 開発コマンド

### 基本ワークフロー

```bash
pnpm dev          # Next.js 開発サーバー起動（ポート 3000）
pnpm build        # プロダクションビルド
pnpm typecheck    # TypeScript 型チェック
pnpm lint         # ESLint 実行
pnpm format       # Prettier フォーマットチェック
```

### テスト

```bash
pnpm test         # Vitest ユニットテスト実行
pnpm test:watch   # Vitest ウォッチモード
pnpm test:e2e     # Playwright E2E テスト実行
pnpm test:e2e:ui  # Playwright UI モード
```

### Storybook

```bash
pnpm storybook         # Storybook 起動（ポート 6006）
pnpm build-storybook   # Storybook 静的サイトビルド
```

### その他

```bash
pnpm textlint   # Markdown ドキュメントの lint
pnpm depgraph   # 依存関係グラフの可視化
```

## ディレクトリ構造（Feature-Sliced Design）

```
src/
├─ app/                 # Next.js App Router（ページ・レイアウト・API）
│  ├─ (marketing)/      # マーケティングページ
│  ├─ app/              # 認証済みアプリ
│  ├─ api/              # API Routes
│  └─ auth/             # 認証関連ルート
├─ features/            # 機能ごとの縦切り（auth, user など）
│  ├─ {feature}/
│  │  ├─ components/    # 機能固有UIコンポーネント
│  │  ├─ hooks/         # カスタムフック
│  │  ├─ lib/           # ビジネスロジック・Server Actions
│  │  ├─ types.ts       # 型定義
│  │  └─ index.ts       # Public API（外部公開）
├─ ui/                  # 再利用可能UIコンポーネント
├─ lib/
│  ├─ server/           # サーバー専用コード
│  ├─ client/           # クライアント専用コード
│  └─ shared/           # 共有ユーティリティ
├─ config/              # 環境変数・定数
├─ db/                  # データベース型定義
└─ types/               # 共通型定義
```

詳細は [CLAUDE.md](./CLAUDE.md) を参照してください。

## 貢献

プロジェクトへの貢献を歓迎します。
貢献方法の詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

## ドキュメント

- [プロジェクトガイド](./docs/src/content/docs/000_overview/02_project-guide.md)
- [Pitch Deck](./docs/src/content/docs/000_overview/01_pitch-deck.md)
- [Claude Code ガイド](./CLAUDE.md)

## ライセンス

[MIT License](./LICENSE)
