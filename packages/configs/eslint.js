module.exports = {
  extends: ["wesbos"],
  plugins: ["@tanstack/query"],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ["wesbos/typescript"],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        'dot-notation': 'off',
        // note you must disable the base rule as it can report incorrect errors
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "react/jsx-curly-brace-presence": [
          "error",
          {"props": "never", "children": "never"}
        ],
        "react-hooks/exhaustive-deps": "off",
        "@typescript-eslint/no-throw-literal": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        'camelcase': 'off',
      }
    },
  ],
  rules: {
    "react/jsx-curly-brace-presence": [
      "error",
      {"props": "never", "children": "never"}
    ],
    'dot-notation': 'off',
    "react-hooks/exhaustive-deps": "off",
    "@tanstack/query/prefer-query-object-syntax": "error",
    'camelcase': 'off',
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx", ".svg"],
      },
    }
  },
};
