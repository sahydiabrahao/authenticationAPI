module.exports = {
  extends: 'standard-with-typescript',
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
  },
  ignorePatterns: ['node_modules/*', '.vscode/*', 'coverage'],
  files: ['src'],
};
