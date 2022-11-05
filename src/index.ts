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
  
      LOOP: for (;;) {
        iam.idx++
        switch (char(iam, 0)) {
          case '':
          case '\u000D':
          case '\u000A':
          case '\u2028':
          case '\u2029':
            // case '\u200C':
            // case '\u200D':
            // eslint-disable-next-line no-fallthrough
          case '\u0009':
          case '\u000B':
          case '\u000C':
          case '\u0020':
          case '\u00A0':
          case '\uFEFF':
          case '\u1680':
          case '\u180e':
          case '\u2000':
          case '\u2001':
          case '\u2002':
          case '\u2003':
          case '\u2004':
          case '\u2005':
          case '\u2006':
          case '\u2007':
          case '\u2008':
          case '\u2009':
          case '\u200A':
          case '\u202F':
          case '\u205F':
          case '\u3000':
          case '-':
          case '+':
          case '"':
          case "'":
          case '`':
          case '{':
          case '}':
          case '(':
          case ')':
          case '[':
          case ']':
          case ';':
          case ',':
          case '~':
          case ':':
          case '?':
          case '<':
          case '=':
          case '>':
          case '^':
          case '%':
          case '!':
          case '*':
          case '&':
          case '|':
          case '.':
          case '/':
            iam.idx--
            break LOOP
          default:
        }
      }

      tagNameLast(iam)
      // const tokenLastTmp = iam.tokenLast
      saveToken(iam, TYPES.IDENTIFIER)
      const token = iam.tokenLast!

      // if (tokenLastTmp && tokenLastTmp.type === TYPES.JSX_TAG_OPENER_START) {
      //   console.log(tokenLastTmp)
      //   iam.tagNameLast = token.value
      // }

      // if (!tokenLastTmp || !/^[.]$/.test(tokenLastTmp.value)) {
      switch (token.value) {
        case 'null':
          token.type = TYPES.NULL
          break
        case 'true':
        case 'false':
          token.type = TYPES.BOOLEAN
          break
        case 'let':
        case 'static':
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        
          // eslint-disable-next-line no-fallthrough
        case 'await':
        case 'break':
        case 'case':
        case 'catch':
        case 'class':
        case 'const':
        case 'continue':
        case 'debugger':
        case 'default':
        case 'delete':
        case 'do':
        case 'else':
        case 'enum':
        case 'export':
        case 'extends':
        case 'finally':
        case 'for':
        case 'function':
        case 'if':
        case 'import':
        case 'in':
        case 'instanceof':
        case 'new':
        case 'return':
        case 'super':
        case 'switch':
        case 'this':
        case 'throw':
        case 'try':
        case 'typeof':
        case 'var':
        case 'void':
        case 'while':
        case 'with':
        case 'yield':
          token.type = TYPES.KEYWORD
          break
        default:
          if (token.value.indexOf('@') > -1) {
            token.type = TYPES.MODIFIER
          }
        
        // }
      }

      runCallback(iam)
    }
  }

  const CASE_COMMENT_LINE = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let ch0: string
  
      iam.idx++
      LOOP: for (;;) {
        iam.idx++
        switch (char(iam, 0)) {
          case '':
          case '\u000D'/* \r */:
          case '\u000A'/* \n */:
          case '\u2028':
          case '\u2029':
            iam.idx--
            break LOOP
          default:
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
    // let ch0: string
  
      iam.idx++
      LOOP: for (;;) {
        iam.idx++
        switch (char(iam, 0)) {
          case '':
            ERROR(iam, TYPES.COMMENT_BLOCK)
            break
          case '\u000D'/* \r */:
            plusLine(iam, false)
            break
          case '\u000A'/* \n */:
          case '\u2028':
          case '\u2029':
            plusLine(iam, true)
            break
          case '*':
            if (char(iam, 1) === '/') {
              iam.idx++
              break LOOP
            }
            break
          default:
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
  
      LOOP: for (;;) {
        if (slashed) slashed--
        iam.idx++
        switch (ch0 = char(iam, 0)) {
          case '':
          // case '\u000D' /* \r */:
          // case '\u000A' /* \n */:
          // case '\u2028':
          // case '\u2029':
            ERROR(iam, TYPES.STRING)
            break
          case '\\':
            if (!slashed) slashed = 2
            break
          case '"':
          case "'":
            if (!slashed && ch0 === iam.source[iam.rangeStart]) break LOOP
            break
          default:
        }
      }
      saveToken(iam, TYPES.STRING)
      runCallback(iam)
    }
  }
  
  const CASE_TEMPLATE = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let ch0: string
      let slashed = 0
      let needDeepPlus = false

      LOOP: for (;;) {
        if (slashed) slashed--
        iam.idx++
        switch (char(iam, 0)) {
          case '':
            ERROR(iam, TYPES.TEMPLATE)
            break
          case '\u000D'/* \r */:
            plusLine(iam, false)
            break
          case '\u000A'/* \n */:
          case '\u2028':
          case '\u2029':
            plusLine(iam, true)
            break
          case '\\':
            if (!slashed) slashed = 2
            break
          case '`':
            if (!slashed) {
              env(iam, null)
              break LOOP
            }
            break
          case '$':
            if (!slashed && char(iam, 1) === '{') {
              iam.idx++
              needDeepPlus = true
              break LOOP
            }
            break
          default:
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
      // let ch0: string
      let slashed = 0
  
      LOOP: for (;;) {
        if (slashed) slashed--
        iam.idx++
        switch (char(iam, 0)) {
          case '':
          case '\u000D'/* \r */:
          case '\u000A'/* \n */:
          case '\u2028':
          case '\u2029':
            ERROR(iam, TYPES.REGULAR_EXPRESSION)
            break
          case '\\':
            if (!slashed) slashed = 2
            break
          case '[':
            if (!slashed) rxD = 1
            break
          case ']':
            if (!slashed) rxD = 0
            break
          case '/':
            if (!slashed && !rxD) {
              for (;;) {
                iam.idx++
                if (!/\w/.test(char(iam, 0))) {
                  iam.idx--
                  break LOOP
                }
              }
            }
            break
          default:
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
      LOOP: for (;;) {
        iam.idx++
        switch (ch0 = char(iam, 0)) {
          case '_':
            if (nS) ERROR(iam, TYPES.NUMERIC)
            nS = 1
            break
          case '.':
            if (nD !== 1 && nS) ERROR(iam, TYPES.NUMERIC)
            if (nD || nE) {
              iam.idx--
              break LOOP
            }
            nD = 1
            nS = 1
            break
          case 'e':
          case 'E':
            if (nE || nS) ERROR(iam, TYPES.NUMERIC)
            nE = 1
            nS = 1
            break
          case '+':
          case '-':
            if (nE !== 1) {
              iam.idx--
              break LOOP
            }
            nE = 2
            break
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            if (nE === 1) nE = 2
            if (nD === 1) nD = 2
            nS = 0
            break
          default:
            if (ch0 !== 'n') iam.idx--
            if (nS) ERROR(iam, TYPES.NUMERIC)
            break LOOP
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
      LOOP: for (;;) {
        iam.idx++
        switch (ch0 = char(iam, 0)) {
          case '_':
            if (nS) ERROR(iam, TYPES.NUMERIC)
            nS = 1
            break
          case '0':
          case '1':
            nS = 0
            break
          default:
            if (ch0 !== 'n') iam.idx--
            else if (nS) ERROR(iam, TYPES.NUMERIC)
            break LOOP
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
      LOOP: for (;;) {
        iam.idx++
        switch (ch0 = char(iam, 0)) {
          case '_':
            if (nS) ERROR(iam, TYPES.NUMERIC)
            nS = 1
            break
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
            nS = 0
            break
          default:
            if (ch0 !== 'n') iam.idx--
            else if (nS) ERROR(iam, TYPES.NUMERIC)
            break LOOP
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
      LOOP: for (;;) {
        iam.idx++
        switch (ch0 = char(iam, 0)) {
          case '_':
            if (nS) ERROR(iam, TYPES.NUMERIC)
            nS = 1
            break
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
          case 'a':
          case 'A':
          case 'b':
          case 'B':
          case 'c':
          case 'C':
          case 'd':
          case 'D':
          case 'e':
          case 'E':
          case 'f':
          case 'F':
            nS = 0
            break
          default:
            if (ch0 !== 'n') iam.idx--
            else if (nS) ERROR(iam, TYPES.NUMERIC)
            break LOOP
        }
      }
      saveToken(iam, TYPES.NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_JSX_TEXT = (iam: TypeIam, forIdx?: number): void => {
    if (initToken(iam)) {
    // let ch0: string
      let slashed = 0
  
      LOOP: for (;;) {
        if (forIdx != null && iam.idx >= forIdx) break
        if (slashed) slashed--
        iam.idx++

        switch (char(iam, 0)) {
          case '':
            break LOOP
          case '\u000D'/* \r */:
            plusLine(iam, false)
            break
          case '\u000A'/* \n */:
          case '\u2028':
          case '\u2029':
            plusLine(iam, true)
            break
          case '\\':
            if (!slashed) slashed = 2
            break
          case '{':
            if (forIdx == null && !slashed) {
              iam.idx--
              break LOOP
            }
            break
          case '<':
            if (forIdx == null && char(iam, 1).trim()) {
              iam.idx--
              break LOOP
            }
            break
          default:
        }
      }
      saveToken(iam, TYPES.JSX_TEXT)
      runCallback(iam)
    }
  }
  
  const CASE_JSX_COMMENT = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let ch0: string
   
      iam.idx++
      LOOP: for (;;) {
        iam.idx++
        switch (char(iam, 0)) {
          case '':
            break LOOP
          case '\u000D'/* \r */:
            plusLine(iam, false)
            break
          case '\u000A'/* \n */:
          case '\u2028':
          case '\u2029':
            plusLine(iam, true)
            break
          case '-':
            if (char(iam, 1) === '-' && char(iam, 2) === '>') {
              iam.idx += 2
              break LOOP
            }
            break
          default:
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
  
    LOOP: for (;!iam.isBreakLoop;) {
      iam.idx++
      ch0 = char(iam, 0)
  
      switch (iam.ENV) {
        case '%><%':
          switch (ch0) {
            case '':
              break LOOP
            case '{':
              env(iam, '%jsxexp%')
              createPunctuator(iam, 0, TYPES.JSX_EXPRESSION_START)
              iam.deep++
              break
            case '<':
              if (char(iam, 1).trim()) iam.idx--, env(iam, '%jsxtag%')
              else CASE_JSX_TEXT(iam)
              break
            default:
              CASE_JSX_TEXT(iam)
              
          }
          break
        default:
          switch (ch0) {
            case '':
              break LOOP
            // Line Terminator Code Points
            // https://tc39.es/ecma262/#sec-line-terminators
            case '\u000D'/* \r */:
              plusLine(iam, false)
              break
            case '\u000A'/* \n */:
            case '\u2028':
            case '\u2029':
              plusLine(iam, true)
              break
            // Format-Control Code Point Usage
            // https://tc39.es/ecma262/#sec-unicode-format-control-characters
            // case '\u200C':
            // case '\u200D':
            // case '\uFEFF':
            // White Space Code Points
            // https://tc39.es/ecma262/#sec-white-space
            case '\u0009'/* '\t' */:
            case '\u000B'/* '\v' */:
            case '\u000C'/* '\f' */:
            case '\u0020'/*   */:
            case '\u00A0':
            case '\uFEFF':
            case '\u1680':
            case '\u180e':
            case '\u2000':
            case '\u2001':
            case '\u2002':
            case '\u2003':
            case '\u2004':
            case '\u2005':
            case '\u2006':
            case '\u2007':
            case '\u2008':
            case '\u2009':
            case '\u200A':
            case '\u202F':
            case '\u205F':
            case '\u3000':
              break
  
            // String Literals
            // https://tc39.es/ecma262/#sec-literals-string-literals
            case '"':
            case "'":
              CASE_STRING(iam)
              break
  
            // Template Literal Lexical Components
            // https://tc39.es/ecma262/#sec-template-literal-lexical-components
            case '`':
              env(iam, '%``%')
              CASE_TEMPLATE(iam)
              break
  
            // Numeric Literals
            // https://tc39.es/ecma262/#sec-literals-numeric-literals
            case '0':
              switch (char(iam, 1)) {
                case 'b':
                case 'B':
                  CASE_NUMERIC_B(iam)
                  break
                case 'o':
                case 'O':
                  CASE_NUMERIC_O(iam)
                  break
                case 'x':
                case 'X':
                  CASE_NUMERIC_X(iam)
                  break
                case '.':
                  CASE_NUMERIC(iam, 1, 0, 1)
                  break
                case 'e':
                case 'E':
                  CASE_NUMERIC(iam, 0, 1, 1)
                  break
                default:
                  CASE_NUMERIC(iam, 0, 0, 0)
              }
              break
  
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
              CASE_NUMERIC(iam, 0, 0, 0)
              break
  
            // Punctuators
            // https://tc39.es/ecma262/#sec-punctuators
            case '.'/* . ... */:
              switch (ch1 = char(iam, 1)) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                  CASE_NUMERIC(iam, 1, 0, 0)
                  break
                default:
                  createPunctuator(iam, ch1 === ch0 && char(iam, 2) === ch0 ? 2 : 0)
              }
              break
  
            case '{':
              env(iam, '%{}%')
              createPunctuator(iam, 0)
              iam.deep++
              break
            case '}':
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
              break
  
            case '(':
              env(iam, '%()%')
              createPunctuator(iam, 0)
              iam.deep++
              break
            case ')':
              switch (iam.ENV) {
                case '%()%':
                  iam.deep--
                  env(iam, null)
                  createPunctuator(iam, 0)
                  break
                default:
                  ERROR(iam, 'Bracket ")"')
              }
              break
  
            case '[':
              env(iam, '%[]%')
              createPunctuator(iam, 0)
              iam.deep++
              break
            case ']':
              switch (iam.ENV) {
                case '%[]%':
                  iam.deep--
                  env(iam, null)
                  createPunctuator(iam, 0)
                  break
                default:
                  ERROR(iam, 'Bracket "]"')
              }
              break
  
            case ';':
            case ',':
            case '~':
            case ':':
              createPunctuator(iam, 0)
              break
            case '^'/* ^ ^= */:
            case '%'/* % %= */:
              createPunctuator(iam,
                char(iam, 1) !== '=' ? 0 : 1)
              break
            case '!'/* ! != !== */:
              createPunctuator(iam,
                char(iam, 1) !== '=' ? 0 : char(iam, 2) !== '=' ? 1 : 2)
              break
            case '+'/* + += ++ */:
            case '-'/* - -= -- */:
              createPunctuator(iam,
                (ch1 = char(iam, 1)) === '=' || ch1 === ch0 ? 1 : 0)
              break
            case '?'/* ? ?? ??= */: // ?. maybe?
              // this code: /* ? ?. ?? ??= */
              // createPunctuator(iam,
              //   (ch1 = char(iam, 1)) === '.' ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
              // this code: /* ? ?? ??= */
              createPunctuator(iam,
                (ch1 = char(iam, 1)) !== ch0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
              break
            case '*'/* * *= ** **= */:
            case '&'/* & &= && &&= */:
            case '|'/* | |= || ||= */:
              createPunctuator(iam,
                (ch1 = char(iam, 1)) === '=' ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
              break
            case '='/* = => == === */:
              createPunctuator(iam,
                (ch1 = char(iam, 1)) === '>' ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== ch0 ? 1 : 2)
              break
            case '<'/* < <= << <<= */:
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
              break
            case '>'/* > >= >> >>= >>> >>>= */:
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
                        iam.idx++, CASE_JSX_TEXT(iam, last - 1)
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
                      iam.idx++, CASE_JSX_TEXT(iam, last - 1)
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
              break
            case '/'/* /* // / /= */:
              switch (ch1 = char(iam, 1)) {
                // Comments
                // https://tc39.es/ecma262/#sec-comments
                // https://tc39.es/ecma262/#prod-SingleLineComment
                case '/'/* // */:
                  CASE_COMMENT_LINE(iam)
                  break
                // https://tc39.es/ecma262/#prod-MultiLineComment
                case '*'/* /* */:
                  CASE_COMMENT_BLOCK(iam)
                  break
                default:
                  if (iam.ENV[1] === '<' && ch1 === '>') {
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
              }
              break
            default:
              CASE_IDENTIFIER(iam)
          }
  
          break
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
