import globals from 'globals'
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import pluginQuery from '@tanstack/eslint-plugin-query'

const IGNORED_UNICORN_RULES = {
    "unicorn/filename-case": "off",
    "unicorn/no-null": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/no-nested-ternary": "off",
};

const languageOptions = {
    globals: {
        ...globals.node,
    },
    ecmaVersion: 2023,
    sourceType: 'module',
}

export default tseslint.config(
    {
      ignores: ["/src/vite-env.d.ts", "/src/routeTree.gen.ts", "dist/*"]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: globals.builtin,
        },
        plugins: {
            unicorn: eslintPluginUnicorn,
        },
        rules: {
            ...IGNORED_UNICORN_RULES,
            "no-console": "error",
        },
    },
    ...pluginQuery.configs['flat/recommended'],
);
