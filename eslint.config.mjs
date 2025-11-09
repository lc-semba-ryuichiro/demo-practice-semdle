import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import promise from 'eslint-plugin-promise';
import security from 'eslint-plugin-security';
import functional from "eslint-plugin-functional";
import regexp from 'eslint-plugin-regexp';
import boundaries from 'eslint-plugin-boundaries';
import strictDependencies from 'eslint-plugin-strict-dependencies';
import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import nextCore from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import * as tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import tailwindcssCss, { tailwindV4Syntax } from '@poupe/eslint-plugin-tailwindcss';
import prettier from 'eslint-config-prettier';
import eslintComments from 'eslint-plugin-eslint-comments';
import n from 'eslint-plugin-n';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';

export default defineConfig([
  js.configs.recommended,
  ...nextCore,
  ...nextTs,
  ...tseslint.configs.strictTypeChecked.map((config) =>
    config.files ? config : { ...config, files: ['**/*.{ts,tsx,mts,cts}'] },
  ),
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat['jsx-runtime'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['.storybook/*.ts', '.storybook/*.tsx'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      functional.configs.externalTypeScriptRecommended,
      functional.configs.recommended,
      functional.configs.stylistic,
    ],
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'eslint-comments': eslintComments,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      'boundaries': boundaries,
      'strict-dependencies': strictDependencies,
      unicorn,
      promise,
      security,
      regexp,
      functional
    },
    settings: {
      'boundaries/include': ['src/**/*.{ts,tsx,js,jsx}'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**', mode: 'full' },
        { type: 'feature', pattern: 'src/features/**', mode: 'full' },
        { type: 'ui', pattern: 'src/ui/**', mode: 'full' },
        { type: 'lib-server', pattern: 'src/lib/server/**', mode: 'full' },
        { type: 'lib-client', pattern: 'src/lib/client/**', mode: 'full' },
        { type: 'lib-shared', pattern: 'src/lib/shared/**', mode: 'full' },
        { type: 'config', pattern: 'src/config/**', mode: 'full' },
        { type: 'types', pattern: 'src/types/**', mode: 'full' },
        { type: 'db', pattern: 'src/db/**', mode: 'full' },
      ],
    },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      "react-hooks/rules-of-hooks": "error",
      "react/jsx-no-bind": "off",
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'unicorn/prefer-switch': 'error',
      "@typescript-eslint/strict-boolean-expressions": [
        "warn",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false
        }
      ],
      '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
          skipCompoundAssignments: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: false,
          allowRegExp: false,
          allowAny: false,
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
          allowAny: false,
          allowNever: false,
          allowNullish: false,
          allowRegExp: false
        }
      ],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      "@typescript-eslint/no-unsafe-type-assertion": "error",
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/unified-signatures': 'off',
      "@typescript-eslint/method-signature-style": "error",
      "no-implicit-coercion": "error",
      "prefer-template": "error",
      "no-restricted-globals": [
        "error",
        { "name": "isFinite", "message": "Use Number.isFinite instead." },
        { "name": "isNaN", "message": "Use Number.isNaN instead." }
      ],

      // import 規律（循環/重複/順序/外部）
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.{test,spec}.{ts,tsx}',
            '**/*.stories.{ts,tsx}',
            '*.config.{js,ts}',
            'scripts/**',
            'tests/**/*.{js,ts,jsx,tsx}',
            'e2e/**/*.{js,ts,jsx,tsx}',
          ],
        },
      ],
      'import/no-relative-packages': 'error',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message: 'feature の内部には public API (index.ts) 経由でアクセスしてください。',
              allowTypeImports: true,
            },
          ],
        },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/config',
              from: './src/app',
              message: 'app 層の実装を config 層で参照することはできません。',
            },
            {
              target: './src/types',
              from: './src/app',
              message: 'app 層の実装を types 層で参照することはできません。',
            },
            {
              target: './src/db',
              from: './src/app',
              message: 'app 層の実装を db 層で参照することはできません。',
            },
            {
              target: './src/lib',
              from: './src/app',
              message: 'lib 層から app 層への逆依存は禁止です。',
            },
            {
              target: './src/ui',
              from: './src/app',
              message: 'ui 層から app 層への逆依存は禁止です。',
            },
            {
              target: './src/features',
              from: './src/app',
              message: 'feature 層から app 層への逆依存は禁止です。',
            },
            {
              target: './src/ui',
              from: './src/features',
              message: 'UI コンポーネントから feature 層への依存は禁止です。',
            },
            {
              target: './src/lib/client',
              from: './src/lib/server',
              message: 'client 向けライブラリから server-only ライブラリを参照できません。',
            },
          ],
        },
      ],
      'import/order': 'off',
      'simple-import-sort/exports': 'error',

      // コメント悪用の禁止
      'eslint-comments/no-unused-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'error',

      // Promise/非同期
      'promise/no-multiple-resolved': 'error',
      'promise/no-return-wrap': 'error',

      // バグ寄与の高い領域
      'regexp/no-super-linear-backtracking': 'error',
      'regexp/confusing-quantifier': 'error',
      'security/detect-object-injection': 'off', // TS では誤検知が多い

      // 不要 import/変数の自動除去（TS の noUnusedLocals を補完）
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // functional plugin からのルール追加
      "functional/no-let": [
        "error",
        {
          "allowInForLoopInit": true,
          "allowInFunctions": false,
          "ignoreIdentifierPattern": ["^mut_", "^_mut_", "^#mut_"]
        }
      ],
      "functional/immutable-data": [
        "error",
        {
          "ignoreClasses": true,
          "ignoreImmediateMutation": true,
          "ignoreMapsAndSets": true,
          "ignoreIdentifierPattern": [
            "^draft", // allow immer.js draft object
            "^mut_",
            "^_mut_",
            "^#mut_", // private class field
            "window.location.href"
          ],
          "ignoreAccessorPattern": [
            "**.current.**", // allow React Ref object
            "**.displayName", // allow React component displayName
            "**.scrollTop" // allow modifying scrollTop
          ]
        }
      ],
      // Next.js/React の標準 API では props なし/副作用ありの関数が多いため過剰制約を解除
      'functional/functional-parameters': 'off', // page.tsx などの引数なしエントリを許可
      'functional/prefer-immutable-types': 'off', // React props を ReadonlyDeep に強制しない
      'functional/no-return-void': 'off', // イベントハンドラやエラーバウンダリの void 戻りを許可
      'functional/no-expression-statements': 'off', // useEffect 内の副作用を許容
      'functional/no-conditional-statements': 'off', // 環境分岐を禁止しない
      'functional/prefer-tacit': 'off', // イベントハンドラで明示的な関数引数を許可
      'functional/no-throw-statements': 'off', // サーバーサイドでのフェイルファストを許可

      'boundaries/no-unknown': 'error',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          message: 'レイヤー順序を守ってください。',
          rules: [
            {
              from: ['app'],
              allow: ['app', 'feature', 'ui', 'lib-client', 'lib-server', 'lib-shared', 'config', 'types', 'db'],
            },
            {
              from: ['feature'],
              allow: ['feature', 'ui', 'lib-client', 'lib-server', 'lib-shared', 'config', 'types', 'db'],
            },
            {
              from: ['ui'],
              allow: ['ui', 'lib-client', 'lib-shared', 'config', 'types'],
            },
            {
              from: ['lib-client'],
              allow: ['lib-client', 'lib-shared', 'config', 'types', 'db'],
            },
            {
              from: ['lib-server'],
              allow: ['lib-server', 'lib-shared', 'config', 'types', 'db'],
            },
            {
              from: ['lib-shared'],
              allow: ['lib-shared', 'config', 'types'],
            },
            {
              from: ['config'],
              allow: ['config', 'types'],
            },
            {
              from: ['types'],
              allow: ['types', 'db'],
            },
            {
              from: ['db'],
              allow: ['db', 'config', 'types'],
            },
          ],
        },
      ],
      'strict-dependencies/strict-dependencies': [
        'error',
        [
          {
            module: 'src/app',
            allowReferenceFrom: ['src/app', '.storybook'],
            allowSameModule: true,
          },
          {
            module: 'src/features',
            allowReferenceFrom: ['src/app', 'src/features', '.storybook', 'tests', 'e2e'],
            allowSameModule: true,
          },
          {
            module: 'src/ui',
            allowReferenceFrom: ['src/app', 'src/features', 'src/ui', '.storybook', 'tests', 'e2e'],
            allowSameModule: true,
          },
          {
            module: 'src/lib/server',
            allowReferenceFrom: ['src/app', 'src/features', 'src/lib/server', 'middleware.ts'],
            allowSameModule: true,
          },
          {
            module: 'src/lib/client',
            allowReferenceFrom: ['src/app', 'src/features', 'src/ui', 'src/lib/client', '.storybook', 'tests', 'e2e'],
            allowSameModule: true,
          },
          {
            module: 'src/lib/shared',
            allowReferenceFrom: [
              'src/app',
              'src/features',
              'src/ui',
              'src/lib/client',
              'src/lib/server',
              'src/lib/shared',
              '.storybook',
              'tests',
              'e2e',
            ],
            allowSameModule: true,
          },
        ],
        {
          resolveRelativeImport: true,
        },
      ],

      // React Fast Refresh/Compiler と相性の良い制約
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'metadata',
            'viewport',
            'generateMetadata',
            'generateStaticParams',
            'dynamic',
            'dynamicParams',
            'revalidate',
            'fetchCache',
            'runtime',
            'preferredRegion',
            'maxDuration',
          ],
        },
      ],
    },
  },
  // default export 禁止（Next の必須ファイルは除外）
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: { import: importPlugin },
    rules: { 'import/no-default-export': 'error' },
  },
  {
    files: [
      '{app,src/app}/**/{layout,page,template,route,default,loading,error,global-error,not-found}.tsx',
      '{app,src/app}/**/{sitemap,robots}.ts',
      'middleware.ts',
      'next.config.{js,ts}',
      '.storybook/**/*.{ts,tsx}',
      '**/*.stories.{ts,tsx,mdx}',
      '**/*.d.ts',
      'playwright.config.{js,ts}',
      'vitest.config.{js,ts}',
    ],
    plugins: { import: importPlugin },
    rules: { 'import/no-default-export': 'off' },
  },

  // --- Node 実行ファイル（config/scripts） ---
  {
    files: ['**/*.{config,conf,rc}.{js,ts,mjs,cjs}', 'scripts/**/*.{js,ts}'],
    plugins: { n, 'eslint-comments': eslintComments },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'n/no-missing-import': 'error',
      'n/no-extraneous-import': 'error',
      'n/no-process-exit': 'error',
      'eslint-comments/no-unused-disable': 'error',
    },
  },
  {
    files: ['tests/setup/**/*.{ts,tsx}'],
    rules: {
      // Polyfill 追加などテスト環境のみで必要な破壊的更新を許容
      'functional/immutable-data': 'off',
    },
  },
  {
    files: ['src/app/**/*.css'],
    plugins: {
      tailwindcss: tailwindcssCss,
    },
    language: 'tailwindcss/css',
    languageOptions: {
      customSyntax: tailwindV4Syntax,
      tolerant: true,
    },
    rules: {
      ...tailwindcssCss.configs.strict.rules,
      'no-irregular-whitespace': 'off',
      'tailwindcss/consistent-spacing': 'off',
      'tailwindcss/no-invalid-at-rules': [
        'error',
        {
          ignoreAtRules: ['custom-variant'],
        },
      ],
      'tailwindcss/use-baseline': [
        'error',
        {
          strictness: 'newly',
          ignore: ['@layer', ':is', 'is'],
        },
      ],
      'tailwindcss/use-layers': [
        'error',
        {
          requireImportLayers: false,
        },
      ],
    },
  },
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'types/routes.d.ts',
    'types/.next/**',
    'node_modules/**',
    'storybook-static/**',
    'coverage/**',
    'dist/**',
  ]),
]);
