import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import securityPlugin from 'eslint-plugin-security';
import ymlPlugin from 'eslint-plugin-yml';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  { ignores: ['coverage/', 'lib/', 'bin/', 'adopter.*'] },
  eslint.configs.all,
  securityPlugin.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.configs.typescript,
  ...ymlPlugin.configs['flat/recommended'],
  ...ymlPlugin.configs['flat/prettier'],
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.node },
      parserOptions: { project: 'tsconfig.json' },
      sourceType: 'module',
    },
    rules: {
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'max-lines': ['error', { max: 130, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 20, skipBlankLines: true, skipComments: true }],
      'max-statements': ['error', { max: 20 }],
      'no-ternary': 'off',
      'no-undefined': 'off',
      'no-useless-assignment': 'off',
      'one-var': 'off',
      'sort-imports': 'off',
    },
    settings: { 'import/resolver': { typescript: {} } },
  },
  {
    extends: [...ts.configs.all],
    files: ['**/*.ts'],
    rules: {
      // eslint-disable-next-line no-magic-numbers
      '@typescript-eslint/no-magic-numbers': ['error', { ignore: [0, 1] }],
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
  {
    files: ['**/*.spec.*'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  prettier,
);
