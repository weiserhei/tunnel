module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  ignorePatterns: ["/*.js"],
  rules: {},
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
};
