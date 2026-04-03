import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver, flatConfigs as importConfigs } from 'eslint-plugin-import-x';
import securityPlugin from 'eslint-plugin-security';
import { configs as ymlConfigs } from 'eslint-plugin-yml';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

export default defineConfig([
  { ignores: ['coverage/', 'lib/', 'bin/', 'adopter.*'] },
  eslint.configs.all,
  importConfigs.recommended,
  importConfigs.typescript,
  securityPlugin.configs.recommended,
  {
    extends: [ymlConfigs.standard, ymlConfigs.prettier],
    files: ['*.yaml', '*.yml'],
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.node },
      parserOptions: { project: 'tsconfig.json' },
      sourceType: 'module',
    },
    rules: {
      'init-declarations': 'off',
      'max-lines': ['error', { max: 130, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 24, skipBlankLines: true, skipComments: true }],
      'max-statements': ['error', { max: 35 }],
      'no-magic-numbers': ['error', { ignore: [-1, 0, 1, 2] }],
      'no-plusplus': 'off',
      'no-ternary': 'off',
      'no-undefined': 'off',
      'one-var': 'off',
      'sort-imports': 'off',
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver(), createNodeResolver()],
    },
  },
  {
    extends: [...tsConfigs.all],
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': ['error', { ignore: [-1, 0, 1, 2] }],
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
  {
    files: ['**/*.test.*'],
    rules: { '@typescript-eslint/no-floating-promises': 'off' },
  },
  {
    files: ['**/*.test.*', '*.config.@(js|ts)'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'no-magic-numbers': 'off',
      'no-undefined': 'off',
    },
  },
  {
    extends: [tsConfigs.disableTypeChecked],
    files: ['*.config.js'],
  },
  prettier,
]);
