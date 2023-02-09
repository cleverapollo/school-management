module.exports = {
  extends: require.resolve('@tyro/configs/eslint'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};