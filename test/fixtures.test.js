const { jsx2tokens } = require('../index')

const fs = require('fs')
const path = require('path')

const DIR_FIXTURES = path.resolve(__dirname, 'fixtures')

test('VUE:', () => {
  const vue = fs.readFileSync(
    path.resolve(DIR_FIXTURES, 'vue/vue.runtime.common.dev.min.js'), 'utf8'
  )
  const tokens = jsx2tokens(vue, { useJSX: false })
  expect(tokens[tokens.length - 1].deep).toEqual(0)
})

test('THREE:', () => {
  let tokens
  const three_js = fs.readFileSync(
    path.resolve(DIR_FIXTURES, 'three/three.js'), 'utf8'
  )
  tokens = jsx2tokens(three_js, { useJSX: false })
  expect(tokens[tokens.length - 1].deep).toEqual(0)

  const three_cjs = fs.readFileSync(
    path.resolve(DIR_FIXTURES, 'three/three.cjs'), 'utf8'
  )
  tokens = jsx2tokens(three_cjs, { useJSX: false })
  expect(tokens[tokens.length - 1].deep).toEqual(0)

  const three_module_js = fs.readFileSync(
    path.resolve(DIR_FIXTURES, 'three/three.module.js'), 'utf8'
  )
  tokens = jsx2tokens(three_module_js, { useJSX: false })
  expect(tokens[tokens.length - 1].deep).toEqual(0)

  const three_min_js = fs.readFileSync(
    path.resolve(DIR_FIXTURES, 'three/three.min.js'), 'utf8'
  )
  tokens = jsx2tokens(three_min_js, { useJSX: false })
  expect(tokens[tokens.length - 1].deep).toEqual(0)
})
