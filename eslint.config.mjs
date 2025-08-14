import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 0) Ignore generated & config files
  { ignores: ['dist', 'node_modules', 'eslint.config.*'] },

  // 1) Core JS recommended (applies to everything unless overridden)
  js.configs.recommended,

  // 2) TypeScript syntax-only rules (no type checker) – safe globally
  ...tseslint.configs.recommended,

  // 3) Type-aware rules – ONLY for .ts files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
  },

  // 4) Import hygiene — scoped to TS and with resolvers
  {
    files: ['**/*.ts'],
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'warn',
      'import/no-unresolved': 'off',
    },
  },

  // 5) Disable formatting rules that conflict with Prettier
  eslintConfigPrettier,
];
