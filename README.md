# jsx2tokens

Tokenizer for js, ts, jsx, tsx

## Base usage:

```js
import { jsx2tokens } from 'jsx2tokens'
// or 
// const { jsx2tokens } = require('jsx2tokens')

const code =
`function App(props) {
  return <div className="container" {...props}>some {12}</div>
}`

const tokens = jsx2tokens(code)

console.log(tokens)
// tokens equal to:
;[
  { deep: 0, type: 'Keyword', value: 'function' },
  { deep: 0, type: 'Space', value: ' ' },
  { deep: 0, type: 'Identifier', value: 'App' },
  { deep: 0, type: 'Punctuator', value: '(' },
  { deep: 1, type: 'Identifier', value: 'props' },
  { deep: 0, type: 'Punctuator', value: ')' },
  { deep: 0, type: 'Space', value: ' ' },
  { deep: 0, type: 'Punctuator', value: '{' },
  { deep: 1, type: 'Space', value: '\n  ' },
  { deep: 1, type: 'Keyword', value: 'return' },
  { deep: 1, type: 'Space', value: ' ' },
  { deep: 1, type: 'JSXTagOpenerStart', value: '<' },
  { deep: 2, type: 'Identifier', value: 'div' },
  { deep: 2, type: 'Space', value: ' ' },
  { deep: 2, type: 'Identifier', value: 'className' },
  { deep: 2, type: 'Punctuator', value: '=' },
  { deep: 2, type: 'String', value: '"container"' },
  { deep: 2, type: 'Space', value: ' ' },
  { deep: 2, type: 'Punctuator', value: '{' },
  { deep: 3, type: 'Punctuator', value: '...' },
  { deep: 3, type: 'Identifier', value: 'props' },
  { deep: 2, type: 'Punctuator', value: '}' },
  { deep: 1, type: 'JSXTagOpenerEnd', value: '>' },
  { deep: 2, type: 'JSXText', value: 'some ' },
  { deep: 2, type: 'JSXExpressionStart', value: '{' },
  { deep: 3, type: 'Numeric', value: '12' },
  { deep: 2, type: 'JSXExpressionEnd', value: '}' },
  { deep: 1, type: 'JSXTagCloserStart', value: '</' },
  { deep: 2, type: 'Identifier', value: 'div' },
  { deep: 1, type: 'JSXTagCloserEnd', value: '>' },
  { deep: 1, type: 'Space', value: '\n' },
  { deep: 0, type: 'Punctuator', value: '}' }
]
```

## Types of tokens:

```js
import { TOKEN_TYPES } from 'jsx2tokens'
// or 
// const { TOKEN_TYPES } = require('jsx2tokens')

console.log(TOKEN_TYPES)
// TOKEN_TYPES equal to:
{
  // Base
  BOOLEAN                     : 'Boolean', // true, false
  IDENTIFIER                  : 'Identifier', // a, b, app...
  KEYWORD                     : 'Keyword', // let, for, return...
  NULL                        : 'Null', // null
  NUMERIC                     : 'Numeric', // 1_000, 0.6e-5, 0x1b...
  PUCNTUATOR                  : 'Punctuator', // +-=!&...
  REGULAR_EXPRESSION          : 'RegularExpression', // /\s+/
  STRING                      : 'String', // 'single', "double"
  TEMPLATE                    : 'Template', // `...`
  TEMPLATE_HEAD               : 'TemplateHead', // `...{
  TEMPLATE_MIDDLE             : 'TemplateMiddle', // }...{
  TEMPLATE_TAIL               : 'TemplateTail', // }...`
  // Comments
  COMMENT_BLOCK               : 'CommentBlock', // /*...*/
  COMMENT_LINE                : 'CommentLine', // //...
  // Separators (' ', '\n', '\t', ' \n\r\n', etc.)
  SPACE                       : 'Space',
  // Modifier "@" - does not exist in the standard jsx
  MODIFIER                    : 'Modifier', // @onclick
  // JSX
  JSX_TAG_OPENER_START        : 'JSXTagOpenerStart', // <
  JSX_TAG_OPENER_END          : 'JSXTagOpenerEnd', // >
  JSX_TAG_OPENER_END_CHILDLESS: 'JSXTagOpenerEndChildless', // />, >*
  // * - for <img>, <meta>... If enable 'considerChildlessTags'
  JSX_TAG_CLOSER_START        : 'JSXTagCloserStart', // </
  JSX_TAG_CLOSER_END          : 'JSXTagCloserEnd', // >
  JSX_EXPRESSION_START        : 'JSXExpressionStart', // {
  JSX_EXPRESSION_END          : 'JSXExpressionEnd', // }
  JSX_TEXT                    : 'JSXText',
  JSX_COMMENT                 : 'JSXComment', // <!--...-->
} 
`
```

## Options

- **loc**: boolean  /** Default: false. Source location */
- **range**: boolean  /** Default: false. Source position */
- **strict**: boolean  /** Default: true. Cause an error if the last "deep" is not equal to 0. */
- **useJSX**: boolean  /** Default: true. Enable\disable search JSX (TSX). */
- **insideJSX**: boolean  /** Default: false. If "true", parsing will start as text JSX (TSX). */
- **skipStyleTags**: boolean  /** Default: false. If "true", the content inside the <style> will only be JSXText. */
- **skipScriptTags**: boolean  /** Default: false. If "true", the content inside the <script> will only be JSXText. */
- **parseScriptTags**: boolean  /** Default: false. If "true", the content inside the <script> will be tokenized. */
- **considerChildlessTags**: boolean /** Default: false. If "true", the <img> and other childless tags will be like <img/>. */
- **proxy**: ((v: TypeToken, k: number, a: TypeToken[], proxyCtx) => boolean | void) /** Default: undefined. Middleware like */
- **proxyCtx**: any /** Default: {}. Advanced context for proxy */

### Loc and range:

```js
import { jsx2tokens } from 'jsx2tokens'

const code = 'a = 12'
const tokens = jsx2tokens(code, {
  loc  : true,
  range: true
})

console.log(tokens)
// tokens equal to:
;[
  {
    deep : 0,
    type : 'Identifier',
    value: 'a',
    loc  : {
      start: { line: 1, column: 0 },
      end  : { line: 1, column: 1 }
    },
    range: [0, 1]
  },
  {
    deep : 0,
    type : 'Space',
    value: ' ',
    loc  : {
      start: { line: 1, column: 1 },
      end  : { line: 1, column: 2 }
    },
    range: [1, 2]
  },
  {
    deep : 0,
    type : 'Punctuator',
    value: '=',
    loc  : {
      start: { line: 1, column: 2 },
      end  : { line: 1, column: 3 }
    },
    range: [2, 3]
  },
  {
    deep : 0,
    type : 'Space',
    value: ' ',
    loc  : {
      start: { line: 1, column: 3 },
      end  : { line: 1, column: 4 }
    },
    range: [3, 4]
  },
  {
    deep : 0,
    type : 'Numeric',
    value: '12',
    loc  : {
      start: { line: 1, column: 4 },
      end  : { line: 1, column: 6 }
    },
    range: [4, 6]
  }
]
```

### strict:

enable:

```js
import { jsx2tokens } from 'jsx2tokens'

const code = '[1, 2'
const tokens = jsx2tokens(code, {
  strict: true, // default
})

// Uncaught Error: jsx2tokens - deep: {"line":1,"column":5,"range":5}
```

disable:

```js
import { jsx2tokens } from 'jsx2tokens'

const code = '[1, 2'
const tokens = jsx2tokens(code, {
  strict: false
})

console.log(tokens)
// tokens equal to:
;[
  { deep: 0, type: 'Punctuator', value: '[' },
  { deep: 1, type: 'Numeric', value: '1' },
  { deep: 1, type: 'Punctuator', value: ',' },
  { deep: 1, type: 'Space', value: ' ' },
  { deep: 1, type: 'Numeric', value: '2' }
]
```

### useJSX:

!If you parse the 'ts' file, errors may occur. Then it is better to disable 'useJSX'

Not valid 'ts':

```js
import { jsx2tokens } from 'jsx2tokens'

const code = 'let a = <T>(a: T) => a'
const tokens = jsx2tokens(code, {
  useJSX: true // default
})
// Uncaught Error: jsx2tokens - deep...
// '<T>' - will be interpreted as JSX elements
```

Valid 'ts':

```js
import { jsx2tokens } from 'jsx2tokens'

const code = 'let a = <T, >(a: T) => a'
const tokens = jsx2tokens(code, {
  useJSX: true // default
})

// or

const code = 'let a = <T>(a: T) => a'
const tokens = jsx2tokens(code, {
  useJSX: false
})
```

### insideJSX:

Allows you to parse templates:

```js
import { jsx2tokens } from 'jsx2tokens'

const code = 'let a = <Some/>'
const tokens = jsx2tokens(code, {
  insideJSX: true
})

console.log(tokens)
// tokens equal to:
;[
  { deep: 0, type: 'JSXText', value: 'let a = ' },
  { deep: 0, type: 'JSXTagOpenerStart', value: '<' },
  { deep: 1, type: 'Identifier', value: 'Some' },
  { deep: 0, type: 'JSXTagOpenerEndChildless', value: '/>' }
]
```

### skipStyleTags

standard behavior:

```js
import { jsx2tokens } from 'jsx2tokens'

const code = '<style>{`body { color: red }`}</style>'
const tokens = jsx2tokens(code, {
  skipStyleTags: false // default
})

console.log(tokens)
// tokens equal to:
;[
  { deep: 0, type: 'JSXTagOpenerStart', value: '<' },
  { deep: 1, type: 'Identifier', value: 'style' },
  { deep: 0, type: 'JSXTagOpenerEnd', value: '>' },
  { deep: 1, type: 'JSXExpressionStart', value: '{' },
  { deep: 2, type: 'Template', value: '`body { color: red }`' },
  { deep: 1, type: 'JSXExpressionEnd', value: '}' },
  { deep: 0, type: 'JSXTagCloserStart', value: '</' },
  { deep: 1, type: 'Identifier', value: 'style' },
  { deep: 0, type: 'JSXTagCloserEnd', value: '>' }
]
```

miss style contents:

```js
import { jsx2tokens } from 'jsx2tokens'

const code = '<style>body { color: red }</style>'
const tokens = jsx2tokens(code, {
  skipStyleTags: true
})

console.log(tokens)
// tokens equal to:
;[
  { deep: 0, type: 'JSXTagOpenerStart', value: '<' },
  { deep: 1, type: 'Identifier', value: 'style' },
  { deep: 0, type: 'JSXTagOpenerEnd', value: '>' },
  { deep: 1, type: 'JSXText', value: 'body { color: red }' },
  { deep: 0, type: 'JSXTagCloserStart', value: '</' },
  { deep: 1, type: 'Identifier', value: 'style' },
  { deep: 0, type: 'JSXTagCloserEnd', value: '>' }
]
```

### skipScriptTags:

works exactly the same as the 'skipStyleTags', but for 'script' tags

### parseScriptTags:

tokenize code inside script tags:

```js
import { jsx2tokens } from 'jsx2tokens'

const code = '<script>console.log(`hello`)</script>'
const tokens = jsx2tokens(code, {
  parseScriptTags: true
})

console.log(tokens)
// tokens equal to:
;[
  { deep: 0, type: 'JSXTagOpenerStart', value: '<' },
  { deep: 1, type: 'Identifier', value: 'script' },
  { deep: 0, type: 'JSXTagOpenerEnd', value: '>' },
  { deep: 1, type: 'Identifier', value: 'console' },
  { deep: 1, type: 'Punctuator', value: '.' },
  { deep: 1, type: 'Identifier', value: 'log' },
  { deep: 1, type: 'Punctuator', value: '(' },
  { deep: 2, type: 'Template', value: '`hello`' },
  { deep: 1, type: 'Punctuator', value: ')' },
  { deep: 0, type: 'JSXTagCloserStart', value: '</' },
  { deep: 1, type: 'Identifier', value: 'script' },
  { deep: 0, type: 'JSXTagCloserEnd', value: '>' }
]
```

### considerChildlessTags:

automatically close childless tags

```js
import { jsx2tokens } from 'jsx2tokens'

const code = '<img src={`q.jpg`}>'
const tokens = jsx2tokens(code, {
  considerChildlessTags: true
})

console.log(tokens)
// tokens equal to:
;[
  { deep: 0, type: 'JSXTagOpenerStart', value: '<' },
  { deep: 1, type: 'Identifier', value: 'img' },
  { deep: 1, type: 'Space', value: ' ' },
  { deep: 1, type: 'Identifier', value: 'src' },
  { deep: 1, type: 'Punctuator', value: '=' },
  { deep: 1, type: 'Punctuator', value: '{' },
  { deep: 2, type: 'Template', value: '`q.jpg`' },
  { deep: 1, type: 'Punctuator', value: '}' },
  { deep: 0, type: 'JSXTagOpenerEndChildless', value: '>' }
]
```

#### Childless tags:

```js
import { CHILDLESS_TAGS } from 'jsx2tokens'
// or 
// const { CHILDLESS_TAGS } = require('jsx2tokens')

console.log(CHILDLESS_TAGS)
// CHILDLESS_TAGS equal to:
{
  area   : true,
  base   : true,
  br     : true,
  col    : true,
  command: true,
  embed  : true,
  hr     : true,
  img    : true,
  input  : true,
  keygen : true,
  link   : true,
  meta   : true,
  param  : true,
  source : true,
  track  : true,
  wbr    : true
} 
`
```

### proxy and proxyCtx

Simple example:

```js
import { jsx2tokens, TOKEN_TYPES } from 'jsx2tokens'

const code = ' some code '

const ctx = { spacesCount: 0 }

const tokens = jsx2tokens(code, {
  proxyCtx: ctx,
  proxy   : (token, _k, tokens, proxyCtx) => {
    if (token.type === TOKEN_TYPES.SPACE) {
      proxyCtx.spacesCount++
      tokens.pop()
    }

    // break if there are more than 10 tokens
    if (tokens.length > 10) return true
  }
})

```

## License

[MIT](LICENSE)
