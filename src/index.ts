/*
Types
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

export declare type TypeTokenType =
  typeof TOKEN_BOOLEAN |
  typeof TOKEN_IDENTIFIER |
  typeof TOKEN_KEYWORD |
  typeof TOKEN_NULL |
  typeof TOKEN_NUMERIC |
  typeof TOKEN_PUCNTUATOR |
  typeof TOKEN_REGULAR_EXPRESSION |
  typeof TOKEN_STRING |

  typeof TOKEN_TEMPLATE |
  typeof TOKEN_TEMPLATE_HEAD |
  typeof TOKEN_TEMPLATE_MIDDLE |
  typeof TOKEN_TEMPLATE_TAIL |
  
  typeof TOKEN_COMMENT_BLOCK |
  typeof TOKEN_COMMENT_LINE |
  
  typeof TOKEN_SPACE |
  typeof TOKEN_MODIFIER |

  typeof TOKEN_JSX_TAG_OPENER_START |
  typeof TOKEN_JSX_TAG_OPENER_END |
  // typeof TOKEN_JSX_TAG_OPENER_END_CHILDLESS |
  typeof TOKEN_JSX_TAG_CLOSER_START |
  typeof TOKEN_JSX_TAG_CLOSER_END |
  typeof TOKEN_JSX_EXPRESSION_START |
  typeof TOKEN_JSX_EXPRESSION_END |
  typeof TOKEN_JSX_TEXT |
  typeof TOKEN_JSX_COMMENT

export declare type TypeToken = {
  deep: number
  type: TypeTokenType
  value: string
  range: TypeRange
  loc: TypeSourceLocation
}

declare type TypeJscTokenizeCallback =
  <C extends object>(v: TypeToken, k: number, a: TypeToken[], ctx: C) => boolean | void

/*
Tokens
--------------------------------------------------------------------------------
*/
export const TOKEN_BOOLEAN = 'Boolean'
export const TOKEN_IDENTIFIER = 'Identifier'
export const TOKEN_KEYWORD = 'Keyword'
export const TOKEN_NULL = 'Null'
export const TOKEN_NUMERIC = 'Numeric'
export const TOKEN_PUCNTUATOR = 'Punctuator'
export const TOKEN_REGULAR_EXPRESSION = 'RegularExpression'
export const TOKEN_STRING = 'String'

export const TOKEN_TEMPLATE = 'Template'
export const TOKEN_TEMPLATE_HEAD = 'TemplateHead'
export const TOKEN_TEMPLATE_MIDDLE = 'TemplateMiddle'
export const TOKEN_TEMPLATE_TAIL = 'TemplateTail'

export const TOKEN_COMMENT_BLOCK = 'CommentBlock'
export const TOKEN_COMMENT_LINE = 'CommentLine'

export const TOKEN_SPACE = 'Space'
export const TOKEN_MODIFIER = 'Modifier'

export const TOKEN_JSX_TAG_OPENER_START = 'JSXTagOpenerStart'
export const TOKEN_JSX_TAG_OPENER_END = 'JSXTagOpenerEnd'
// export const TOKEN_JSX_TAG_OPENER_END_CHILDLESS = 'JSXTagOpenerEndChildless'
export const TOKEN_JSX_TAG_CLOSER_START = 'JSXTagCloserStart'
export const TOKEN_JSX_TAG_CLOSER_END = 'JSXTagCloserEnd'
export const TOKEN_JSX_EXPRESSION_START = 'JSXExpressionStart'
export const TOKEN_JSX_EXPRESSION_END = 'JSXExpressionEnd'
export const TOKEN_JSX_TEXT = 'JSXText'
export const TOKEN_JSX_COMMENT = 'JSXComment'

export const CHILDLESS_TAGS = {
  img   : true,
  area  : true,
  base  : true,
  br    : true,
  col   : true,
  embed : true,
  hr    : true,
  input : true,
  link  : true,
  meta  : true,
  param : true,
  source: true,
  track : true,
  wbr   : true
} as const

/*
jsx2tokens
--------------------------------------------------------------------------------
*/
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const jsx2tokens = (() => {
  // const isChildlessTagName = (s: string): boolean =>
  //   /^(?:img|area|base|br|col|embed|hr|input|link|meta|param|source|track|wbr)$/.test(s)
  const isChildlessTagName = (s: string): boolean => (CHILDLESS_TAGS as any)[s] === true
  
  const isMaybeRegexp = (token: TypeToken | null): boolean =>
    !token ||
  token.type === TOKEN_KEYWORD ||
  token.type === TOKEN_MODIFIER ||
  token.type === TOKEN_JSX_EXPRESSION_START ||
  token.type === TOKEN_PUCNTUATOR && '!.})]'.indexOf(token.value) < 0

  const isMaybeTag = (token: TypeToken | null): boolean =>
    !token ||
  token.type === TOKEN_KEYWORD ||
  token.type === TOKEN_MODIFIER ||
  token.type === TOKEN_JSX_EXPRESSION_START ||
  token.type === TOKEN_PUCNTUATOR && /[^!.})\]]$/.test(token.value)

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

  const noopFalse = ((): false => false) as TypeJscTokenizeCallback

  // ---------------------------------------------------------------------------

  type TypeIam = {
    readonly source: string
    isBreakLoop: boolean
    readonly proxy: TypeJscTokenizeCallback
    readonly useJSX: boolean
    readonly parseStyleTags: boolean
    readonly parseScriptTags: boolean
    readonly considerChildlessTags: boolean
    readonly cbCtx: object
    readonly tokens: TypeToken[]
    tokenLast: TypeToken | null
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
    JSON.stringify({ line: iam.lineStart, column: iam.columnStart, range: iam.rangeStart }))
  }

  const char = (iam: TypeIam, offset: number): string => iam.source.charAt(iam.idx + offset)
  const plusLine = (iam: TypeIam, force: boolean): void => {
    if (force || char(iam, 1) !== '\u000A') iam.line++, iam.columnDiff = iam.idx + 1
  }

  const runCallback = (iam: TypeIam): void => {
    iam.isBreakLoop = !!iam.proxy(iam.tokenLast!, iam.tokens.length - 1, iam.tokens, iam.cbCtx)
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
    iam.tokenLast = {
      deep : iam.deep,
      type : _type,
      value: iam.source.slice(iam.rangeStart, iam.idx + 1),
      range: [iam.rangeStart, iam.rangeStart = iam.idx + 1],
      loc  : {
        start: { line: iam.lineStart, column: iam.columnStart },
        end  : { line: iam.line, column: iam.columnStart = iam.idx - iam.columnDiff + 1 }
      }
    }

    iam.tokens.push(iam.tokenLast)
  }

  const initToken = (iam: TypeIam): boolean => {
    if (iam.rangeStart < iam.idx) {
      iam.idx--
      const tokenLastTmp = iam.tokenLast
      saveToken(iam, TOKEN_SPACE)
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

  const createPunctuator = (iam: TypeIam, offset: number, type: TypeTokenType = TOKEN_PUCNTUATOR): void => {
    if (initToken(iam)) {
    // const tokenLastTmp = tokenLast
      if (offset) iam.idx += offset
      saveToken(iam, type)

      // if (tokenLastTmp && /^[:]$/.test(tokenLast!.value)) {
      //   if (tokenLastTmp.type === TOKEN_KEYWORD) tokenLastTmp.type = TOKEN_IDENTIFIER
      // }
      runCallback(iam)
    }
  }

  // ---------------------------------------------------------------------------

  const CASE_IDENTIFIER = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let char0 = ''
  
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

      const tokenLastTmp = iam.tokenLast
      saveToken(iam, TOKEN_IDENTIFIER)
      const token = iam.tokenLast!

      if (tokenLastTmp && tokenLastTmp.type === TOKEN_JSX_TAG_OPENER_START) {
        iam.tagNameLast = token.value
      }

      if (!tokenLastTmp || !/^[.]$/.test(tokenLastTmp.value)) {
        switch (token.value) {
          case 'null':
            token.type = TOKEN_NULL
            break
          case 'true':
          case 'false':
            token.type = TOKEN_BOOLEAN
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
            token.type = TOKEN_KEYWORD
            break
          default:

        }
      }

      if (token.value.indexOf('@') > -1) {
        token.type = TOKEN_MODIFIER
      }
      runCallback(iam)
    }
  }

  const CASE_COMMENT_LINE = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let char0: string
  
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
      saveToken(iam, TOKEN_COMMENT_LINE)
      runCallback(iam)
      iam.tokenLast = tokenLastTmp
    }
  }
  
  const CASE_COMMENT_BLOCK = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let char0: string
  
      iam.idx++
      LOOP: for (;;) {
        iam.idx++
        switch (char(iam, 0)) {
          case '':
            ERROR(iam, TOKEN_COMMENT_BLOCK)
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
      saveToken(iam, TOKEN_COMMENT_BLOCK)
      runCallback(iam)
      iam.tokenLast = tokenLastTmp
    }
  }
  
  const CASE_STRING = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let char0: string
      let slashed = 0
  
      LOOP: for (;;) {
        if (slashed) slashed--
        iam.idx++
        switch (char0 = char(iam, 0)) {
          case '':
          // case '\u000D' /* \r */:
          // case '\u000A' /* \n */:
          // case '\u2028':
          // case '\u2029':
            ERROR(iam, TOKEN_STRING)
            break
          case '\\':
            if (!slashed) slashed = 2
            break
          case '"':
          case "'":
            if (!slashed && char0 === iam.source[iam.rangeStart]) break LOOP
            break
          default:
        }
      }
      saveToken(iam, TOKEN_STRING)
      runCallback(iam)
    }
  }
  
  const CASE_TEMPLATE = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let char0: string
      let slashed = 0
      let needDeepPlus = false

      LOOP: for (;;) {
        if (slashed) slashed--
        iam.idx++
        switch (char(iam, 0)) {
          case '':
            ERROR(iam, TOKEN_TEMPLATE)
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
      saveToken(iam, TOKEN_TEMPLATE)
      if (needDeepPlus) iam.deep++

      const token = iam.tokenLast!
      const first = token.value[0]
      const last = token.value[token.value.length - 1]
      if (first === '`') {
        if (last !== '`') token.type = TOKEN_TEMPLATE_HEAD
      } else {
        token.type = last !== '`' ? TOKEN_TEMPLATE_MIDDLE : TOKEN_TEMPLATE_TAIL
      }
      runCallback(iam)
    }
  }
  
  const CASE_REGULAR_EXPRESSION = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let rxD = 0
      // let char0: string
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
            ERROR(iam, TOKEN_REGULAR_EXPRESSION)
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
      saveToken(iam, TOKEN_REGULAR_EXPRESSION)
      runCallback(iam)
    }
  }

  const CASE_NUMERIC = (iam: TypeIam, nD: number, nE: number): void => {
    if (initToken(iam)) {
      let nS = nD || nE || 0
      let char0: string
  
      iam.idx += nS
      LOOP: for (;;) {
        iam.idx++
        switch (char0 = char(iam, 0)) {
          case '_':
            if (nS) ERROR(iam, TOKEN_NUMERIC)
            nS = 1
            break
          case '.':
            if (nS) ERROR(iam, TOKEN_NUMERIC)
            if (nD) {
              iam.idx--
              break LOOP
            }
            nD = 1
            nS = 1
            break
          case 'e':
          case 'E':
            if (nE) ERROR(iam, TOKEN_NUMERIC)
            nE = 1
            nS = 1
            break
          case '+':
          case '-':
            if (nE !== 1) {
              if (nS) ERROR(iam, TOKEN_NUMERIC)
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
            nS = 0
            break
          default:
            if (char0 !== 'n') iam.idx--
            else if (nS) ERROR(iam, TOKEN_NUMERIC)
            break LOOP
        }
      }
      saveToken(iam, TOKEN_NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_NUMERIC_B = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let nS = 1
      let char0: string

      iam.idx++
      LOOP: for (;;) {
        iam.idx++
        switch (char0 = char(iam, 0)) {
          case '_':
            if (nS) ERROR(iam, TOKEN_NUMERIC)
            nS = 1
            break
          case '0':
          case '1':
            nS = 0
            break
          default:
            if (char0 !== 'n') iam.idx--
            else if (nS) ERROR(iam, TOKEN_NUMERIC)
            break LOOP
        }
      }
      saveToken(iam, TOKEN_NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_NUMERIC_O = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let nS = 1
      let char0: string
 
      iam.idx++
      LOOP: for (;;) {
        iam.idx++
        switch (char0 = char(iam, 0)) {
          case '_':
            if (nS) ERROR(iam, TOKEN_NUMERIC)
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
            if (char0 !== 'n') iam.idx--
            else if (nS) ERROR(iam, TOKEN_NUMERIC)
            break LOOP
        }
      }
      saveToken(iam, TOKEN_NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_NUMERIC_X = (iam: TypeIam): void => {
    if (initToken(iam)) {
      let nS = 1
      let char0: string
   
      iam.idx++
      LOOP: for (;;) {
        iam.idx++
        switch (char0 = char(iam, 0)) {
          case '_':
            if (nS) ERROR(iam, TOKEN_NUMERIC)
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
            if (char0 !== 'n') iam.idx--
            else if (nS) ERROR(iam, TOKEN_NUMERIC)
            break LOOP
        }
      }
      saveToken(iam, TOKEN_NUMERIC)
      runCallback(iam)
    }
  }
  
  const CASE_JSX_TEXT = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let char0: string
      let slashed = 0
  
      LOOP: for (;;) {
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
            if (!slashed) {
              iam.idx--
              break LOOP
            }
            break
          case '<':
            if (char(iam, 1).trim()) {
              iam.idx--
              break LOOP
            }
            break
          default:
        }
      }
      saveToken(iam, TOKEN_JSX_TEXT)
      runCallback(iam)
    }
  }
  
  const CASE_JSX_COMMENT = (iam: TypeIam): void => {
    if (initToken(iam)) {
    // let char0: string
   
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
  
      const tokenLastTmp = iam.tokenLast
      saveToken(iam, TOKEN_JSX_COMMENT)
      runCallback(iam)
      iam.tokenLast = tokenLastTmp
    }
  }

  const DEFAULT_LOOP = (iam: TypeIam): void => {
    let char0: string
    let char1: string
    let char2: string
  
    LOOP: for (;!iam.isBreakLoop;) {
      iam.idx++
      char0 = char(iam, 0)
  
      switch (iam.ENV) {
        case '%><%':
          switch (char0) {
            case '':
              break LOOP
            case '{':
              env(iam, '%jsxexp%')
              createPunctuator(iam, 0, TOKEN_JSX_EXPRESSION_START)
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
          switch (char0) {
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
                  CASE_NUMERIC(iam, 1, 0)
                  break
                case 'e':
                case 'E':
                  CASE_NUMERIC(iam, 0, 1)
                  break
                default:
                  CASE_NUMERIC(iam, 0, 0)
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
              CASE_NUMERIC(iam, 0, 0)
              break
  
            // Punctuators
            // https://tc39.es/ecma262/#sec-punctuators
            case '.'/* . ... */:
              switch (char1 = char(iam, 1)) {
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
                  CASE_NUMERIC(iam, 1, 0)
                  break
                default:
                  createPunctuator(iam, char1 === char0 && char(iam, 2) === char0 ? 2 : 0)
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
                  createPunctuator(iam, 0, TOKEN_JSX_EXPRESSION_END)
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
                (char1 = char(iam, 1)) === '=' || char1 === char0 ? 1 : 0)
              break
            case '?'/* ? ?. ?? ??= */:
              createPunctuator(iam,
                (char1 = char(iam, 1)) === '.' ? 1 : char1 !== char0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
              break
            case '*'/* * *= ** **= */:
            case '&'/* & &= && &&= */:
            case '|'/* | |= || ||= */:
              createPunctuator(iam,
                (char1 = char(iam, 1)) === '=' ? 1 : char1 !== char0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
              break
            case '='/* = => == === */:
              createPunctuator(iam,
                (char1 = char(iam, 1)) === '>' ? 1 : char1 !== char0 ? 0 : char(iam, 2) !== char0 ? 1 : 2)
              break
            case '<'/* < <= << <<= */:
              char1 = char(iam, 1)
              if (
                iam.useJSX && (
                  iam.ENV === '%jsxtag%' && ~env(iam, null) ||
                char1 === '/' && iam.ENV[0] === '%script%' &&
                  (char(iam, 2) === '>' || iam.source.slice(iam.idx + 2, iam.idx + 2 + iam.ENV[1].length) === iam.ENV[1]) ||
                isMaybeTag(iam.tokenLast) && !isTSGeneric(iam.source, iam.idx))
              ) {
                if (!char1.trim()) createPunctuator(iam, 0)
                else if (char1 === '!' && char(iam, 2) === '-' && char(iam, 3) === '-') {
                  CASE_JSX_COMMENT(iam)
                } else if (char1 === '/' && !/[/*]/.test(char(iam, 2))) {
                  if (iam.ENV === '%><%' || iam.ENV[0] === '%script%') env(iam, null), iam.deep--
                  createPunctuator(iam, 1, TOKEN_JSX_TAG_CLOSER_START)
                  env(iam, '%</>%')
                  // deep++
                } else {
                  createPunctuator(iam, 0, TOKEN_JSX_TAG_OPENER_START)
                  iam.tagNameLast = ''
                  env(iam, '%<>%')
                  iam.deep++
                }
              } else {
                createPunctuator(iam,
                  (char1 = char(iam, 1)) === '=' ? 1 : char1 !== char0 ? 0 : char(iam, 2) !== '=' ? 1 : 2)
              }
              break
            case '>'/* > >= >> >>= >>> >>>= */:
              switch (iam.ENV) {
                case '%<>%':
                  // deep--
                  env(iam, null)
                  
                  if (iam.parseScriptTags && iam.tagNameLast === 'script' ||
                    iam.parseStyleTags && iam.tagNameLast === 'style') {
                    createPunctuator(iam, 0, TOKEN_JSX_TAG_OPENER_END)
                    iam.deep++
                    env(iam, ['%script%', iam.tagNameLast])
                  } else if (
                    !/^[!?%]/.test(iam.tagNameLast) && (!iam.considerChildlessTags || !isChildlessTagName(iam.tagNameLast))
                  ) {
                    createPunctuator(iam, 0, TOKEN_JSX_TAG_OPENER_END)
                    iam.deep++
                    env(iam, '%><%')
                  } else {
                    iam.deep--
                    createPunctuator(iam, 0, TOKEN_JSX_TAG_OPENER_END)
                  }
                  break
                case '%</>%':
                  iam.deep--
                  env(iam, null)
                  createPunctuator(iam, 0, TOKEN_JSX_TAG_CLOSER_END)
                  break
                default:
                  createPunctuator(iam,
                    (char1 = char(iam, 1)) === '=' ? 1 : char1 !== char0 ? 0
                      : (char2 = char(iam, 2)) === '=' ? 2 : char2 !== char0 ? 1
                        : char(iam, 3) !== '=' ? 2 : 3)
              }
              break
            case '/'/* /* // / /= */:
              switch (char1 = char(iam, 1)) {
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
                  if (iam.ENV[1] === '<' && char1 === '>') {
                    iam.deep--
                    env(iam, null)
                    createPunctuator(iam, 1, iam.ENV[2] !== '/'
                      ? TOKEN_JSX_TAG_OPENER_END
                      : TOKEN_JSX_TAG_CLOSER_END)
                  } else if (isMaybeRegexp(iam.tokenLast)) {
                    CASE_REGULAR_EXPRESSION(iam)
                  } else {
                    createPunctuator(iam, char1 === '=' ? 1 : 0)
                  }
              }
              break
            default:
              CASE_IDENTIFIER(iam)
          }
  
          break
      }
    }
  }
  
  // ---------------------------------------------------------------------------

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return <C extends readonly [] | {} | undefined = undefined>(
    _source: string,
    // eslint-disable-next-line default-param-last
    {
      strict = true,
      useJSX = true,
      insideJSX = false,
      parseStyleTags = false,
      parseScriptTags = false,
      considerChildlessTags = false,
      proxy = noopFalse as ((v: TypeToken, k: number, a: TypeToken[], ctx: C) => boolean | void)
    } = {},
    ctx?: C
  ) => {
    const ENV = useJSX && insideJSX ? '%><%' : ''
    const iam: TypeIam = {
      source     : _source,
      isBreakLoop: false,
      // @ts-ignore
      proxy,
      useJSX,
      parseStyleTags,
      parseScriptTags,
      considerChildlessTags,
      cbCtx      : ctx || {},
      tokens     : [],
      tokenLast  : null,
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

// jsx2tokens('12', false, (v, k, a, c) => { console.log(v, k, a, c) }, [12, ''])
