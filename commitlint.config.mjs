export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0], // 日本語対応のため無効化
  },
};
