import eslint from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactLint from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

const IGNORED_UNICORN_RULES = {
  "unicorn/filename-case": "off",
  "unicorn/no-null": "off",
  "unicorn/prevent-abbreviations": "off",
  "unicorn/no-nested-ternary": "off",
};

export default tseslint.config(
  {
    ignores: [
      "postcss.config.cjs",
      "/src/vite-env.d.ts",
      "/src/routeTree.gen.ts",
      "dist/*",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...reactLint.configs.flat.recommended,
    settings: {
      react: {
        version: "detect", // Fjerner warning om at React version ikke er satt i eslint-plugin-react
      },
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      eqeqeq: ["error", "always"],
      "react/jsx-key": "error",
      "react/jsx-sort-props": "error",
      "react/react-in-jsx-scope": "off", // Ikke lenger nødvendig i moderne React
      "no-console": "error",
      ...IGNORED_UNICORN_RULES,
    },
  },
  ...pluginQuery.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
);
