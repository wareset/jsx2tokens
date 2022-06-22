const { jsx2tokens } = require('../index')

test('Comments:', () => {
  expect(jsx2tokens('// line')).toEqual([
    { deep: 0, type: 'CommentLine', value: '// line' }
  ])

  expect(jsx2tokens('/** block \n comment */')).toEqual([
    { deep: 0, type: 'CommentBlock', value: '/** block \n comment */' }
  ])

  expect(jsx2tokens('<!--jsx-->')).toEqual([
    { deep: 0, type: 'JSXComment', value: '<!--jsx-->' }
  ])
})
