const { jsx2tokens } = require('../index')
const typescript = require('@typescript-eslint/parser').parse

const fs = require('fs')
const path = require('path')
const assert = require('assert')

const DIR_FIXTURES = path.resolve(__dirname, '../test/fixtures')

const jsx2tokensTokenize = (code) => jsx2tokens(code, {
  useJSX: false,
  range : true,
  loc   : true
}).filter((token) => {
  delete token.deep
  return token.type !== 'Space' && token.type !== 'CommentLine' && token.type !== 'CommentBlock'
})

const typescriptTokenize = (code) => typescript(code, {
  tokens: true,
  range : true,
  loc   : true
}).tokens

const compare = (code) => {
  const ts = typescriptTokenize(code)
  const my = jsx2tokensTokenize(code)
  
  let tsToken, myToken
  try {
    // assert.deepEqual(ts.length, my.length, 'LENGTH')
    for (let i = 0; i < ts.length; i++) {
      tsToken = ts[i], myToken = my[i]
      assert.deepEqual(tsToken.value, myToken.value, 'VALUE')
      assert.deepEqual(tsToken.range, myToken.range, 'RANGE')
      assert.deepEqual(tsToken.loc, myToken.loc, 'LOC')
      if (myToken.value !== 'null') assert.deepEqual(tsToken.type, myToken.type, 'TYPE')
    }
    console.log('OK')
  } catch (e) {
    console.log('TS')
    console.log(tsToken)
    console.log('MY')
    console.log(myToken)
    console.log('---------------------------------------------------------------')
    throw e
  }
}

// const code = `
// let a = 12
// `
// console.log(typescriptTokenize(code))
// console.log(jsx2tokensTokenize(code))

// const testFilesFromDir = (dir) => {
//   fs.readdirSync(dir).forEach((file) => {
//     const full = path.resolve(dir, file)
//     if (fs.statSync(full).isDirectory() && !/^src|test/.test(file)) {
//       testFilesFromDir(full)
//     } else if (/\.[jt]sx?$/.test(file)) {
//       console.log(`FIXTURES-COMPARE (${dir}): ${file}`)
//       const code = fs.readFileSync(full, 'utf8')
//       compare(code)
//     }
//   })
// }
// testFilesFromDir(DIR_FIXTURES)

const code = fs.readFileSync(path.resolve(DIR_FIXTURES, 'mathjs/math.js'), 'utf8')
compare(code)
