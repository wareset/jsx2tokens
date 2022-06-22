const { jsx2tokens } = require('../index')

test('Loc and range:', () => {
  expect(jsx2tokens('\nlet num = 12\n', {
    loc  : true,
    range: true
  })).toEqual([
    {
      deep : 0,
      type : 'Space',
      value: '\n',
      loc  : {
        start: { line: 1, column: 0 },
        end  : { line: 2, column: 0 }
      },
      range: [
        0, 1
      ]
    },
    {
      deep : 0,
      type : 'Keyword',
      value: 'let',
      loc  : {
        start: { line: 2, column: 0 },
        end  : { line: 2, column: 3 }
      },
      range: [
        1, 4
      ]
    },
    {
      deep : 0,
      type : 'Space',
      value: ' ',
      loc  : {
        start: { line: 2, column: 3 },
        end  : { line: 2, column: 4 }
      },
      range: [
        4, 5
      ]
    },
    {
      deep : 0,
      type : 'Identifier',
      value: 'num',
      loc  : {
        start: { line: 2, column: 4 },
        end  : { line: 2, column: 7 }
      },
      range: [
        5, 8
      ]
    },
    {
      deep : 0,
      type : 'Space',
      value: ' ',
      loc  : {
        start: { line: 2, column: 7 },
        end  : { line: 2, column: 8 }
      },
      range: [
        8, 9
      ]
    },
    {
      deep : 0,
      type : 'Punctuator',
      value: '=',
      loc  : {
        start: { line: 2, column: 8 },
        end  : { line: 2, column: 9 }
      },
      range: [
        9, 10
      ]
    },
    {
      deep : 0,
      type : 'Space',
      value: ' ',
      loc  : {
        start: { line: 2, column: 9 },
        end  : { line: 2, column: 10 }
      },
      range: [
        10, 11
      ]
    },
    {
      deep : 0,
      type : 'Numeric',
      value: '12',
      loc  : {
        start: { line: 2, column: 10 },
        end  : { line: 2, column: 12 }
      },
      range: [
        11, 13
      ]
    },
    {
      deep : 0,
      type : 'Space',
      value: '\n',
      loc  : {
        start: { line: 2, column: 12 },
        end  : { line: 3, column: 0 }
      },
      range: [
        13, 14
      ]
    }
  ])
})
