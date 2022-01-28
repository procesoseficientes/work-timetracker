/* eslint-disable no-undef */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'semi': [2, 'never'],
    'prefer-arrow-callback': 1,
    '@typescript-eslint/no-unused-vars': 2
  }
}