/** @type {import("stylelint").Config} */
const config = {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  plugins: [
    'stylelint-high-performance-animation',
    'stylelint-no-unsupported-browser-features',
    'stylelint-declaration-strict-value',
  ],
  rules: {
    'plugin/no-low-performance-animation-properties': [true],
    'plugin/no-unsupported-browser-features': [
      true,
      {
        browsers: [
          'last 2 Chrome versions',
          'last 2 Edge versions',
          'last 2 Safari versions',
          'last 2 ios_saf versions',
          'last 2 chromeandroid versions',
        ],
        ignorePartialSupport: true,
        severity: 'warning',
      },
    ],
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'font-size', 'z-index'],
      { ignoreValues: ['inherit', 'transparent', 'currentColor'] },
    ],
  },
};

export default config;
