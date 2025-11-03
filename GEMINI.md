# GEMINI.md

## プロジェクト概要

これは `create-next-app` を使用して初期化された [Next.js](https://nextjs.org/) プロジェクトです。TypeScript、スタイリングのためのTailwind CSS、状態管理のためのZustandを使用しています。

このプロジェクトは、コードの品質、リンティング、テストのための包括的なツール群で設定されており、開発のベストプラクティスを重視していることを示しています。

- **フレームワーク:** Next.js
- **言語:** TypeScript
- **スタイリング:** Tailwind CSS
- **状態管理:** Zustand
- **パッケージマネージャー:** pnpm
- **リンティング & フォーマッティング:** ESLint, Prettier, commitlint, secretlint, textlint
- **テスト:** Vitest, Playwright, Storybook, ミューテーションテストのためのStryker

## ビルドと実行

### 開発

開発サーバーを起動するには:

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

### ビルド

プロダクションビルドを作成するには:

```bash
pnpm build
```

### プロダクションサーバーの実行

プロダクションサーバーを起動するには:

```bash
pnpm start
```

### リンティング

リンターを実行するには:

```bash
pnpm lint
```

## 開発規約

### コードスタイル

このプロジェクトでは、一貫したコードスタイルを強制するためにESLintとPrettierを使用しています。これらのツールをコードエディタに統合することをお勧めします。

### コミット

このプロジェクトは [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 仕様に従っています。`commitlint` を使用してこの標準を強制しています。

### テスト

包括的なテスト戦略が導入されており、以下を活用しています:

- **Vitest:** ユニットテストおよび統合テスト用
- **Playwright:** エンドツーエンドテスト用
- **Storybook:** コンポーネント開発およびテスト用
- **Stryker:** テストの品質を評価するためのミューテーションテスト用

新機能やバグ修正には、対応するテストを付随させることが期待されます。