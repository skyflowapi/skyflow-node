import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { sourceType: "module" }
    },

    linterOptions: {
      reportUnusedDisableDirectives: "off"
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },

    rules: {
      "camelcase": ["error", { "properties": "never", "ignoreImports": true }]
    }
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      "src/_generated_/",
    ]
  }
];