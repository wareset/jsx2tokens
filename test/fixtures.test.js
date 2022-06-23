const { jsx2tokens } = require('../index')

const fs = require('fs')
const path = require('path')

const vue = fs.readFileSync(
  path.resolve(__dirname, 'fixtures', 'vue.runtime.common.dev.min.js'), 'utf8'
)

test('VUE:', () => {
  const tokens = jsx2tokens(vue, { useJSX: false })
  expect(tokens[tokens.length - 1].deep).toEqual(0)
})
