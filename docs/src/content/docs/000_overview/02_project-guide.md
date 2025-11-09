# プロジェクト運用ガイド（Next.js 16 / React 19 / Tailwind / Supabase / SSR on Vercel / Vitest / Storybook / Playwright）

## 原則（破ったらコスト爆増）

- ルーティングは src/app に閉じる。機能実装は src/features の縦切り。
- 共有 UI は src/ui に隔離。機能都合の UI をここへ混ぜるな。
- サーバ/クライアント境界を src/lib/server|client|shared で明示。
- RLS 前提でクエリを書く。service_role で逃げるな。
- Story/Docs/Test は 実装の隣に共置。別置きは仕様ドリフトの温床。

## ディレクトリ構成（確定版: Supabase 対応込み）

```text
.
├─ src/
│  ├─ app/                               # App Router（SSRの入口はここだけ）
│  │  ├─ (marketing)/                    # ルートグループ例: LPなど
│  │  │  └─ page.tsx
│  │  ├─ (app)/                          # ルートグループ例: ログイン後アプリ
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ dashboard/
│  │  │     └─ page.tsx
│  │  ├─ api/                            # Route Handlers（外部公開/Webhook等）
│  │  │  └─ health/route.ts
│  │  ├─ auth/                           # 認証系ルート（例: PKCE コールバックなど）
│  │  │  └─ callback/route.ts
│  │  ├─ globals.css                     # Tailwind のグローバル
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  ├─ global-error.tsx
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  │
│  ├─ features/                          # 機能ごとの縦切り
│  │  ├─ auth/
│  │  │  ├─ components/                  # 機能固有の UI（外に漏らさない）
│  │  │  ├─ hooks/
│  │  │  ├─ lib/                         # Server Actions 等（“use server”）
│  │  │  │  └─ actions.ts
│  │  │  ├─ types.ts
│  │  │  └─ index.ts                     # 外部公開面（集約 export）
│  │  └─ user/
│  │
│  ├─ ui/                                # デザインシステム/共有UI
│  │  └─ button/
│  │     ├─ Button.tsx
│  │     ├─ Button.stories.tsx
│  │     ├─ Button.docs.mdx
│  │     ├─ Button.test.tsx
│  │     └─ index.ts
│  │
│  ├─ lib/
│  │  ├─ server/                         # サーバ専用（Node/Edge 両方を意識）
│  │  │  ├─ supabase.ts                  # SSR 用 Supabase クライアント（Cookie ベース）
│  │  │  ├─ supabase-middleware.ts       # セッション更新ロジック
│  │  │  ├─ admin-supabase.ts            # service_role 用（管理/テスト限定）
│  │  │  ├─ db.ts                        # DB 接続/クエリ共通（RLS 前提の薄いラッパ）
│  │  │  ├─ auth.ts                      # 認可/ユーザー取得ユーティリティ
│  │  │  ├─ cache.ts                     # キャッシュ/再検証方針の窓口
│  │  │  └─ actions/                     # Server Actions（“use server”）
│  │  │     └─ user.ts
│  │  ├─ client/                         # ブラウザ専用
│  │  │  ├─ supabase.ts                  # Browser クライアント（Realtime/OAuth 起点）
│  │  │  └─ analytics.ts
│  │  └─ shared/                         # 共有（isomorphic）
│  │     ├─ fetcher.ts
│  │     └─ schema.ts
│  │
│  ├─ db/
│  │  └─ types/
│  │     └─ supabase.ts                  # supabase gen types の出力先（単一ソース）
│  │
│  ├─ styles/                            # Tailwind 拡張/トークン
│  │  └─ tailwind.css
│  │
│  ├─ hooks/                             # 本当に共有な React hooks だけ
│  ├─ types/                             # 汎用型
│  └─ config/                            # 設定と定数の単一責務置き場
│     ├─ env.ts                          # Zod で環境変数を検証（server/client 切り出し）
│     ├─ routes.ts
│     └─ constants.ts
│
├─ public/                               # 静的アセット
├─ e2e/                                  # Playwright（E2E）
│  ├─ tests/
│  ├─ fixtures/
│  └─ utils/
├─ .storybook/                           # Storybook 設定
│  ├─ main.ts
│  ├─ preview.ts
│  └─ tsconfig.json
├─ tests/                                # 共通テスト基盤（Vitest）
│  ├─ setup/
│  │  ├─ setupTests.ts                   # @testing-library/jest-dom / MSW 起動
│  │  └─ setupDom.ts
│  └─ msw/
│     ├─ handlers.ts
│     ├─ server.ts
│     └─ browser.ts
│
├─ supabase/                             # Supabase CLI 管理一式
│  ├─ migrations/
│  ├─ seed.sql
│  └─ config.toml
│
├─ middleware.ts                         # セッション自動更新（updateSession）
│
├─ next.config.ts
├─ tailwind.config.ts
├─ postcss.config.js
├─ vitest.config.ts
├─ playwright.config.ts
├─ tsconfig.json
├─ tsconfig.test.json
├─ .eslintrc.cjs
├─ .prettierrc
├─ vercel.json                           # 必要なら headers/redirects/regions 等
├─ .env.example
└─ package.json
```

## これから先の進め方（ロードマップ）

### フェーズ 0: 土台（最短で固める・UIは作らない）

- server/client/middleware の Supabase セッション運用を確立（Cookie ベース SSR）。
- src/config/env.ts で環境変数を検証。Vercel/ローカルの差異を即検知。
- App Router の最小レイアウトとエラールート（not-found / global-error）を用意。
- CI の順序を固定: typecheck → lint → unit → build → e2e。

### フェーズ 1: 契約（DB スキーマ / RLS / 型）— 対象は 1 機能だけ

- 1 つの本命ユーザーフローを選定（例: プロフィール閲覧/更新）。
- Supabase migration でテーブル・インデックス・RLS（所有者のみ）を定義し、RLS を常時 ON。
- supabase gen types を回し、src/db/types/supabase.ts を単一の型ソースに。

### フェーズ 2: 薄い縦スライス #1（Tracer Bullet）

- Server Actions/Route Handler: getUser() で認可ガード → RLS 前提で最小の CRUD。
- RSC UI: データ取得はサーバ側。クライアント成分（フォーム等）は最小限に切り出す。
- Storybook: UI 状態（読み込み/成功/エラー）を MSW で固定し、Stories/Docs を隣置き。
- Vitest: 成功/失敗/RLS 403 を MSW で再現。
- Playwright: Admin API でテストユーザーを生成 → Cookie セットで 1 本通す。

### フェーズ 3: 反復（幅を広げる・深さは必要最小）

- 一覧 → 詳細 → 作成 → 更新 → 削除の順に機能を 1 本ずつ縦に通す。
- 各ルートでキャッシュ方針を明示（dynamic / revalidate）。
- 2 本目以降の E2E を追加（壊れやすいところから）。
- 依存方向を守る: ui → features 依存は不可（デザインシステムの一貫性が死ぬ）。

## レイヤ別ガイドライン（要点のみ）

- App Router: ルートはここだけ。認可ガードは サーバ側で行う。
- features/: UI/ロジック/型を機能単位で閉じる。外部公開は index.ts に限定。
- ui/: 汎用コンポーネントとトークンの置き場。機能依存の props を持たせない。
- lib/server: server-only 前提。DB/認可/キャッシュの窓口。service_role は管理/テスト専用。
- lib/client: ブラウザ専用の起点（Realtime/OAuth など）。
- lib/shared: isomorphic な純ロジック。副作用は持たせない。
- config/: env・routes・定数だけ。ビジネスロジックを置かない。
- styles/: Tailwind の追加層/トークン。グローバル汚染を避ける。
- tests/: セットアップと MSW を共通化。実装横の \*.test.ts(x) と使い分ける。
- .storybook/: preview でグローバル CSS と MSW を初期化。Stories/Docs を自動収集。

## SSR / Vercel / Supabase 運用ポリシー

- セッション：middleware で自動更新。Server Components は Cookie を直接書き換えない。
- 認可：サーバ側で getUser() を起点に判定。クライアントの状態を信用しない。
- キャッシュ：認可付きデータはキャッシュ無効または短周期 revalidate。書き込み時は revalidatePath。
- RLS：常時 ON。全クエリは RLS を通す前提で設計。
- ランタイム：重い処理は Node。Edge は軽量・低遅延のみに使う。
- 鍵：SUPABASE_SERVICE_ROLE_KEY は サーバ限定で厳格管理。本番での通常リクエストには使わない。

## テスト戦略（最小で信頼を作り、そこから増やす）

- Unit/Integration（Vitest + RTL + MSW）: Server Actions の分岐（成功/検証エラー/RLS 403）を確実に赤→緑。DB は触らない。
- Storybook: 状態バリエーションを UI 契約として固定。Stories/Docs/Test を共置して乖離を防ぐ。
- E2E（Playwright）: Admin API でテストユーザー作成→Cookie セット→主要フロー 1 本。横展開はその後。

## アンチパターン（ここに落ちたら即戻れ）

- 巨大な components/ / utils/ に投げ込む。
- RLS を OFF にしたまま開発し、最後に付ける。
- REST を量産し、Server Actions/RSC を二の次にする。
- Story/Docs/Test を別置きにして “仕様書” を腐らせる。
- キャッシュ方針を書かずに放置（SSR が不安定化）。

## Definition of Done（縦スライス単位）

- スキーマ/インデックス/RLS が migration に反映されている。
- 型生成が最新で、クエリは Database 型に準拠。
- 入口は Server Action。Route Handler は外部公開や Webhook に限る。
- RSC で取得、必要最小限のみ Client Component。
- Stories/Docs/Test（unit）が隣に存在し、E2E が 1 本通る。
- ルート単位で dynamic / revalidate の方針が明文化されている。

## CI / 運用

- パイプライン順序固定：typecheck → lint → unit → build → e2e。
- 環境変数：本番/プレビュー/ローカルで差分が出たら即失敗させる（env.ts 検証）。
- プレビュー URL で E2E：ローカル依存を減らし、落ち方を安定化。
