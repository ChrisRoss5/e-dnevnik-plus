module.exports = {
  root: true,
  env: {
    node: true,
    webextensions: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    vueFeatures: {
      interpolationAsNonHTML: true,
    },
  },
  ignorePatterns: ["gtag.js", "gtag2.js", "*.d.ts"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "prefer-rest-params": "off",
  },
};
