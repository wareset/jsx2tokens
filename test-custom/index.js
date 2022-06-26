setTimeout(() => {}, 1000 * 60 * 60 * 60)

const { jsx2tokens, TOKEN_TYPES } = require('../index')
const typescript = require('@typescript-eslint/parser').parse
// const babel = require('@babel/parser').parse

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

  if (code.length < 100) {
    console.log('ts', ts)
    console.log('my', my)
  }
  
  let tsToken, myToken
  try {
    // assert.deepEqual(ts.length, my.length, 'LENGTH')
    for (let i = 0; i < ts.length; i++) {
      tsToken = ts[i], myToken = my[i]
      assert.deepEqual(tsToken.value, myToken.value, 'VALUE')
      assert.deepEqual(tsToken.range, myToken.range, 'RANGE')
      assert.deepEqual(tsToken.loc, myToken.loc, 'LOC')
      try {
        if (myToken.value !== 'null') assert.deepEqual(tsToken.type, myToken.type, 'TYPE')
      } catch (e) {
        switch (myToken.type) {
          case TOKEN_TYPES.BOOLEAN:
          case TOKEN_TYPES.TEMPLATE_HEAD:
          case TOKEN_TYPES.TEMPLATE_MIDDLE:
          case TOKEN_TYPES.TEMPLATE_TAIL:
            break
          case TOKEN_TYPES.KEYWORD:
            console.warn('VALUE')
            console.log('TS')
            console.log(tsToken)
            console.log('MY')
            console.log(myToken)
            break
          default:
            throw e
        }
      }
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

let start = 250
let count = 0
const start_ = start
const testFilesFromDir = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    if (count < 50) {
      const full = path.resolve(dir, file)
      if (fs.statSync(full).isDirectory() && !/^test/.test(file)) {
        testFilesFromDir(full)
      } else if (/\.[j]sx?$/.test(file) && (!start || !start--)) {
        console.log(start_ + count)
        count++
        console.log(`FIXTURES-COMPARE (${dir}): ${file}`)
        const code = fs.readFileSync(full, 'utf8')
        compare(code)
      }
    }
  })
}
testFilesFromDir(DIR_FIXTURES)

// const code = fs.readFileSync(path.resolve(DIR_FIXTURES, 'mathjs/math.js'), 'utf8')

// const code = `
// let a = {
//   true: a,
//   await: a,
//   true2: a,
//   urlErrorParamsEnabled: null
// }
// `
// compare(code)

// console.log(babel(code, { tokens: true }).tokens)
