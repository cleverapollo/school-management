module.exports = {
  extends: ["wesbos"],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ["wesbos/typescript"],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        "react/jsx-no-literals": 1,
        'dot-notation': 'off',
			// note you must disable the base rule as it can report incorrect errors
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "react/jsx-curly-brace-presence": [
          "error",
          { "props": "never", "children": "never" }
        ],
        "react-hooks/exhaustive-deps": "off"
      }
    },
  ],
  rules: {
    "react/jsx-curly-brace-presence": [
      "error",
      { "props": "never", "children": "never" }
    ],
    "react/jsx-no-literals": 1,
    'dot-notation': 'off',
    "react-hooks/exhaustive-deps": "off"
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
      },
    }
  },
};
