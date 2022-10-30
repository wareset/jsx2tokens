/* eslint-disable no-control-regex */
/*
@Types
--------------------------------------------------------------------------------
*/
export declare type TypeRange = [number, number]

export declare type TypeSourcePosition = {
  line: number
  column: number
}
export declare type TypeSourceLocation = {
  start: TypeSourcePosition
  end: TypeSourcePosition
}

export declare type TypeTokenType = typeof TYPES[keyof typeof TYPES]

export declare type TypeToken = {
  deep: number
  type: TypeTokenType
  value: string
  range?: TypeRange
  loc?: TypeSourceLocation
}

declare type TypeJscTokenizeCallback =
  <C extends object>(v: TypeToken, k: number, a: TypeToken[], ctx: C) => boolean | void

/*
TYPES
--------------------------------------------------------------------------------
*/
const TYPES = {
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
} as const

export { TYPES as TOKEN_TYPES }

/*
CHILDLESS_TAGS
--------------------------------------------------------------------------------
*/
export const CHILDLESS_TAGS = {
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

/*
jsx2tokens
--------------------------------------------------------------------------------
*/
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const jsx2tokens = (() => {
  const isChildlessTagName = (s: string): boolean => (CHILDLESS_TAGS as any)[s] === true

  const isMaybeRegexp = (
    token: TypeToken | null, token2: TypeToken | null,
    token3: TypeToken | null, token4: TypeToken | null
  ): boolean =>
    !token ||
  token.type === TYPES.MODIFIER ||
  token.type === TYPES.JSX_EXPRESSION_START ||
  token.type === TYPES.KEYWORD && (!token2 || token2.value !== '.') ||
  token.value === '!' && isMaybeRegexp(token2, token3, token4, null) ||
  token.type === TYPES.PUCNTUATOR && !/^(?:--|\+\+|[!.})\]])$/.test(token.value)

  const isMaybeTag = isMaybeRegexp

  const isTSGeneric = (s: string, idx: number): boolean => {
    for (let q = false, q2 = false, i = idx + 1; i < s.length; i++) {
      if (q2 || (q2 = !/\s/.test(s[i]))) {
        if (s[i] === ',' || s[i] === '=') return true
        if (!q && (s[i] === '-' || s[i] === '>')) return false
        if (/\s/.test(s[i])) q = true
        else if (q) return /^extends\s$/.test(s.slice(i, i + 8))
      // if (!/[\s\w]/.test(s[i])) break
      }
    }
    return false
  }

  // ---------------------------------------------------------------------------

  type TypeIam = {
    readonly source: string
    isBreakLoop: boolean
    readonly proxy: TypeJscTokenizeCallback | undefined
    readonly proxyCtx: any
    readonly loc: boolean
    readonly range: boolean
    readonly useJSX: boolean
    readonly skipStyleTags: boolean
    readonly skipScriptTags: boolean
    readonly parseScriptTags: boolean
    readonly considerChildlessTags: boolean
    readonly tokens: TypeToken[]
    tokenLast: TypeToken | null
    tl2: TypeToken | null
    tl3: TypeToken | null
    tl4: TypeToken | null
    tagNameLast: string
    idx: number
    line: number
    lineStart: number
    deep: number
    columnDiff: number
    rangeStart: number
    columnStart: number
    ENV: string | string[]
    readonly __env__: (string | string[])[]
  }

  const ERROR = (iam: TypeIam, ...a: any): never => {
    throw new Error('jsx2tokens - ' + a.join(' ') + ': ' +
    JSON.stringify({ value: iam.source.slice(iam.rangeStart, iam.idx + 1), line: iam.lineStart, column: iam.columnStart, range: iam.rangeStart }))
  }

  const char = (iam: TypeIam, offset: number): string => iam.source.charAt(iam.idx + offset)
  const plusLine = (iam: TypeIam, force: boolean): void => {
    if (force || char(iam, 1) !== '\u000A') iam.line++, iam.columnDiff = iam.idx + 1
  }

  const runCallback = (iam: TypeIam): void => {
    if (iam.proxy) {
      iam.isBreakLoop = !!iam.proxy(iam.tokenLast!, iam.tokens.length - 1, iam.tokens, iam.proxyCtx)
    }
  }

  // ---------------------------------------------------------------------------

  // let ENV: string | string[]
  // let __env__: (string | string[])[]
  const env = (iam: TypeIam, _type?: string | string[] | null): string | string[] => {
    if (_type === null) iam.__env__.pop()
    else _type && iam.__env__.push(_type)
    return iam.ENV = iam.__env__[iam.__env__.length - 1] || ''
  }

  // ---------------------------------------------------------------------------

  const saveToken = (iam: TypeIam, _type: TypeTokenType): void => {
    iam.tl4 = iam.tl3
    iam.tl3 = iam.tl2
    iam.tl2 = iam.tokenLast
    iam.tokenLast = {
      deep : iam.deep,
      type : _type,
      value: iam.source.slice(iam.rangeStart, iam.idx + 1),
      // range: [iam.rangeStart, iam.rangeStart = iam.idx + 1],
      // loc  : {
      //   start: { line: iam.lineStart, column: iam.columnStart },
      //   end  : { line: iam.line, column: iam.columnStart = iam.idx - iam.columnDiff + 1 }
      // }
    }

    const range = [iam.rangeStart, iam.rangeStart = iam.idx + 1]
    const loc = {
      start: { line: iam.lineStart, column: iam.columnStart },
      end  : { line: iam.line, column: iam.columnStart = iam.idx - iam.columnDiff + 1 }
    }

    if (iam.loc) iam.tokenLast.loc = loc as any
    if (iam.range) iam.tokenLast.range = range as any

    iam.tokens.push(iam.tokenLast)
  }

  const initToken = (iam: TypeIam): boolean => {
    if (iam.rangeStart < iam.idx) {
      iam.idx--
      const tokenLastTmp = iam.tokenLast
      saveToken(iam, TYPES.SPACE)
      if (tokenLastTmp && tokenLastTmp.deep > iam.tokenLast!.deep) {
        iam.tokenLast!.deep = tokenLastTmp.deep
      }
      runCallback(iam)
      iam.tokenLast = tokenLastTmp
      iam.idx++
    }
    iam.rangeStart = iam.idx
    iam.lineStart = iam.line
    iam.columnStart = iam.idx - iam.columnDiff
    return !iam.isBreakLoop
  }

  const createPunctuator = (iam: TypeIam, offset: number, type: TypeTokenType = TYPES.PUCNTUATOR): void => {
    if (initToken(iam)) {
    // const tokenLastTmp = tokenLast
      if (offset) iam.idx += offset
      tagNameLast(iam)
      saveToken(iam, type)

      // if (tokenLastTmp && /^[:]$/.test(tokenLast!.value)) {
      //   if (tokenLastTmp.type === TYPES.KEYWORD) tokenLastTmp.type = TYPES.IDENTIFIER
      // }
      runCallback(iam)
    }
  }

  const tagNameLast = (iam: TypeIam): void => {
    if (iam.tokenLast && iam.tokenLast.type === TYPES.JSX_TAG_OPENER_START) {
      iam.tagNameLast = iam.source.slice(iam.rangeStart, iam.idx + 1)
    }
  }

  // ---------------------------------------------------------------------------

  const CASE_IDENTIFIER = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let ch0 = ''
  
      for (;;) {
        iam.idx++
        if (/^[-+'"`{}()[\]:,~:?<=>^%!*&|./\u000D\u000A\u2028\u2029\u0009\u000B\u000C\u0020\u00A0\uFEFF\u1680\u180e\u2000-\u2009\u200A\u202F\u205F\u3000]?$/.test(char(iam, 0))) {
          iam.idx--
          break
        }
      }
      tagNameLast(iam)
      // const tokenLastTmp = iam.tokenLast
      saveToken(iam, TYPES.IDENTIFIER)
      const token = iam.tokenLast!
      const value = token.value

      token.type =
        value === 'null'
          ? TYPES.NULL
          : /^(?:true|false)$/.test(value)
            ? TYPES.BOOLEAN
            : /^(?:let|static|implements|interface|package|private|protected|public|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|import|in|instanceof|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield)$/.test(value)
              ? TYPES.KEYWORD
              : value.indexOf('@') > -1
                ? TYPES.MODIFIER
                : token.type

      runCallback(iam)
    }
  }

  const CASE_COMMENT_LINE = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let ch0: string
  
      iam.idx++
      for (;;) {
        iam.idx++
        if (/^[\u000D\u000A\u2028\u2029]?$/.test(char(iam, 0))) {
          iam.idx--
          break
        }
      }
      const tokenLastTmp = iam.tokenLast
      saveToken(iam, TYPES.COMMENT_LINE)
      runCallback(iam)
      iam.tokenLast = tokenLastTmp
    }
  }
  
  const CASE_COMMENT_BLOCK = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let ch0: string
  
      iam.idx++
      for (;;) {
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '') {
          ERROR(iam, TYPES.COMMENT_BLOCK)
        } else if (ch0 === '\u000D') {
          plusLine(iam, false)
        } else if (/^[\u000A\u2028\u2029]$/.test(ch0)) {
          plusLine(iam, true)
        } else if (ch0 === '*') {
          if (char(iam, 1) === '/') {
            iam.idx++
            break
          }
        }
      }
      const tokenLastTmp = iam.tokenLast
      saveToken(iam, TYPES.COMMENT_BLOCK)
      runCallback(iam)
      iam.tokenLast = tokenLastTmp
    }
  }
  
  const CASE_STRING = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let ch0: string
      let slashed = 0
  
      for (;;) {
        if (slashed) slashed--
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '') {
          ERROR(iam, TYPES.STRING)
        } else if (ch0 === '\\') {
          if (!slashed) slashed = 2
        } else if (ch0 === '"' || ch0 === '\'') {
          if (!slashed && ch0 === iam.source[iam.rangeStart]) break
        }
      }
      saveToken(iam, TYPES.STRING)
      runCallback(iam)
    }
  }
  
  const CASE_TEMPLATE = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let ch0: string
      let slashed = 0
      let needDeepPlus = false

      for (;;) {
        if (slashed) slashed--
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '') {
          ERROR(iam, TYPES.TEMPLATE)
        } else if (ch0 === '\u000D') {
          plusLine(iam, false)
        } else if (/^[\u000A\u2028\u2029]$/.test(ch0)) {
          plusLine(iam, true)
        } else if (ch0 === '\\') {
          if (!slashed) slashed = 2
        } else if (ch0 === '`') {
          if (!slashed) {
            env(iam, null)
            break
          }
        } else if (ch0 === '$') {
          if (!slashed && char(iam, 1) === '{') {
            iam.idx++
            needDeepPlus = true
            break
          }
        }
      }
      saveToken(iam, TYPES.TEMPLATE)
      if (needDeepPlus) iam.deep++

      const token = iam.tokenLast!
      const first = token.value[0]
      const last = token.value[token.value.length - 1]
      if (first === '`') {
        if (last !== '`') token.type = TYPES.TEMPLATE_HEAD
      } else {
        token.type = last !== '`' ? TYPES.TEMPLATE_MIDDLE : TYPES.TEMPLATE_TAIL
      }
      runCallback(iam)
    }
  }
  
  const CASE_REGULAR_EXPRESSION = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let rxD = 0
      let ch0: string
      let slashed = 0
  
      LOOP: for (;;) {
        if (slashed) slashed--
        iam.idx++
        ch0 = char(iam, 0)
        if (/^[\u000D\u000A\u2028\u2029]?$/.test(ch0)) {
          ERROR(iam, TYPES.REGULAR_EXPRESSION)
        } else if (ch0 === '\\') {
          if (!slashed) slashed = 2
        } else if (ch0 === '[') {
          if (!slashed) rxD = 1
        } else if (ch0 === ']') {
          if (!slashed) rxD = 0
        } else if (ch0 === '/') {
          if (!slashed && !rxD) {
            for (;;) {
              iam.idx++
              if (!/\w/.test(char(iam, 0))) {
                iam.idx--
                break LOOP
              }
            }
          }
        }
      }
      saveToken(iam, TYPES.REGULAR_EXPRESSION)
      runCallback(iam)
    }
  }

  const CASE_NUMERIC = (iam: TypeIam, nD: number, nE: number, nS: number): void => {
    if (initToken(iam)) {
      let ch0: string
  
      iam.idx += nS
      for (;;) {
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '_') {
          if (nS) ERROR(iam, TYPES.NUMERIC)
          nS = 1
        } else if (ch0 === '.') {
          if (nD !== 1 && nS) ERROR(iam, TYPES.NUMERIC)
          if (nD || nE) {
            iam.idx--
            break
          }
          nD = 1
          nS = 1
        } else if (ch0 === 'e' || ch0 === 'E') {
          if (nE || nS) ERROR(iam, TYPES.NUMERIC)
          nE = 1
          nS = 1
        } else if (ch0 === '+' || ch0 === '-') {
          if (nE !== 1) {
            iam.idx--
            break
          }
          nE = 2
        } else if (/^\d$/.test(ch0)) {
          if (nE === 1) nE = 2
          if (nD === 1) nD = 2
          nS = 0
        } else {
          if (ch0 !== 'n') iam.idx--
          if (nS) ERROR(iam, TYPES.NUMERIC)
          break
        }
      }
      saveToken(iam, TYPES.NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_NUMERIC_B = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let nS = 1
      let ch0: string

      iam.idx++
      for (;;) {
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '_') {
          if (nS) ERROR(iam, TYPES.NUMERIC)
          nS = 1
        } else if (ch0 === '0' || ch0 === '1') {
          nS = 0
        } else {
          if (ch0 !== 'n') iam.idx--
          else if (nS) ERROR(iam, TYPES.NUMERIC)
          break
        }
      }
      saveToken(iam, TYPES.NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_NUMERIC_O = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let nS = 1
      let ch0: string
 
      iam.idx++
      for (;;) {
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '_') {
          if (nS) ERROR(iam, TYPES.NUMERIC)
          nS = 1
        } else if (/^[0-7]$/.test(ch0)) {
          nS = 0
        } else {
          if (ch0 !== 'n') iam.idx--
          else if (nS) ERROR(iam, TYPES.NUMERIC)
          break
        }
      }
      saveToken(iam, TYPES.NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_NUMERIC_X = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let nS = 1
      let ch0: string
   
      iam.idx++
      for (;;) {
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '_') {
          if (nS) ERROR(iam, TYPES.NUMERIC)
          nS = 1
        } else if (/^[0-9a-f]$/i.test(ch0)) {
          nS = 0
        } else {
          if (ch0 !== 'n') iam.idx--
          else if (nS) ERROR(iam, TYPES.NUMERIC)
          break
        }
      }
      saveToken(iam, TYPES.NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_JSX_TEXT = (iam: TypeIam, forIdx?: number): void => {
    if (initToken(iam)) {
      let ch0: string
      let slashed = 0
  
      for (;;) {
        if (forIdx != null && iam.idx >= forIdx) break
        if (slashed) slashed--
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '') {
          break
        } else if (ch0 === '\u000D') {
          plusLine(iam, false)
        } else if (/^[\u000A\u2028\u2029]$/.test(ch0)) {
          plusLine(iam, true)
        } else if (ch0 === '\\') {
          if (!slashed) slashed = 2
        } else if (ch0 === '{') {
          if (forIdx == null && !slashed) {
            iam.idx--
            break
          }
        } else if (ch0 === '<') {
          if (forIdx == null && char(iam, 1).trim()) {
            iam.idx--
            break
          }
        }
      }
      saveToken(iam, TYPES.JSX_TEXT)
      runCallback(iam)
    }
  }
  
  const CASE_JSX_COMMENT = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let ch0: string
   
      iam.idx++
      for (;;) {
        iam.idx++
        ch0 = char(iam, 0)
        if (ch0 === '') {
          break
        } else if (ch0 === '\u000D') {
          plusLine(iam, false)
        } else if (/^[\u000A\u2028\u2029]$/.test(ch0)) {
          plusLine(iam, true)
        } else if (ch0 === '-') {
          if (char(iam, 1) === '-' && char(iam, 2) === '>') {
            iam.idx += 2
            break
          }
        }
      }
      saveToken(iam, TYPES.JSX_COMMENT)
      runCallback(iam)
    }
  }

  const DEFAULT_LOOP = (iam: TypeIam): void => {
    let ch0: string
    let ch1: string
    let ch2: string
  
    for (;!iam.isBreakLoop;) {
      iam.idx++
      ch0 = char(iam, 0)
      if (iam.ENV === '%><%') {
        if (ch0 === '') {
          break
        } else if (ch0 === '{') {
          env(iam, '%jsxexp%')
          createPunctuator(iam, 0, TYPES.JSX_EXPRESSION_START)
          iam.deep++
        } else if (ch0 === '<') {
          if (char(iam, 1).trim()) iam.idx--, env(iam, '%jsxtag%')
          else CASE_JSX_TEXT(iam)
        } else {
          CASE_JSX_TEXT(iam)
        }
      } else if (ch0 === '') {
        break
      } else if (ch0 === '\u000D') {
        // Line Terminator Code Points
        // https://tc39.es/ecma262/#sec-line-terminators
        plusLine(iam, false)
      } else if (/^[\u000A\u2028\u2029]$/.test(ch0)) {
        plusLine(iam, true)
      } else if (/^[\u0009\u000B\u000C\u0020\u00A0\uFEFF\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]$/.test(ch0)) {
        // Format-Control Code Point Usage
        // https://tc39.es/ecma262/#sec-unicode-format-control-characters
        // case '\u200C':
        // case '\u200D':
        // case '\uFEFF':
        // White Space Code Points
        // https://tc39.es/ecma262/#sec-white-space
      } else if (ch0 === '"' || ch0 === '\'') {
        // String Literals
        // https://tc39.es/ecma262/#sec-literals-string-literals
        CASE_STRING(iam)
      } else if (ch0 === '`') {
        // Template Literal Lexical Components
        // https://tc39.es/ecma262/#sec-template-literal-lexical-components
        env(iam, '%``%')
        CASE_TEMPLATE(iam)
      } else if (ch0 === '0') {
        // Numeric Literals
        // https://tc39.es/ecma262/#sec-literals-numeric-literals
        ch1 = char(iam, 1)
        if (ch1 === 'b' || ch1 === 'B') {
          CASE_NUMERIC_B(iam)
        } else if (ch1 === 'o' || ch1 === 'O') {
          CASE_NUMERIC_O(iam)
        } else if (ch1 === 'x' || ch1 === 'X') {
          CASE_NUMERIC_X(iam)
        } else if (ch1 === '.') {
          CASE_NUMERIC(iam, 1, 0, 1)
        } else if (ch1 === 'e' || ch1 === 'E') {
          CASE_NUMERIC(iam, 0, 1, 1)
        } else {
          CASE_NUMERIC(iam, 0, 0, 0)
        }
      } else if (/^[1-9]$/.test(ch0)) {
        CASE_NUMERIC(iam, 0, 0, 0)
      } else if (ch0 === '.') {
        // Punctuators
        // https://tc39.es/ecma262/#sec-punctuators
        ch1 = char(iam, 1)
        if (/^\d$/.test(ch1)) {
          CASE_NUMERIC(iam, 1, 0, 0)
        } else {
          createPunctuator(iam, ch1 === ch0 && char(iam, 2) === ch0 ? 2 : 0)
        }
      } else if (ch0 === '{') {
        env(iam, '%{}%')
        createPunctuator(iam, 0)
        iam.deep++
      } else if (ch0 === '}') {
        switch (iam.ENV) {
          case '%``%':
            iam.deep--
            CASE_TEMPLATE(iam)
            break
          case '%{}%':
            iam.deep--
            env(iam, null)
            createPunctuator(iam, 0)
            break
          case '%jsxexp%':
            iam.deep--
            env(iam, null)
            createPunctuator(iam, 0, TYPES.JSX_EXPRESSION_END)
            break
          default:
            ERROR(iam, 'Bracket "}"')
        }
      } else if (ch0 === '(') {
        env(iam, '%()%')
        createPunctuator(iam, 0)
        iam.deep++
      } else if (ch0 === ')') {
        if (iam.ENV === '%()%') {
          iam.deep--
          env(iam, null)
          createPunctuator(iam, 0)
        } else {
          ERROR(iam, 'Bracket ")"')
        }
      } else if (ch0 === '[') {
        env(iam, '%[]%')
        createPunctuator(iam, 0)
        iam.deep++
      } else if (ch0 === ']') {
        if (iam.ENV === '%[]%') {
          iam.deep--
          env(iam, null)
          createPunctuator(iam, 0)
        } else {
          ERROR(iam, 'Bracket "]"')
        }
      } else if (/^[;,~:]$/.test(ch0)) {
        createPunctuator(iam, 0)
      } else if (ch0 === '^' || ch0 === '%') {
        // case '^'/* ^ ^= */:
        // case '%'/* % %= */:
        createPunctuator(iam,
          char(iam, 1) !== '=' ? 0 : 1)
      } else if (ch0 === '~') {
        // case '!'/* ! != !== */:
        createPunctuator(iam,
          char(iam, 1) !== '=' ? 0 : char(iam, 2) !== '=' ? 1 : 2)
      } else if (ch0 === '+' || ch0 === '-') {
        // case '+'/* + += ++ */:
        // case '-'/* - -= -- */:
        createPunctuator(iam,
          (ch1 = char(iam, 1)) === '=' || ch1 === ch0 ? 1 : 0)
      } else if (ch0 === '?') {
        // this code: /* ? ?. ?? ??= */
        // createPunctuator(iam,
        //   (ch1 = char(iam, 1)) === '.' ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
        // this code: /* ? ?? ??= */
        createPunctuator(iam,
          (ch1 = char(iam, 1)) !== ch0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
      } else if (ch0 === '*' || ch0 === '&' || ch0 === '|') {
        // case '*'/* * *= ** **= */:
        // case '&'/* & &= && &&= */:
        // case '|'/* | |= || ||= */:
        createPunctuator(iam,
          (ch1 = char(iam, 1)) === '=' ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
      } else if (ch0 === '=') {
        // case '='/* = => == === */:
        createPunctuator(iam,
          (ch1 = char(iam, 1)) === '>' ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== ch0 ? 1 : 2)
      } else if (ch0 === '<') {
        // case '<'/* < <= << <<= */:
        ch1 = char(iam, 1)
        // if (!iam.useJSX && (iam.ENV === '%ts%' || isMaybeTag(iam.tokenLast, iam))) {
        //   env(iam, '%ts%')
        //   createPunctuator(iam, 0)
        //   // iam.deep++
        // } else 
        if (
          iam.useJSX && (
            iam.ENV === '%jsxtag%' && ~env(iam, null) ||
            ch1 === '/' && iam.ENV[0] === '%script%' &&
              (char(iam, 2) === '>' || iam.source.slice(iam.idx + 2, iam.idx + 2 + iam.ENV[1].length) === iam.ENV[1]) ||
            isMaybeTag(iam.tokenLast, iam.tl2, iam.tl3, iam.tl4) && !isTSGeneric(iam.source, iam.idx))
        ) {
          if (!ch1.trim()) createPunctuator(iam, 0)
          else if (ch1 === '!' && char(iam, 2) === '-' && char(iam, 3) === '-') {
            CASE_JSX_COMMENT(iam)
          } else if (ch1 === '/' && !/[/*]/.test(char(iam, 2))) {
            if (iam.ENV === '%><%' || iam.ENV[0] === '%script%') env(iam, null), iam.deep--
            createPunctuator(iam, 1, TYPES.JSX_TAG_CLOSER_START)
            env(iam, '%</>%')
            iam.deep++
          } else {
            createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_START)
            iam.tagNameLast = ''
            env(iam, '%<>%')
            iam.deep++
          }
        } else {
          createPunctuator(iam,
            (ch1 = char(iam, 1)) === '=' ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
        }
      } else if (ch0 === '>') {
        // case '>'/* > >= >> >>= >>> >>>= */:

        switch (iam.ENV) {
          // case '%ts%':
          //   // iam.deep--
          //   env(iam, null)
          //   createPunctuator(iam, 0)
          //   break
          case '%<>%':
            // deep--
            env(iam, null)

            if (iam.tagNameLast === 'script') {
              iam.deep--
              createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_END)
              iam.deep++
              if (iam.parseScriptTags) {
                env(iam, ['%script%', iam.tagNameLast])
              } else {
                env(iam, '%><%')
                if (iam.skipScriptTags) {
                  const last = iam.source.indexOf('</script', iam.idx)
                  if (last < 0) ERROR(iam, 'script')
                  CASE_JSX_TEXT(iam, last - 1)
                }
              }
              break
            }
              
            if (iam.tagNameLast === 'style') {
              iam.deep--
              createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_END)
              iam.deep++
              env(iam, '%><%')
              if (iam.skipStyleTags) {
                const last = iam.source.indexOf('</style', iam.idx)
                if (last < 0) ERROR(iam, 'style')
                CASE_JSX_TEXT(iam, last - 1)
              }
              break
            }

            if (
              /^[!?%]/.test(iam.tagNameLast) ||
                iam.considerChildlessTags && isChildlessTagName(iam.tagNameLast)
            ) {
              iam.deep--
              createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_END_CHILDLESS)
            } else {
              iam.deep--
              createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_END)
              iam.deep++
              env(iam, '%><%')
            }
            break
          case '%</>%':
            iam.deep--
            env(iam, null)
            createPunctuator(iam, 0, TYPES.JSX_TAG_CLOSER_END)
            break
          default:
            createPunctuator(iam,
              (ch1 = char(iam, 1)) === '=' ? 1 : ch1 !== ch0 ? 0
                : (ch2 = char(iam, 2)) === '=' ? 2 : ch2 !== ch0 ? 1
                  : char(iam, 3) !== '=' ? 2 : 3)
        }
      } else if (ch0 === '/') {
        // case '/'/* /* // / /= */:
        ch1 = char(iam, 1)
        if (ch1 === '/') {
          // Comments
          // https://tc39.es/ecma262/#sec-comments
          // https://tc39.es/ecma262/#prod-SingleLineComment
          // case '/'/* // */:
          CASE_COMMENT_LINE(iam)
        } else if (ch1 === '*') {
          // https://tc39.es/ecma262/#prod-MultiLineComment
          // case '*'/* /* */:
          CASE_COMMENT_BLOCK(iam)
        } else if (iam.ENV[1] === '<' && ch1 === '>') {
          iam.deep--
          env(iam, null)
          createPunctuator(iam, 1, iam.ENV[2] !== '/'
            ? TYPES.JSX_TAG_OPENER_END_CHILDLESS
            : TYPES.JSX_TAG_CLOSER_END)
        } else if (isMaybeRegexp(iam.tokenLast, iam.tl2, iam.tl3, iam.tl4)) {
          CASE_REGULAR_EXPRESSION(iam)
        } else {
          createPunctuator(iam, ch1 === '=' ? 1 : 0)
        }
      } else {
        CASE_IDENTIFIER(iam)
      }
    }

    initToken(iam)
  }
  
  // ---------------------------------------------------------------------------

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return <C extends readonly [] | {} = {}>(
    _source: string,
    // eslint-disable-next-line default-param-last
    {
      /** Default: false. Source location */
      loc = false,
      /** Default: false. Source position */
      range = false,
      /** Default: true. Cause an error if the last "deep" is not equal to 0. */
      strict = true,
      /** Default: true. Enable\disable search JSX (TSX). */
      useJSX = true,
      /** Default: false. If "true", parsing will start as text JSX (TSX). */
      insideJSX = false,
      /** Default: false. If "true", the content inside the <style> will only be JSXText. */
      skipStyleTags = false,
      /** Default: false. If "true", the content inside the <script> will only be JSXText. */
      skipScriptTags = false,
      /** Default: false. If "true", the content inside the <script> will be tokenized. */
      parseScriptTags = false,
      /** Default: false. If "true", the <img> and other childless tags will be like <img/>. */
      considerChildlessTags = false,
      /** Default: {}. Advanced context for proxy */
      proxyCtx = {} as C,
      /** Default: undefined. Middleware like */
      proxy = void 0 as (((v: TypeToken, k: number, a: TypeToken[], proxyCtx: C) => boolean | void) | undefined)
    } = {}
  ) => {
    const ENV = useJSX && insideJSX ? '%><%' : ''
    const iam: TypeIam = {
      source     : _source,
      isBreakLoop: false,
      // @ts-ignore
      proxy,
      proxyCtx,
      loc,
      range,
      useJSX,
      skipStyleTags,
      skipScriptTags,
      parseScriptTags,
      considerChildlessTags,
      tokens     : [],
      tokenLast  : null,
      tl2        : null,
      tl3        : null,
      tl4        : null,
      tagNameLast: '',
      idx        : -1,
      line       : 1,
      lineStart  : 1,
      deep       : 0,
      columnDiff : 0,
      rangeStart : 0,
      columnStart: 0,
      ENV        : ENV,
      __env__    : [ENV]
    }

    DEFAULT_LOOP(iam)
    strict && iam.deep && ERROR(iam, 'deep')
    return iam.tokens
  }
})()
