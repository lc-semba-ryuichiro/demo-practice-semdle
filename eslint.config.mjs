import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import nextCore from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import * as tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import tailwindcssCss, { tailwindV4Syntax } from '@poupe/eslint-plugin-tailwindcss';
import prettier from 'eslint-config-prettier';

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
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['.storybook/*.ts', '.storybook/*.tsx'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/unified-signatures': 'off',
    },
  },
  {
    files: ['**/*.config.{js,cjs,mjs,ts}'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
  {
    files: ['app/**/*.css'],
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
    'node_modules/**',
    'storybook-static/**',
    'stories/**',
    'coverage/**',
    'dist/**'
  ]),
]);
