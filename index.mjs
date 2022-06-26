/* eslint-disable */
/*
dester builds:
index.ts
*/
var e, a, s, c, r, t, i, n, E, l, k, d, o, S, u, p, b, _, T, f, N, x, L, R, g = {
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
}, O = {
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
}, C = (a = e = (a, s) => !a || a.type === g.KEYWORD || a.type === g.MODIFIER || a.type === g.JSX_EXPRESSION_START || a.type === g.PUCNTUATOR && !/^(--|\+\+|[!.})\]])$/.test(a.value) || "!" === a.value && (a !== s.tl2 && e(s.tl2, s) || a !== s.tl3 && e(s.tl3, s)), 
s = (e, a) => {
    for (var s = !1, c = !1, r = a + 1; r < e.length; r++) if (c || (c = !/\s/.test(e[r]))) {
        if ("," === e[r] || "=" === e[r]) return !0;
        if (!s && ("-" === e[r] || ">" === e[r])) return !1;
        if (/\s/.test(e[r])) s = !0; else if (s) return /^extends\s$/.test(e.slice(r, r + 8));
    }
    return !1;
}, c = (e, ...a) => {
    throw new Error("jsx2tokens - " + a.join(" ") + ": " + JSON.stringify({
        value: e.source.slice(e.rangeStart, e.idx + 1),
        line: e.lineStart,
        column: e.columnStart,
        range: e.rangeStart
    }));
}, r = (e, a) => e.source.charAt(e.idx + a), t = (e, a) => {
    (a || "\n" !== r(e, 1)) && (e.line++, e.columnDiff = e.idx + 1);
}, i = e => {
    e.proxy && (e.isBreakLoop = !!e.proxy(e.tokenLast, e.tokens.length - 1, e.tokens, e.proxyCtx));
}, n = (e, a) => (null === a ? e.__env__.pop() : a && e.__env__.push(a), e.ENV = e.__env__[e.__env__.length - 1] || ""), 
E = (e, a) => {
    e.tl3 = e.tl2, e.tl2 = e.tokenLast, e.tokenLast = {
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
}, l = e => {
    if (e.rangeStart < e.idx) {
        e.idx--;
        var a = e.tokenLast;
        E(e, g.SPACE), a && a.deep > e.tokenLast.deep && (e.tokenLast.deep = a.deep), i(e), 
        e.tokenLast = a, e.idx++;
    }
    return e.rangeStart = e.idx, e.lineStart = e.line, e.columnStart = e.idx - e.columnDiff, 
    !e.isBreakLoop;
}, k = (e, a, s = g.PUCNTUATOR) => {
    l(e) && (a && (e.idx += a), d(e), E(e, s), i(e));
}, d = e => {
    e.tokenLast && e.tokenLast.type === g.JSX_TAG_OPENER_START && (e.tagNameLast = e.source.slice(e.rangeStart, e.idx + 1));
}, o = e => {
    if (l(e)) {
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
        d(e);
        var a = e.tokenLast;
        E(e, g.IDENTIFIER);
        var s = e.tokenLast;
        if (!a || !/^[.]$/.test(a.value)) switch (s.value) {
          case "null":
            s.type = g.NULL;
            break;

          case "true":
          case "false":
            s.type = g.BOOLEAN;
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
            s.type = g.KEYWORD;
        }
        s.value.indexOf("@") > -1 && (s.type = g.MODIFIER), i(e);
    }
}, S = e => {
    if (l(e)) {
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
        E(e, g.COMMENT_LINE), i(e), e.tokenLast = a;
    }
}, u = e => {
    if (l(e)) {
        e.idx++;
        e: for (;;) switch (e.idx++, r(e, 0)) {
          case "":
            c(e, g.COMMENT_BLOCK);
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
        E(e, g.COMMENT_BLOCK), i(e), e.tokenLast = a;
    }
}, p = e => {
    if (l(e)) {
        var a, s = 0;
        e: for (;;) switch (s && s--, e.idx++, a = r(e, 0)) {
          case "":
            c(e, g.STRING);
            break;

          case "\\":
            s || (s = 2);
            break;

          case '"':
          case "'":
            if (!s && a === e.source[e.rangeStart]) break e;
        }
        E(e, g.STRING), i(e);
    }
}, b = e => {
    if (l(e)) {
        var a = 0, s = !1;
        e: for (;;) switch (a && a--, e.idx++, r(e, 0)) {
          case "":
            c(e, g.TEMPLATE);
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
        E(e, g.TEMPLATE), s && e.deep++;
        var k = e.tokenLast, d = k.value[0], o = k.value[k.value.length - 1];
        "`" === d ? "`" !== o && (k.type = g.TEMPLATE_HEAD) : k.type = "`" !== o ? g.TEMPLATE_MIDDLE : g.TEMPLATE_TAIL, 
        i(e);
    }
}, _ = e => {
    if (l(e)) {
        var a = 0, s = 0;
        e: for (;;) switch (s && s--, e.idx++, r(e, 0)) {
          case "":
          case "\r":
          case "\n":
          case "\u2028":
          case "\u2029":
            c(e, g.REGULAR_EXPRESSION);
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
        E(e, g.REGULAR_EXPRESSION), i(e);
    }
}, T = (e, a, s, t) => {
    if (l(e)) {
        var n;
        e.idx += t;
        e: for (;;) switch (e.idx++, n = r(e, 0)) {
          case "_":
            t && c(e, g.NUMERIC), t = 1;
            break;

          case ".":
            if (1 !== a && t && c(e, g.NUMERIC), a || s) {
                e.idx--;
                break e;
            }
            a = 1, t = 1;
            break;

          case "e":
          case "E":
            (s || t) && c(e, g.NUMERIC), s = 1, t = 1;
            break;

          case "+":
          case "-":
            if (1 !== s) {
                e.idx--;
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
            1 === s && (s = 2), 1 === a && (a = 2), t = 0;
            break;

          default:
            "n" !== n && e.idx--, t && c(e, g.NUMERIC);
            break e;
        }
        E(e, g.NUMERIC), i(e);
    }
}, f = e => {
    if (l(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, g.NUMERIC), s = 1;
            break;

          case "0":
          case "1":
            s = 0;
            break;

          default:
            "n" !== a ? e.idx-- : s && c(e, g.NUMERIC);
            break e;
        }
        E(e, g.NUMERIC), i(e);
    }
}, N = e => {
    if (l(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, g.NUMERIC), s = 1;
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
            "n" !== a ? e.idx-- : s && c(e, g.NUMERIC);
            break e;
        }
        E(e, g.NUMERIC), i(e);
    }
}, x = e => {
    if (l(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, g.NUMERIC), s = 1;
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
            "n" !== a ? e.idx-- : s && c(e, g.NUMERIC);
            break e;
        }
        E(e, g.NUMERIC), i(e);
    }
}, L = (e, a) => {
    if (l(e)) {
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
        E(e, g.JSX_TEXT), i(e);
    }
}, R = e => {
    if (l(e)) {
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
        E(e, g.JSX_COMMENT), i(e);
    }
}, (i, {loc: E = !1, range: d = !1, strict: C = !0, useJSX: A = !0, insideJSX: I = !1, skipStyleTags: X = !1, skipScriptTags: M = !1, parseScriptTags: m = !1, considerChildlessTags: v = !1, proxyCtx: h = {}, proxy: J} = {}) => {
    var D = A && I ? "%><%" : "", P = {
        source: i,
        isBreakLoop: !1,
        proxy: J,
        proxyCtx: h,
        loc: E,
        range: d,
        useJSX: A,
        skipStyleTags: X,
        skipScriptTags: M,
        parseScriptTags: m,
        considerChildlessTags: v,
        tokens: [],
        tokenLast: null,
        tl2: null,
        tl3: null,
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
    return (i => {
        var E, d, C, A;
        e: for (;!i.isBreakLoop; ) if (i.idx++, E = r(i, 0), "%><%" === i.ENV) switch (E) {
          case "":
            break e;

          case "{":
            n(i, "%jsxexp%"), k(i, 0, g.JSX_EXPRESSION_START), i.deep++;
            break;

          case "<":
            r(i, 1).trim() ? (i.idx--, n(i, "%jsxtag%")) : L(i);
            break;

          default:
            L(i);
        } else switch (E) {
          case "":
            break e;

          case "\r":
            t(i, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            t(i, !0);
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
            p(i);
            break;

          case "`":
            n(i, "%``%"), b(i);
            break;

          case "0":
            switch (r(i, 1)) {
              case "b":
              case "B":
                f(i);
                break;

              case "o":
              case "O":
                N(i);
                break;

              case "x":
              case "X":
                x(i);
                break;

              case ".":
                T(i, 1, 0, 1);
                break;

              case "e":
              case "E":
                T(i, 0, 1, 1);
                break;

              default:
                T(i, 0, 0, 0);
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
            T(i, 0, 0, 0);
            break;

          case ".":
            switch (d = r(i, 1)) {
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
                T(i, 1, 0, 0);
                break;

              default:
                k(i, d === E && r(i, 2) === E ? 2 : 0);
            }
            break;

          case "{":
            n(i, "%{}%"), k(i, 0), i.deep++;
            break;

          case "}":
            switch (i.ENV) {
              case "%``%":
                i.deep--, b(i);
                break;

              case "%{}%":
                i.deep--, n(i, null), k(i, 0);
                break;

              case "%jsxexp%":
                i.deep--, n(i, null), k(i, 0, g.JSX_EXPRESSION_END);
                break;

              default:
                c(i, 'Bracket "}"');
            }
            break;

          case "(":
            n(i, "%()%"), k(i, 0), i.deep++;
            break;

          case ")":
            "%()%" === i.ENV ? (i.deep--, n(i, null), k(i, 0)) : c(i, 'Bracket ")"');
            break;

          case "[":
            n(i, "%[]%"), k(i, 0), i.deep++;
            break;

          case "]":
            "%[]%" === i.ENV ? (i.deep--, n(i, null), k(i, 0)) : c(i, 'Bracket "]"');
            break;

          case ";":
          case ",":
          case "~":
          case ":":
            k(i, 0);
            break;

          case "^":
          case "%":
            k(i, "=" !== r(i, 1) ? 0 : 1);
            break;

          case "!":
            k(i, "=" !== r(i, 1) ? 0 : "=" !== r(i, 2) ? 1 : 2);
            break;

          case "+":
          case "-":
            k(i, "=" === (d = r(i, 1)) || d === E ? 1 : 0);
            break;

          case "?":
            k(i, (d = r(i, 1)) !== E ? 0 : "=" !== r(i, 2) ? 1 : 2);
            break;

          case "*":
          case "&":
          case "|":
            k(i, "=" === (d = r(i, 1)) ? 1 : d !== E ? 0 : "=" !== r(i, 2) ? 1 : 2);
            break;

          case "=":
            k(i, ">" === (d = r(i, 1)) ? 1 : d !== E ? 0 : r(i, 2) !== E ? 1 : 2);
            break;

          case "<":
            d = r(i, 1), i.useJSX && ("%jsxtag%" === i.ENV && ~n(i, null) || "/" === d && "%script%" === i.ENV[0] && (">" === r(i, 2) || i.source.slice(i.idx + 2, i.idx + 2 + i.ENV[1].length) === i.ENV[1]) || a(i.tokenLast, i) && !s(i.source, i.idx)) ? d.trim() ? "!" === d && "-" === r(i, 2) && "-" === r(i, 3) ? R(i) : "/" !== d || /[/*]/.test(r(i, 2)) ? (k(i, 0, g.JSX_TAG_OPENER_START), 
            i.tagNameLast = "", n(i, "%<>%"), i.deep++) : ("%><%" !== i.ENV && "%script%" !== i.ENV[0] || (n(i, null), 
            i.deep--), k(i, 1, g.JSX_TAG_CLOSER_START), n(i, "%</>%"), i.deep++) : k(i, 0) : k(i, "=" === (d = r(i, 1)) ? 1 : d !== E ? 0 : "=" !== r(i, 2) ? 1 : 2);
            break;

          case ">":
            switch (i.ENV) {
              case "%<>%":
                if (n(i, null), "script" === i.tagNameLast) {
                    if (i.deep--, k(i, 0, g.JSX_TAG_OPENER_END), i.deep++, i.parseScriptTags) n(i, [ "%script%", i.tagNameLast ]); else if (n(i, "%><%"), 
                    i.skipScriptTags) {
                        var I = i.source.indexOf("</script", i.idx);
                        I < 0 && c(i, "script"), L(i, I - 1);
                    }
                    break;
                }
                if ("style" === i.tagNameLast) {
                    if (i.deep--, k(i, 0, g.JSX_TAG_OPENER_END), i.deep++, n(i, "%><%"), i.skipStyleTags) {
                        var X = i.source.indexOf("</style", i.idx);
                        X < 0 && c(i, "style"), L(i, X - 1);
                    }
                    break;
                }
                /^[!?%]/.test(i.tagNameLast) || i.considerChildlessTags && (A = i.tagNameLast, !0 === O[A]) ? (i.deep--, 
                k(i, 0, g.JSX_TAG_OPENER_END_CHILDLESS)) : (i.deep--, k(i, 0, g.JSX_TAG_OPENER_END), 
                i.deep++, n(i, "%><%"));
                break;

              case "%</>%":
                i.deep--, n(i, null), k(i, 0, g.JSX_TAG_CLOSER_END);
                break;

              default:
                k(i, "=" === (d = r(i, 1)) ? 1 : d !== E ? 0 : "=" === (C = r(i, 2)) ? 2 : C !== E ? 1 : "=" !== r(i, 3) ? 2 : 3);
            }
            break;

          case "/":
            switch (d = r(i, 1)) {
              case "/":
                S(i);
                break;

              case "*":
                u(i);
                break;

              default:
                "<" === i.ENV[1] && ">" === d ? (i.deep--, n(i, null), k(i, 1, "/" !== i.ENV[2] ? g.JSX_TAG_OPENER_END_CHILDLESS : g.JSX_TAG_CLOSER_END)) : e(i.tokenLast, i) ? _(i) : k(i, "=" === d ? 1 : 0);
            }
            break;

          default:
            o(i);
        }
        l(i);
    })(P), C && P.deep && c(P, "deep"), P.tokens;
});

export { O as CHILDLESS_TAGS, g as TOKEN_TYPES, C as jsx2tokens };
