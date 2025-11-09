/* eslint-env node */
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-app-upwards',
      comment: '下位レイヤーから app を参照しない',
      from: { path: '^src/(config|types|db|lib|ui|features)' },
      to: { path: '^src/app' },
    },
    {
      name: 'no-feature-internals',
      comment: 'feature は外部から public API 経由で利用する',
      from: { path: '^src/(app|ui|lib|config|types|db)' },
      to: { path: '^src/features/[^/]+/(components|hooks|lib|types)' },
    },
    {
      name: 'no-client-to-server-lib',
      comment: 'client 向けモジュールから server-only lib への依存は禁止',
      from: { path: '^src/(ui|lib/client)' },
      to: { path: '^src/lib/server' },
    },
    {
      name: 'no-ui-to-feature',
      comment: 'UI キットは feature へ依存しない',
      from: { path: '^src/ui' },
      to: { path: '^src/features' },
    },
    {
      name: 'no-circular',
      comment: '循環依存を許可しない',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    tsConfig: { fileName: './tsconfig.json' },
    includeOnly: '^src',
    doNotFollow: { path: 'node_modules' },
    reporterOptions: {
      dot: {
        theme: {
          graph: {
            splines: 'ortho',
          },
        },
      },
    },
  },
};
