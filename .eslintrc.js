module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base', 'eslint-config-prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // Enforce the use of double quotes for strings
    quotes: ["error", "double"],
  },
};
