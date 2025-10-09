module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['ndla', 'plugin:@typescript-eslint/recommended'],
  env: {
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // project removed
    // tsconfigRootDir removed
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // project removed
        // tsconfigRootDir removed
        sourceType: 'module',
        ecmaVersion: 2020,
      },
      plugins: ['@typescript-eslint'],
      // TS rules inherited from top-level extends
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
  rules: {},
};
