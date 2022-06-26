setTimeout(() => {}, 1000 * 60 * 60 * 60)

const fs = require('fs')
const path = require('path')
const assert = require('assert')

const DIR_FIXTURES = path.resolve(__dirname, '../test/fixtures')

// const typescript = require('@typescript-eslint/parser').parse
// const typescriptTokenize = (code) => typescript(code, {
//   tokens: true,
//   range : true,
//   loc   : true
// }).tokens

const esprima = require('esprima').tokenize
const esprimaTokenize = (code) => esprima(code, {
  range: true,
  loc  : true
})

const { jsx2tokens, TOKEN_TYPES } = require('../index')
const jsx2tokensTokenize = (code, file, proxy) => jsx2tokens(code, {
  useJSX: !/\.ts$/.test(file),
  range : true,
  loc   : true,
  proxy
}).filter((token) => {
  delete token.deep
  return token.type !== 'Space' && token.type !== 'CommentLine' && token.type !== 'CommentBlock'
})

const compare = (code, file = '') => {
  let my
  const tmp = []
  try {
    my = jsx2tokensTokenize(code, file, (token) => {
      tmp.push(token)
    })
  } catch (e) {
    console.log('CREATE_LOG')
    fs.writeFileSync(path.resolve(__dirname, 'tokens.json'), JSON.stringify(tmp, null, 2))
    throw e
  }
  const ts = esprimaTokenize(code)

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
        switch (myToken.value) {
          case 'await':
          case 'static':
            break
          default:
            assert.deepEqual(tsToken.type, myToken.type, 'TYPE')

        }
      } catch (e) {
        switch (myToken.type) {
          // case TOKEN_TYPES.NULL:
          // case TOKEN_TYPES.BOOLEAN:
          case TOKEN_TYPES.TEMPLATE_HEAD:
          case TOKEN_TYPES.TEMPLATE_MIDDLE:
          case TOKEN_TYPES.TEMPLATE_TAIL:
          // case TOKEN_TYPES.IDENTIFIER:
            break
          // case TOKEN_TYPES.KEYWORD:
          //   console.warn('VALUE')
          //   console.log('TS')
          //   console.log(tsToken)
          //   console.log('MY')
          //   console.log(myToken)
          //   break
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
    console.log('-------------------------------------------------------------')
    throw e
  }
}

// const code = `
// let a = 12
// `
// console.log(typescriptTokenize(code))
// console.log(jsx2tokensTokenize(code))

let start = 0
let count = 0
const start_ = start
const testFilesFromDir = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    if (count < 500) {
      const full = path.resolve(dir, file)
      if (fs.statSync(full).isDirectory() && !/^test/.test(file)) {
        testFilesFromDir(full)
      } else if (/\.[j]sx?$/.test(file) && (!start || !start--)) {
        console.log(start_ + count)
        count++
        console.log(`FIXTURES-COMPARE (${dir}): ${file}`)
        const code = fs.readFileSync(full, 'utf8')
        compare(code, file)
      }
    }
  })
}
testFilesFromDir(DIR_FIXTURES)

// const code = fs.readFileSync(path.resolve(DIR_FIXTURES, 'mathjs/math.js'), 'utf8')

// const code = `
// let a = a.let
// `
// // compare(code)
// console.log(esprima(code, {
//   loc  : true,
//   range: true
// }))
