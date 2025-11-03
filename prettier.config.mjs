/**
 * @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions}
 */
const config = {
  printWidth: 100,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  checkIgnorePragma: true,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
};

export default config;
