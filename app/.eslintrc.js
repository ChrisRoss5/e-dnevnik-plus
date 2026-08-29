module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    webextensions: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    vueFeatures: {
      interpolationAsNonHTML: true,
    },
  },
  ignorePatterns: ["gtag.js", "gtag2.js", "*.d.ts", "potvrde.ts"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-unused-expressions": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-reserved-component-names": "off",
    "prefer-rest-params": "off",
  },
};
