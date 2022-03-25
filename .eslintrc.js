module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [1, { printWidth: 80 }],
    '@typescript-eslint/semi': 'warn',
    curly: 'warn',
    eqeqeq: 'warn',
    'no-throw-literal': 'warn',
    semi: 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'off',
    'array-callback-return': 'off',
    'import/no-extraneous-dependencies': 'off',
    'consistent-return': 'off',
    'no-use-before-define': 'off',
    'no-empty': 'off',
    camelcase: 'off',
    'no-undef': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'no-new-func': 'off',
    'prefer-destructuring': 'off',
    'no-plusplus': 'off',
    'func-names': 'off',
    'no-fallthrough': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'no-unused-expressions': 'off',
    'max-len': 'off',
  },
};
