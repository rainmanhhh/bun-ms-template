import antfu from '@antfu/eslint-config'

// noinspection JSUnusedGlobalSymbols
export default antfu({
  formatters: true,
  rules: {
    'style/comma-dangle': 'off',
    'no-console': 'off',
    'style/brace-style': 'off',
    'prefer-arrow-callback': 'off',
    'style/arrow-parens': 'off',
    'style/jsx-one-expression-per-line': 'off',
    'style/jsx-wrap-multilines': 'off',
    'style/jsx-closing-tag-location': 'off',
    'style/jsx-curly-brace-presence': 'off',
    'style/jsx-tag-spacing': 'off',
    'style/jsx-first-prop-new-line': 'off',
    'style/jsx-max-props-per-line': 'off',
    'style/jsx-closing-bracket-location': 'off',
    'antfu/consistent-list-newline': 'off',
  },
}).then(arr => {
  const firstConfigItem = arr[0]
  firstConfigItem.ignores.push(
    'package.json',
    'tsconfig.json',
    'netlify.toml',
    '.vscode/',
    'README.md',
    'src/generated/',
  )
  return arr
})
