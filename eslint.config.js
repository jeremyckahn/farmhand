import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends('react-app'),
  {
    files: ['src/**/*.{js,jsx,ts,tsx}', 'api-src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      globals: {
        vitest: true,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'import/order': [
        'error',
        { 'newlines-between': 'always-and-inside-groups' },
      ],
      'import/extensions': ['error', 'always'],
      'react/react-in-jsx-scope': ['off'],
      'no-shadow': ['error'],
      '@typescript-eslint/no-unused-vars': 'off',
      'import/no-anonymous-default-export': 'off',
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
    },
  },
]
