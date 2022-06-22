const { jsx2tokens } = require('../index')

test('Empty:', () => {
  expect(jsx2tokens('')).toEqual([])
})

test('Base:', () => {
  expect(jsx2tokens(
    `// App
function App(props: any) {
  const TXT: string = 'text';

  return (
    <>
      <img src="i.jpg"/>

      <Cmp>
        {TXT} content
      </Cmp>
    </>
  )
}`
  )).toEqual([
    { deep: 0, type: 'CommentLine', value: '// App' },
    { deep: 0, type: 'Space', value: '\n' },
    { deep: 0, type: 'Keyword', value: 'function' },
    { deep: 0, type: 'Space', value: ' ' },
    { deep: 0, type: 'Identifier', value: 'App' },
    { deep: 0, type: 'Punctuator', value: '(' },
    { deep: 1, type: 'Identifier', value: 'props' },
    { deep: 1, type: 'Punctuator', value: ':' },
    { deep: 1, type: 'Space', value: ' ' },
    { deep: 1, type: 'Identifier', value: 'any' },
    { deep: 0, type: 'Punctuator', value: ')' },
    { deep: 0, type: 'Space', value: ' ' },
    { deep: 0, type: 'Punctuator', value: '{' },
    { deep: 1, type: 'Space', value: '\n  ' },
    { deep: 1, type: 'Keyword', value: 'const' },
    { deep: 1, type: 'Space', value: ' ' },
    { deep: 1, type: 'Identifier', value: 'TXT' },
    { deep: 1, type: 'Punctuator', value: ':' },
    { deep: 1, type: 'Space', value: ' ' },
    { deep: 1, type: 'Identifier', value: 'string' },
    { deep: 1, type: 'Space', value: ' ' },
    { deep: 1, type: 'Punctuator', value: '=' },
    { deep: 1, type: 'Space', value: ' ' },
    { deep: 1, type: 'String', value: "'text'" },
    { deep: 1, type: 'Punctuator', value: ';' },
    { deep: 1, type: 'Space', value: '\n\n  ' },
    { deep: 1, type: 'Keyword', value: 'return' },
    { deep: 1, type: 'Space', value: ' ' },
    { deep: 1, type: 'Punctuator', value: '(' },
    { deep: 2, type: 'Space', value: '\n    ' },
    { deep: 2, type: 'JSXTagOpenerStart', value: '<' },
    { deep: 2, type: 'JSXTagOpenerEnd', value: '>' },
    { deep: 3, type: 'JSXText', value: '\n      ' },
    { deep: 3, type: 'JSXTagOpenerStart', value: '<' },
    { deep: 4, type: 'Identifier', value: 'img' },
    { deep: 4, type: 'Space', value: ' ' },
    { deep: 4, type: 'Identifier', value: 'src' },
    { deep: 4, type: 'Punctuator', value: '=' },
    { deep: 4, type: 'String', value: '"i.jpg"' },
    { deep: 3, type: 'JSXTagOpenerEndChildless', value: '/>' },
    { deep: 3, type: 'JSXText', value: '\n\n      ' },
    { deep: 3, type: 'JSXTagOpenerStart', value: '<' },
    { deep: 4, type: 'Identifier', value: 'Cmp' },
    { deep: 3, type: 'JSXTagOpenerEnd', value: '>' },
    { deep: 4, type: 'JSXText', value: '\n        ' },
    { deep: 4, type: 'JSXExpressionStart', value: '{' },
    { deep: 5, type: 'Identifier', value: 'TXT' },
    { deep: 4, type: 'JSXExpressionEnd', value: '}' },
    { deep: 4, type: 'JSXText', value: ' content\n      ' },
    { deep: 3, type: 'JSXTagCloserStart', value: '</' },
    { deep: 4, type: 'Identifier', value: 'Cmp' },
    { deep: 3, type: 'JSXTagCloserEnd', value: '>' },
    { deep: 3, type: 'JSXText', value: '\n    ' },
    { deep: 2, type: 'JSXTagCloserStart', value: '</' },
    { deep: 2, type: 'JSXTagCloserEnd', value: '>' },
    { deep: 2, type: 'Space', value: '\n  ' },
    { deep: 1, type: 'Punctuator', value: ')' },
    { deep: 1, type: 'Space', value: '\n' },
    { deep: 0, type: 'Punctuator', value: '}' }
  ])
})
