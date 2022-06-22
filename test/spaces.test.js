const { jsx2tokens } = require('../index')

test('Spaces:', () => {
  expect(jsx2tokens(' ')).toEqual([
    { deep: 0, type: 'Space', value: ' ' }
  ])

  expect(jsx2tokens(`

  `)).toEqual([
    { deep: 0, type: 'Space', value: '\n\n  ' }
  ])

  expect(jsx2tokens(`
  \n\r\n
  `)).toEqual([
    { deep: 0, type: 'Space', value: '\n  \n\r\n\n  ' }
  ])
})
