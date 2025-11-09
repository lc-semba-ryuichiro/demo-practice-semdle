# Contributing to semdle

semdle への貢献に興味を持っていただき、ありがとうございます。
このドキュメントでは、プロジェクトへの貢献方法をガイドします。

## 目次

- [行動規範](#行動規範)
- [開発環境のセットアップ](#開発環境のセットアップ)
  - [必須ツール](#必須ツール)
  - [セットアップ手順](#セットアップ手順)
  - [サーバーキャッシュ設定](#サーバーキャッシュ設定)
- [開発ワークフロー](#開発ワークフロー)
  - [ブランチ戦略](#ブランチ戦略)
  - [開発前のチェック](#開発前のチェック)
- [コーディング規約](#コーディング規約)
  - [TypeScript](#typescript)
  - [ESLint ルール](#eslint-ルール)
  - [フォーマット](#フォーマット)
- [アーキテクチャルール](#アーキテクチャルール)
  - [レイヤー階層（上から下）](#レイヤー階層上から下)
  - [重要なルール](#重要なルール)
  - [新機能の追加](#新機能の追加)
- [テスト](#テスト)
  - [ユニットテスト（Vitest）](#ユニットテストvitest)
  - [E2E テスト（Playwright）](#e2e-テストplaywright)
  - [Storybook](#storybook)
  - [テスト実行のベストプラクティス](#テスト実行のベストプラクティス)
- [コミット規約](#コミット規約)
  - [フォーマット](#フォーマット-1)
  - [Type](#type)
  - [例](#例)
  - [Commitlint](#commitlint)
- [プルリクエスト](#プルリクエスト)
  - [PR 作成前のチェックリスト](#pr-作成前のチェックリスト)
  - [PR テンプレート](#pr-テンプレート)
  - [レビュープロセス](#レビュープロセス)
- [よくある質問](#よくある質問)
  - [Q: ESLint エラーが多すぎて困っています](#q-eslint-エラーが多すぎて困っています)
  - [Q: レイヤー境界違反のエラーが出ます](#q-レイヤー境界違反のエラーが出ます)
  - [Q: テストの書き方がわかりません](#q-テストの書き方がわかりません)
- [サポート](#サポート)

## 行動規範

このプロジェクトは、オープンで歓迎される環境を維持することを目指しています。すべての貢献者は、互いに敬意を持って接することが期待されます。

## 開発環境のセットアップ

### 必須ツール

- Node.js 24.x 以上
- pnpm 10.x 以上
- Supabase CLI（ローカル開発の場合）

### セットアップ手順

#### 1. リポジトリをフォーク

GitHub 上でこのリポジトリをフォークしてください。

#### 2. クローン

```bash
git clone https://github.com/YOUR_USERNAME/demo-practice-semdle.git
cd demo-practice-semdle
```

#### 3. 依存関係のインストール

```bash
pnpm install
```

#### 4. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を編集して、必要な環境変数を設定してください。

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 5. 開発サーバーの起動

```bash
pnpm dev
```

#### 6. 動作確認

ブラウザで <http://localhost:3000> を開いて、正常に動作することを確認してください。

### サーバーキャッシュ設定

`src/lib/server/cache/` 配下の LRU キャッシュは、以下の環境変数で挙動を制御できます。値を `.env.local` に設定すると、本番／開発の両方で反映されます。

| 変数名                           | 既定値   | 説明                                                                             |
| -------------------------------- | -------- | -------------------------------------------------------------------------------- |
| `CACHE_MAX_ENTRIES`              | `500`    | キャッシュできるキー数の上限。超過すると LRU で自動エビクトします。              |
| `CACHE_TTL_MS`                   | `300000` | （ミリ秒）全エントリの標準 TTL。`cacheSet` の `ttl` オプションで上書き可能です。 |
| `CACHE_MEMORY_THRESHOLD_MB`      | `768`    | RSS がこの値（MB）を超えたらメモリ監視が介入します。`0` で無効化。               |
| `CACHE_MEMORY_CHECK_INTERVAL_MS` | `30000`  | メモリ監視ポーリング間隔（ms）。                                                 |
| `CACHE_MEMORY_CLEAR_STRATEGY`    | `trim`   | 阈値超過時のアクション。`trim` は LRU の25%を削り、`clear` は全削除。            |
| `CACHE_ENABLE_MONITORING`        | `true`   | `false` にするとメモリ監視タイマーを停止します。                                 |

Next.js 16 の `unstable_cache` とも連携できるように `withUnstableCache` ヘルパーを追加しています。

```ts
import { withUnstableCache } from '@/lib/server/cache';

const getProfile = withUnstableCache(
  ['profile', 'by-id'],
  async (id: string) => db.profile.findUnique({ where: { id } }),
  { revalidate: 120 },
);

// 2回目以降は Next.js のキャッシュ＋ローカルLRUのヒットで即返却されます
await getProfile('user_123');
```

## 開発ワークフロー

### ブランチ戦略

#### 1. `main` ブランチから新しいブランチを作成

```bash
git checkout -b feature/your-feature-name
# または
git checkout -b fix/your-bug-fix
```

#### 2. 変更を加えて、コミット（後述のコミット規約に従う）

#### 3. プッシュ

```bash
git push origin feature/your-feature-name
```

#### 4. GitHub でプルリクエストを作成

### 開発前のチェック

コードを書き始める前に、以下を実行して現在の状態を確認してください。

```bash
pnpm typecheck  # TypeScript エラーがないか確認
pnpm lint       # ESLint ルール違反がないか確認
pnpm test       # 既存のテストが通ることを確認
```

## コーディング規約

### TypeScript

このプロジェクトは**極めて厳格な TypeScript 設定**を採用しています。

- `strictNullChecks`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` などが有効
- すべてのコードは `pnpm typecheck` でエラーゼロであることが必須
- `any` 型の使用は禁止（ESLint でエラー）

### ESLint ルール

#### 関数型プログラミング

`eslint-plugin-functional` により、以下が強制されます。

- **`let` の使用禁止**（例外: ループ初期化、または `mut_` プレフィックス付き変数名）
- **イミュータブルデータ**（配列・オブジェクトの直接変更は禁止）
  - 例外: `draft`（immer.js）、`mut_` プレフィックス、React refs の `.current`

```typescript
// ❌ NG
let count = 0;
count++;

const arr = [1, 2, 3];
arr.push(4);

// ✅ OK
const count = 0;
const newCount = count + 1;

const arr = [1, 2, 3];
const newArr = [...arr, 4];

// ✅ OK (例外パターン)
let mut_counter = 0; // mut_ プレフィックスで許可
mut_counter++;
```

#### インポート規律

- 自動ソート: `simple-import-sort` により、インポート文は自動的にソートされる
- 循環依存禁止: `import/no-cycle` により、循環参照はエラーになる
- レイヤー境界の厳格な強制: 後述の[アーキテクチャルール](#アーキテクチャルール)を参照

#### デフォルトエクスポート

デフォルトエクスポートは、Next.js の特別なファイル（`page.tsx`, `layout.tsx`, `route.ts` など）でのみ許可されます。

```typescript
// ❌ NG（通常のコンポーネント）
export default function Button() { ... }

// ✅ OK（通常のコンポーネント）
export function Button() { ... }

// ✅ OK（page.tsx などの Next.js 特別ファイル）
export default function Page() { ... }
```

### フォーマット

- **Prettier** によるフォーマットを使用
- コミット前に `pnpm format` を実行して確認
- エディタに Prettier プラグインを導入することを推奨

## アーキテクチャルール

このプロジェクトは **Feature-Sliced Design (FSD)** を採用し、厳格なレイヤー構造を持っています。

### レイヤー階層（上から下）

```text
app → features → ui → lib (client/server/shared) → config/types/db
```

### 重要なルール

#### 1. Features は Public API 経由でエクスポート

Features の内部から直接インポートすることは**禁止**です。必ず `index.ts` 経由でアクセスしてください。

```typescript
// ❌ NG
import { AuthButton } from '@/features/auth/components/AuthButton';

// ✅ OK
import { AuthButton } from '@/features/auth';
```

#### 2. Client/Server の分離

- `lib/server` は `lib/client` からインポート**不可**
- Server-only コードには `'server-only'` パッケージを使用
- Client-only コードには `'client-only'` パッケージを使用

#### 3. UI コンポーネントはダム

`src/ui` 内のコンポーネントは、`features` や `app` からインポート**不可**です。

```typescript
// ❌ NG（ui から features への依存）
// src/ui/button/Button.tsx
import { useAuth } from '@/features/auth';

// ✅ OK（ui は独立）
// src/ui/button/Button.tsx
export function Button({ onClick }: ButtonProps) { ... }
```

#### 4. 上位への依存禁止

下位レイヤーは上位レイヤーからインポートできません。

```typescript
// ❌ NG（lib から app への依存）
// src/lib/shared/utils.ts
import { config } from '@/app/config';

// ✅ OK（lib から config への依存）
// src/lib/shared/utils.ts
import { config } from '@/config/constants';
```

### 新機能の追加

新しい機能を追加する際は、以下の構造に従ってください。

```text
src/features/{feature-name}/
├── components/     # UI コンポーネント
├── hooks/          # カスタムフック
├── lib/            # ビジネスロジック、Server Actions
├── types.ts        # TypeScript 型定義
└── index.ts        # Public API（外部公開するもののみ）
```

## テスト

### ユニットテスト（Vitest）

- テストファイルは `*.test.ts` または `*.test.tsx`
- 実装ファイルの隣に配置（co-location）
- MSW を使用して API モックを作成
- カバレッジ目標: ≥80%

```bash
pnpm test         # すべてのテストを実行
pnpm test:watch   # ウォッチモードで実行
```

#### テスト例

```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E テスト（Playwright）

- E2E テストは `e2e/tests/` ディレクトリに配置
- 主要なユーザーフローをカバー

```bash
pnpm test:e2e       # E2E テストを実行
pnpm test:e2e:ui    # UI モードで実行
```

### Storybook

- UI コンポーネントには Storybook ストーリーを作成
- ストーリーファイルは `*.stories.tsx`
- 実装ファイルの隣に配置

```bash
pnpm storybook  # Storybook を起動
```

### テスト実行のベストプラクティス

1. 機能追加時: 対応するユニットテストを同時に作成
2. バグ修正時: まず失敗するテストを書き、次に修正
3. PR 作成前: すべてのテストが通ることを確認

## コミット規約

このプロジェクトは [Conventional Commits](https://www.conventionalcommits.org/ja/) 規約に従います。

### フォーマット

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの動作に影響しない変更（フォーマット、セミコロンなど）
- `refactor`: バグ修正や機能追加ではないコード変更
- `perf`: パフォーマンス改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

### 例

```bash
feat(auth): Google OAuth ログインを追加

Google OAuth 2.0 を使用した認証フローを実装。
PKCE フローを採用してセキュリティを強化。

Closes #123
```

```bash
fix(ui): Button コンポーネントの disabled スタイルを修正
```

### Commitlint

コミットメッセージは `commitlint` により自動的に検証されます。規約に従わないコミットは拒否されます。

## プルリクエスト

### PR 作成前のチェックリスト

- [ ] すべてのテストが通る（`pnpm test`）
- [ ] 型チェックが通る（`pnpm typecheck`）
- [ ] Lint エラーがない（`pnpm lint`）
- [ ] フォーマットが正しい（`pnpm format`）
- [ ] 新機能にはテストを追加
- [ ] UI・API 仕様や設定を更新した場合は、`README.md` や `docs/` 配下、Storybook の説明を同じ内容に追従させる

### PR テンプレート

PR を作成する際は、以下の情報を含めてください。

```markdown
## 概要

この PR の目的を簡潔に説明

## 変更内容

- 変更点1
- 変更点2

## テスト方法

1. ステップ1
2. ステップ2

## スクリーンショット（UI 変更の場合）

[画像を添付]

## 関連 Issue

Closes #issue_number
```

### レビュープロセス

1. PR を作成すると、自動的に CI が実行される
2. すべての CI チェックが通ることを確認
3. メンテナーがレビューする
4. フィードバックがあれば対応
5. 承認後、マージされる

## よくある質問

### Q: ESLint エラーが多すぎて困っています

A: このプロジェクトは意図的に厳格なルールを採用しています。エディタに ESLint プラグインを導入し、保存時に自動修正されるよう設定することをお勧めします。

### Q: レイヤー境界違反のエラーが出ます

A: `eslint-plugin-boundaries` と `eslint-plugin-strict-dependencies` により、不正な依存関係は検出されます。[アーキテクチャルール](#アーキテクチャルール)を再確認してください。

### Q: テストの書き方がわかりません

A: 既存のテストファイル（`src/ui/button/Button.test.tsx` など）を参考にしてください。また、Vitest と Testing Library のドキュメントも参照してください。

## サポート

質問や問題がある場合は、[GitHub Issues](https://github.com/lc-semba-ryuichiro/demo-practice-semdle/issues) で報告してください。

---

ご協力ありがとうございます。
一緒に素晴らしいプロダクトを作りましょう。
