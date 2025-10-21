/**
 * Simplified ESLint flat config for this Node + TypeScript project.
 *
 * Scope:
 *  - Lint .js/.cjs/.mjs/.ts files (no JSX/TSX present in the codebase)
 *  - Node + Jest globals
 *  - ESLint core recommended + TypeScript recommended rules
 *  - Disable explicit-module-boundary-types (kept from legacy config)
 */

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // Ignore build artifacts
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Shared language options
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  // Core JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules (flat config form)
  ...tseslint.configs.recommended,

  // Project-specific TS tweaks
  {
    files: ['**/*.ts'],
    rules: {
      // Keep parity with original legacy override
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
