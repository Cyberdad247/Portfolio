import js from '@eslint/js';
import globals from 'globals';
import reactRecommended from 'eslint-plugin-react/configs/recommended';
import reactHooksRecommended from 'eslint-plugin-react-hooks';
import jsxA11yRecommended from 'eslint-plugin-jsx-a11y';
import storybookRecommended from 'eslint-plugin-storybook/recommended';
import typescriptParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  reactRecommended,
  {
    plugins: {
      'react-hooks': reactHooksRecommended,
      'jsx-a11y': jsxA11yRecommended
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  },
  storybookRecommended
];