// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: [
    'standard',
    'eslint:recommended'
    // "plugin:node/recommended"
  ],
  // // required to lint *.vue files
  plugins: [
    'node'
  ],

  // add your custom rules here
  rules: {
    quotes: [2, 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true
    }],
    'no-empty': 'off',
    // warning var was decleared but not used
    'no-unused-vars': ['warn', { vars: 'all', args: 'none', ignoreRestSiblings: false }],
    // allow async-await
    'generator-star-spacing': 'off',
    'space-before-function-paren': 'off',
    // ignore prefer-const
    'prefer-const': 'off',
    // ignore array-bracket-spacing
    'array-bracket-spacing': 'off',
    // ignore computed-property-spacing
    'computed-property-spacing': 'off',
    // allow debugger during development
    // 'object-curly-newline': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
