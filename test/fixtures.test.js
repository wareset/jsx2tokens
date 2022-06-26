const { jsx2tokens } = require('../index')

const fs = require('fs')
const path = require('path')

const DIR_FIXTURES = path.resolve(__dirname, 'fixtures')

const testFilesFromDir = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const full = path.resolve(dir, file)
    if (fs.statSync(full).isDirectory() && !/test/.test(file)) {
      testFilesFromDir(full)
    } else if (/\.[jt]sx?$/.test(file)) {
      test(`FIXTURES (${dir}): ${file}`, () => {
        const code = fs.readFileSync(full, 'utf8')
        const tokens = jsx2tokens(code, { useJSX: /x$/.test(file) })
        expect(tokens[tokens.length - 1].deep).toEqual(0)
      })
    }
  })
}

testFilesFromDir(DIR_FIXTURES)
