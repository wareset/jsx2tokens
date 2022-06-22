/* eslint-disable */
/*
dester builds:
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e, a, s, c, r, t, i, n, E, k, d, l, o, S, p, _, b, u, T, f, N, x, L, R, O = {
    BOOLEAN: "Boolean",
    IDENTIFIER: "Identifier",
    KEYWORD: "Keyword",
    NULL: "Null",
    NUMERIC: "Numeric",
    PUCNTUATOR: "Punctuator",
    REGULAR_EXPRESSION: "RegularExpression",
    STRING: "String",
    TEMPLATE: "Template",
    TEMPLATE_HEAD: "TemplateHead",
    TEMPLATE_MIDDLE: "TemplateMiddle",
    TEMPLATE_TAIL: "TemplateTail",
    COMMENT_BLOCK: "CommentBlock",
    COMMENT_LINE: "CommentLine",
    SPACE: "Space",
    MODIFIER: "Modifier",
    JSX_TAG_OPENER_START: "JSXTagOpenerStart",
    JSX_TAG_OPENER_END: "JSXTagOpenerEnd",
    JSX_TAG_OPENER_END_CHILDLESS: "JSXTagOpenerEndChildless",
    JSX_TAG_CLOSER_START: "JSXTagCloserStart",
    JSX_TAG_CLOSER_END: "JSXTagCloserEnd",
    JSX_EXPRESSION_START: "JSXExpressionStart",
    JSX_EXPRESSION_END: "JSXExpressionEnd",
    JSX_TEXT: "JSXText",
    JSX_COMMENT: "JSXComment"
}, g = {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    command: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
}, C = (e = e => !e || e.type === O.KEYWORD || e.type === O.MODIFIER || e.type === O.JSX_EXPRESSION_START || e.type === O.PUCNTUATOR && "!.})]".indexOf(e.value) < 0, 
a = (e, a) => {
    for (var s = !1, c = !1, r = a + 1; r < e.length; r++) if (c || (c = !/\s/.test(e[r]))) {
        if ("," === e[r] || "=" === e[r]) return !0;
        if (!s && ("-" === e[r] || ">" === e[r])) return !1;
        if (/\s/.test(e[r])) s = !0; else if (s) return /^extends\s$/.test(e.slice(r, r + 8));
    }
    return !1;
}, s = () => !1, c = (e, ...a) => {
    throw new Error("jsx2tokens - " + a.join(" ") + ": " + JSON.stringify({
        line: e.lineStart,
        column: e.columnStart,
        range: e.rangeStart
    }));
}, r = (e, a) => e.source.charAt(e.idx + a), t = (e, a) => {
    (a || "\n" !== r(e, 1)) && (e.line++, e.columnDiff = e.idx + 1);
}, i = e => {
    e.isBreakLoop = !!e.proxy(e.tokenLast, e.tokens.length - 1, e.tokens, e.proxyCtx);
}, n = (e, a) => (null === a ? e.__env__.pop() : a && e.__env__.push(a), e.ENV = e.__env__[e.__env__.length - 1] || ""), 
E = (e, a) => {
    e.tokenLast = {
        deep: e.deep,
        type: a,
        value: e.source.slice(e.rangeStart, e.idx + 1)
    };
    var s = [ e.rangeStart, e.rangeStart = e.idx + 1 ], c = {
        start: {
            line: e.lineStart,
            column: e.columnStart
        },
        end: {
            line: e.line,
            column: e.columnStart = e.idx - e.columnDiff + 1
        }
    };
    e.loc && (e.tokenLast.loc = c), e.range && (e.tokenLast.range = s), e.tokens.push(e.tokenLast);
}, k = e => {
    if (e.rangeStart < e.idx) {
        e.idx--;
        var a = e.tokenLast;
        E(e, O.SPACE), a && a.deep > e.tokenLast.deep && (e.tokenLast.deep = a.deep), i(e), 
        e.tokenLast = a, e.idx++;
    }
    return e.rangeStart = e.idx, e.lineStart = e.line, e.columnStart = e.idx - e.columnDiff, 
    !e.isBreakLoop;
}, d = (e, a, s = O.PUCNTUATOR) => {
    k(e) && (a && (e.idx += a), l(e), E(e, s), i(e));
}, l = e => {
    e.tokenLast && e.tokenLast.type === O.JSX_TAG_OPENER_START && (e.tagNameLast = e.source.slice(e.rangeStart, e.idx + 1));
}, o = e => {
    if (k(e)) {
        e: for (;;) switch (e.idx++, r(e, 0)) {
          case "":
          case "\r":
          case "\n":
          case "\u2028":
          case "\u2029":
          case "\t":
          case "\v":
          case "\f":
          case " ":
          case " ":
          case "\ufeff":
          case " ":
          case "᠎":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case "　":
          case "-":
          case "+":
          case '"':
          case "'":
          case "`":
          case "{":
          case "}":
          case "(":
          case ")":
          case "[":
          case "]":
          case ";":
          case ",":
          case "~":
          case ":":
          case "?":
          case "<":
          case "=":
          case ">":
          case "^":
          case "%":
          case "!":
          case "*":
          case "&":
          case "|":
          case ".":
          case "/":
            e.idx--;
            break e;
        }
        l(e);
        var a = e.tokenLast;
        E(e, O.IDENTIFIER);
        var s = e.tokenLast;
        if (!a || !/^[.]$/.test(a.value)) switch (s.value) {
          case "null":
            s.type = O.NULL;
            break;

          case "true":
          case "false":
            s.type = O.BOOLEAN;
            break;

          case "let":
          case "static":
          case "implements":
          case "interface":
          case "package":
          case "private":
          case "protected":
          case "public":
          case "await":
          case "break":
          case "case":
          case "catch":
          case "class":
          case "const":
          case "continue":
          case "debugger":
          case "default":
          case "delete":
          case "do":
          case "else":
          case "enum":
          case "export":
          case "extends":
          case "finally":
          case "for":
          case "function":
          case "if":
          case "import":
          case "in":
          case "instanceof":
          case "new":
          case "return":
          case "super":
          case "switch":
          case "this":
          case "throw":
          case "try":
          case "typeof":
          case "var":
          case "void":
          case "while":
          case "with":
          case "yield":
            s.type = O.KEYWORD;
        }
        s.value.indexOf("@") > -1 && (s.type = O.MODIFIER), i(e);
    }
}, S = e => {
    if (k(e)) {
        e.idx++;
        e: for (;;) switch (e.idx++, r(e, 0)) {
          case "":
          case "\r":
          case "\n":
          case "\u2028":
          case "\u2029":
            e.idx--;
            break e;
        }
        var a = e.tokenLast;
        E(e, O.COMMENT_LINE), i(e), e.tokenLast = a;
    }
}, p = e => {
    if (k(e)) {
        e.idx++;
        e: for (;;) switch (e.idx++, r(e, 0)) {
          case "":
            c(e, O.COMMENT_BLOCK);
            break;

          case "\r":
            t(e, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            t(e, !0);
            break;

          case "*":
            if ("/" === r(e, 1)) {
                e.idx++;
                break e;
            }
        }
        var a = e.tokenLast;
        E(e, O.COMMENT_BLOCK), i(e), e.tokenLast = a;
    }
}, _ = e => {
    if (k(e)) {
        var a, s = 0;
        e: for (;;) switch (s && s--, e.idx++, a = r(e, 0)) {
          case "":
            c(e, O.STRING);
            break;

          case "\\":
            s || (s = 2);
            break;

          case '"':
          case "'":
            if (!s && a === e.source[e.rangeStart]) break e;
        }
        E(e, O.STRING), i(e);
    }
}, b = e => {
    if (k(e)) {
        var a = 0, s = !1;
        e: for (;;) switch (a && a--, e.idx++, r(e, 0)) {
          case "":
            c(e, O.TEMPLATE);
            break;

          case "\r":
            t(e, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            t(e, !0);
            break;

          case "\\":
            a || (a = 2);
            break;

          case "`":
            if (!a) {
                n(e, null);
                break e;
            }
            break;

          case "$":
            if (!a && "{" === r(e, 1)) {
                e.idx++, s = !0;
                break e;
            }
        }
        E(e, O.TEMPLATE), s && e.deep++;
        var d = e.tokenLast, l = d.value[0], o = d.value[d.value.length - 1];
        "`" === l ? "`" !== o && (d.type = O.TEMPLATE_HEAD) : d.type = "`" !== o ? O.TEMPLATE_MIDDLE : O.TEMPLATE_TAIL, 
        i(e);
    }
}, u = e => {
    if (k(e)) {
        var a = 0, s = 0;
        e: for (;;) switch (s && s--, e.idx++, r(e, 0)) {
          case "":
          case "\r":
          case "\n":
          case "\u2028":
          case "\u2029":
            c(e, O.REGULAR_EXPRESSION);
            break;

          case "\\":
            s || (s = 2);
            break;

          case "[":
            s || (a = 1);
            break;

          case "]":
            s || (a = 0);
            break;

          case "/":
            if (!s && !a) for (;;) if (e.idx++, !/\w/.test(r(e, 0))) {
                e.idx--;
                break e;
            }
        }
        E(e, O.REGULAR_EXPRESSION), i(e);
    }
}, T = (e, a, s) => {
    if (k(e)) {
        var t, n = a || s || 0;
        e.idx += n;
        e: for (;;) switch (e.idx++, t = r(e, 0)) {
          case "_":
            n && c(e, O.NUMERIC), n = 1;
            break;

          case ".":
            if (n && c(e, O.NUMERIC), a) {
                e.idx--;
                break e;
            }
            a = 1, n = 1;
            break;

          case "e":
          case "E":
            s && c(e, O.NUMERIC), s = 1, n = 1;
            break;

          case "+":
          case "-":
            if (1 !== s) {
                n && c(e, O.NUMERIC), e.idx--;
                break e;
            }
            s = 2;
            break;

          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            1 === s && (s = 2), n = 0;
            break;

          default:
            "n" !== t ? e.idx-- : n && c(e, O.NUMERIC);
            break e;
        }
        E(e, O.NUMERIC), i(e);
    }
}, f = e => {
    if (k(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, O.NUMERIC), s = 1;
            break;

          case "0":
          case "1":
            s = 0;
            break;

          default:
            "n" !== a ? e.idx-- : s && c(e, O.NUMERIC);
            break e;
        }
        E(e, O.NUMERIC), i(e);
    }
}, N = e => {
    if (k(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, O.NUMERIC), s = 1;
            break;

          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
            s = 0;
            break;

          default:
            "n" !== a ? e.idx-- : s && c(e, O.NUMERIC);
            break e;
        }
        E(e, O.NUMERIC), i(e);
    }
}, x = e => {
    if (k(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, O.NUMERIC), s = 1;
            break;

          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
          case "a":
          case "A":
          case "b":
          case "B":
          case "c":
          case "C":
          case "d":
          case "D":
          case "e":
          case "E":
          case "f":
          case "F":
            s = 0;
            break;

          default:
            "n" !== a ? e.idx-- : s && c(e, O.NUMERIC);
            break e;
        }
        E(e, O.NUMERIC), i(e);
    }
}, L = (e, a) => {
    if (k(e)) {
        var s = 0;
        e: for (;!(null != a && e.idx >= a); ) switch (s && s--, e.idx++, r(e, 0)) {
          case "":
            break e;

          case "\r":
            t(e, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            t(e, !0);
            break;

          case "\\":
            s || (s = 2);
            break;

          case "{":
            if (null == a && !s) {
                e.idx--;
                break e;
            }
            break;

          case "<":
            if (null == a && r(e, 1).trim()) {
                e.idx--;
                break e;
            }
        }
        E(e, O.JSX_TEXT), i(e);
    }
}, R = e => {
    if (k(e)) {
        e.idx++;
        e: for (;;) switch (e.idx++, r(e, 0)) {
          case "":
            break e;

          case "\r":
            t(e, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            t(e, !0);
            break;

          case "-":
            if ("-" === r(e, 1) && ">" === r(e, 2)) {
                e.idx += 2;
                break e;
            }
        }
        var a = e.tokenLast;
        E(e, O.JSX_COMMENT), i(e), e.tokenLast = a;
    }
}, (i, {loc: E = !1, range: l = !1, strict: C = !0, useJSX: I = !0, insideJSX: A = !1, skipStyleTags: X = !1, skipScriptTags: M = !1, parseScriptTags: m = !1, considerChildlessTags: v = !1, proxyCtx: h = {}, proxy: J = s} = {}) => {
    var D = I && A ? "%><%" : "", P = {
        source: i,
        isBreakLoop: !1,
        proxy: J,
        proxyCtx: h,
        loc: E,
        range: l,
        useJSX: I,
        skipStyleTags: X,
        skipScriptTags: M,
        parseScriptTags: m,
        considerChildlessTags: v,
        tokens: [],
        tokenLast: null,
        tagNameLast: "",
        idx: -1,
        line: 1,
        lineStart: 1,
        deep: 0,
        columnDiff: 0,
        rangeStart: 0,
        columnStart: 0,
        ENV: D,
        __env__: [ D ]
    };
    return (s => {
        var i, E, l, C, I;
        e: for (;!s.isBreakLoop; ) if (s.idx++, i = r(s, 0), "%><%" === s.ENV) switch (i) {
          case "":
            break e;

          case "{":
            n(s, "%jsxexp%"), d(s, 0, O.JSX_EXPRESSION_START), s.deep++;
            break;

          case "<":
            r(s, 1).trim() ? (s.idx--, n(s, "%jsxtag%")) : L(s);
            break;

          default:
            L(s);
        } else switch (i) {
          case "":
            break e;

          case "\r":
            t(s, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            t(s, !0);
            break;

          case "\t":
          case "\v":
          case "\f":
          case " ":
          case " ":
          case "\ufeff":
          case " ":
          case "᠎":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case " ":
          case "　":
            break;

          case '"':
          case "'":
            _(s);
            break;

          case "`":
            n(s, "%``%"), b(s);
            break;

          case "0":
            switch (r(s, 1)) {
              case "b":
              case "B":
                f(s);
                break;

              case "o":
              case "O":
                N(s);
                break;

              case "x":
              case "X":
                x(s);
                break;

              case ".":
                T(s, 1, 0);
                break;

              case "e":
              case "E":
                T(s, 0, 1);
                break;

              default:
                T(s, 0, 0);
            }
            break;

          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            T(s, 0, 0);
            break;

          case ".":
            switch (E = r(s, 1)) {
              case "0":
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
              case "7":
              case "8":
              case "9":
                T(s, 1, 0);
                break;

              default:
                d(s, E === i && r(s, 2) === i ? 2 : 0);
            }
            break;

          case "{":
            n(s, "%{}%"), d(s, 0), s.deep++;
            break;

          case "}":
            switch (s.ENV) {
              case "%``%":
                s.deep--, b(s);
                break;

              case "%{}%":
                s.deep--, n(s, null), d(s, 0);
                break;

              case "%jsxexp%":
                s.deep--, n(s, null), d(s, 0, O.JSX_EXPRESSION_END);
                break;

              default:
                c(s, 'Bracket "}"');
            }
            break;

          case "(":
            n(s, "%()%"), d(s, 0), s.deep++;
            break;

          case ")":
            "%()%" === s.ENV ? (s.deep--, n(s, null), d(s, 0)) : c(s, 'Bracket ")"');
            break;

          case "[":
            n(s, "%[]%"), d(s, 0), s.deep++;
            break;

          case "]":
            "%[]%" === s.ENV ? (s.deep--, n(s, null), d(s, 0)) : c(s, 'Bracket "]"');
            break;

          case ";":
          case ",":
          case "~":
          case ":":
            d(s, 0);
            break;

          case "^":
          case "%":
            d(s, "=" !== r(s, 1) ? 0 : 1);
            break;

          case "!":
            d(s, "=" !== r(s, 1) ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "+":
          case "-":
            d(s, "=" === (E = r(s, 1)) || E === i ? 1 : 0);
            break;

          case "?":
            d(s, "." === (E = r(s, 1)) ? 1 : E !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "*":
          case "&":
          case "|":
            d(s, "=" === (E = r(s, 1)) ? 1 : E !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "=":
            d(s, ">" === (E = r(s, 1)) ? 1 : E !== i ? 0 : r(s, 2) !== i ? 1 : 2);
            break;

          case "<":
            E = r(s, 1), s.useJSX && ("%jsxtag%" === s.ENV && ~n(s, null) || "/" === E && "%script%" === s.ENV[0] && (">" === r(s, 2) || s.source.slice(s.idx + 2, s.idx + 2 + s.ENV[1].length) === s.ENV[1]) || (!(I = s.tokenLast) || I.type === O.KEYWORD || I.type === O.MODIFIER || I.type === O.JSX_EXPRESSION_START || I.type === O.PUCNTUATOR && /[^!.})\]]$/.test(I.value)) && !a(s.source, s.idx)) ? E.trim() ? "!" === E && "-" === r(s, 2) && "-" === r(s, 3) ? R(s) : "/" !== E || /[/*]/.test(r(s, 2)) ? (d(s, 0, O.JSX_TAG_OPENER_START), 
            s.tagNameLast = "", n(s, "%<>%"), s.deep++) : ("%><%" !== s.ENV && "%script%" !== s.ENV[0] || (n(s, null), 
            s.deep--), d(s, 1, O.JSX_TAG_CLOSER_START), n(s, "%</>%"), s.deep++) : d(s, 0) : d(s, "=" === (E = r(s, 1)) ? 1 : E !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case ">":
            switch (s.ENV) {
              case "%<>%":
                if (n(s, null), "script" === s.tagNameLast) {
                    if (s.deep--, d(s, 0, O.JSX_TAG_OPENER_END), s.deep++, s.skipScriptTags) {
                        n(s, "%><%");
                        var A = s.source.indexOf("</script", s.idx);
                        A < 0 && c(s, "script"), L(s, A - 1);
                    } else s.parseScriptTags ? n(s, [ "%script%", s.tagNameLast ]) : n(s, "%><%");
                    break;
                }
                if ("style" === s.tagNameLast) {
                    if (s.deep--, d(s, 0, O.JSX_TAG_OPENER_END), s.deep++, n(s, "%><%"), s.skipStyleTags) {
                        var X = s.source.indexOf("</style", s.idx);
                        X < 0 && c(s, "style"), L(s, X - 1);
                    }
                    break;
                }
                /^[!?%]/.test(s.tagNameLast) || s.considerChildlessTags && (C = s.tagNameLast, !0 === g[C]) ? (s.deep--, 
                d(s, 0, O.JSX_TAG_OPENER_END_CHILDLESS)) : (s.deep--, d(s, 0, O.JSX_TAG_OPENER_END), 
                s.deep++, n(s, "%><%"));
                break;

              case "%</>%":
                s.deep--, n(s, null), d(s, 0, O.JSX_TAG_CLOSER_END);
                break;

              default:
                d(s, "=" === (E = r(s, 1)) ? 1 : E !== i ? 0 : "=" === (l = r(s, 2)) ? 2 : l !== i ? 1 : "=" !== r(s, 3) ? 2 : 3);
            }
            break;

          case "/":
            switch (E = r(s, 1)) {
              case "/":
                S(s);
                break;

              case "*":
                p(s);
                break;

              default:
                "<" === s.ENV[1] && ">" === E ? (s.deep--, n(s, null), d(s, 1, "/" !== s.ENV[2] ? O.JSX_TAG_OPENER_END_CHILDLESS : O.JSX_TAG_CLOSER_END)) : e(s.tokenLast) ? u(s) : d(s, "=" === E ? 1 : 0);
            }
            break;

          default:
            o(s);
        }
        k(s);
    })(P), C && P.deep && c(P, "deep"), P.tokens;
});

exports.CHILDLESS_TAGS = g, exports.TYPES = O, exports.jsx2tokens = C;
