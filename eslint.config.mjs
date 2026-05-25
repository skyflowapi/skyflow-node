import tseslint from 'typescript-eslint';
export default tseslint.config(

  {
    files: ["**/*.{js,mjs,cjs,ts}"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectSource: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
    },

     linterOptions: {
      reportUnusedDisableDirectives: "off"
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "camelcase": ["error", { "properties": "never", "ignoreImports": true }],
      "dot-notation": "off",
      "no-restricted-syntax": [
        "error",
        {
          // Bans obj['key'] in favor of obj.key
          selector: "MemberExpression[computed=true] > Literal[value=/./]",
          message: "Do not use string literals for object access. Use dot notation (obj.prop) or constants.",
        },
        {
          // Bans comparison against magic strings, excluding type names
          selector: "BinaryExpression[operator=/^(==|===|!=|!==)$/] > Literal[value=/^(?!(string|number|boolean|object|undefined|{})$).+/]",
          message: "Do not compare against magic strings. Use constants instead."
        }
      ],
    },

  }
  ,
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      "lib/",
      "src/ _generated_/",
      "test/**",
      "samples/**",
      "scripts/**",
    ]
  }
);