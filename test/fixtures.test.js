const { jsx2tokens } = require('../index')

const fs = require('fs')
const path = require('path')

const DIR_FIXTURES = path.resolve(__dirname, 'fixtures')

fs.readdirSync(DIR_FIXTURES).forEach((dir) => {
  fs.readdirSync(path.resolve(DIR_FIXTURES, dir)).forEach((file) => {
    test('FIXTURES: ' + dir + ' - ' + file, () => {
      const code = fs.readFileSync(path.resolve(DIR_FIXTURES, dir, file), 'utf8')
      const tokens = jsx2tokens(code, { useJSX: false })
      expect(tokens[tokens.length - 1].deep).toEqual(0)
    })
  })
})
