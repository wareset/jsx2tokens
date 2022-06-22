/* eslint-disable */
/*
dester builds:
index.ts
*/
var e, a, s, c, r, t, i, n, E, k, d, l, o, S, p, b, _, u, T, N, f, x, L, R = {
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
}, g = (e = e => !e || e.type === R.KEYWORD || e.type === R.MODIFIER || e.type === R.JSX_EXPRESSION_START || e.type === R.PUCNTUATOR && "!.})]".indexOf(e.value) < 0, 
a = (e, a) => {
    for (var s = !1, c = !1, r = a + 1; r < e.length; r++) if (c || (c = !/\s/.test(e[r]))) {
        if ("," === e[r] || "=" === e[r]) return !0;
        if (!s && ("-" === e[r] || ">" === e[r])) return !1;
        if (/\s/.test(e[r])) s = !0; else if (s) return /^extends\s$/.test(e.slice(r, r + 8));
    }
    return !1;
}, s = (e, ...a) => {
    throw new Error("jsx2tokens - " + a.join(" ") + ": " + JSON.stringify({
        line: e.lineStart,
        column: e.columnStart,
        range: e.rangeStart
    }));
}, c = (e, a) => e.source.charAt(e.idx + a), r = (e, a) => {
    (a || "\n" !== c(e, 1)) && (e.line++, e.columnDiff = e.idx + 1);
}, t = e => {
    e.proxy && (e.isBreakLoop = !!e.proxy(e.tokenLast, e.tokens.length - 1, e.tokens, e.proxyCtx));
}, i = (e, a) => (null === a ? e.__env__.pop() : a && e.__env__.push(a), e.ENV = e.__env__[e.__env__.length - 1] || ""), 
n = (e, a) => {
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
}, E = e => {
    if (e.rangeStart < e.idx) {
        e.idx--;
        var a = e.tokenLast;
        n(e, R.SPACE), a && a.deep > e.tokenLast.deep && (e.tokenLast.deep = a.deep), t(e), 
        e.tokenLast = a, e.idx++;
    }
    return e.rangeStart = e.idx, e.lineStart = e.line, e.columnStart = e.idx - e.columnDiff, 
    !e.isBreakLoop;
}, k = (e, a, s = R.PUCNTUATOR) => {
    E(e) && (a && (e.idx += a), d(e), n(e, s), t(e));
}, d = e => {
    e.tokenLast && e.tokenLast.type === R.JSX_TAG_OPENER_START && (e.tagNameLast = e.source.slice(e.rangeStart, e.idx + 1));
}, l = e => {
    if (E(e)) {
        e: for (;;) switch (e.idx++, c(e, 0)) {
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
        n(e, R.IDENTIFIER);
        var s = e.tokenLast;
        if (!a || !/^[.]$/.test(a.value)) switch (s.value) {
          case "null":
            s.type = R.NULL;
            break;

          case "true":
          case "false":
            s.type = R.BOOLEAN;
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
            s.type = R.KEYWORD;
        }
        s.value.indexOf("@") > -1 && (s.type = R.MODIFIER), t(e);
    }
}, o = e => {
    if (E(e)) {
        e.idx++;
        e: for (;;) switch (e.idx++, c(e, 0)) {
          case "":
          case "\r":
          case "\n":
          case "\u2028":
          case "\u2029":
            e.idx--;
            break e;
        }
        var a = e.tokenLast;
        n(e, R.COMMENT_LINE), t(e), e.tokenLast = a;
    }
}, S = e => {
    if (E(e)) {
        e.idx++;
        e: for (;;) switch (e.idx++, c(e, 0)) {
          case "":
            s(e, R.COMMENT_BLOCK);
            break;

          case "\r":
            r(e, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            r(e, !0);
            break;

          case "*":
            if ("/" === c(e, 1)) {
                e.idx++;
                break e;
            }
        }
        var a = e.tokenLast;
        n(e, R.COMMENT_BLOCK), t(e), e.tokenLast = a;
    }
}, p = e => {
    if (E(e)) {
        var a, r = 0;
        e: for (;;) switch (r && r--, e.idx++, a = c(e, 0)) {
          case "":
            s(e, R.STRING);
            break;

          case "\\":
            r || (r = 2);
            break;

          case '"':
          case "'":
            if (!r && a === e.source[e.rangeStart]) break e;
        }
        n(e, R.STRING), t(e);
    }
}, b = e => {
    if (E(e)) {
        var a = 0, k = !1;
        e: for (;;) switch (a && a--, e.idx++, c(e, 0)) {
          case "":
            s(e, R.TEMPLATE);
            break;

          case "\r":
            r(e, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            r(e, !0);
            break;

          case "\\":
            a || (a = 2);
            break;

          case "`":
            if (!a) {
                i(e, null);
                break e;
            }
            break;

          case "$":
            if (!a && "{" === c(e, 1)) {
                e.idx++, k = !0;
                break e;
            }
        }
        n(e, R.TEMPLATE), k && e.deep++;
        var d = e.tokenLast, l = d.value[0], o = d.value[d.value.length - 1];
        "`" === l ? "`" !== o && (d.type = R.TEMPLATE_HEAD) : d.type = "`" !== o ? R.TEMPLATE_MIDDLE : R.TEMPLATE_TAIL, 
        t(e);
    }
}, _ = e => {
    if (E(e)) {
        var a = 0, r = 0;
        e: for (;;) switch (r && r--, e.idx++, c(e, 0)) {
          case "":
          case "\r":
          case "\n":
          case "\u2028":
          case "\u2029":
            s(e, R.REGULAR_EXPRESSION);
            break;

          case "\\":
            r || (r = 2);
            break;

          case "[":
            r || (a = 1);
            break;

          case "]":
            r || (a = 0);
            break;

          case "/":
            if (!r && !a) for (;;) if (e.idx++, !/\w/.test(c(e, 0))) {
                e.idx--;
                break e;
            }
        }
        n(e, R.REGULAR_EXPRESSION), t(e);
    }
}, u = (e, a, r) => {
    if (E(e)) {
        var i, k = a || r || 0;
        e.idx += k;
        e: for (;;) switch (e.idx++, i = c(e, 0)) {
          case "_":
            k && s(e, R.NUMERIC), k = 1;
            break;

          case ".":
            if (k && s(e, R.NUMERIC), a) {
                e.idx--;
                break e;
            }
            a = 1, k = 1;
            break;

          case "e":
          case "E":
            r && s(e, R.NUMERIC), r = 1, k = 1;
            break;

          case "+":
          case "-":
            if (1 !== r) {
                k && s(e, R.NUMERIC), e.idx--;
                break e;
            }
            r = 2;
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
            1 === r && (r = 2), k = 0;
            break;

          default:
            "n" !== i ? e.idx-- : k && s(e, R.NUMERIC);
            break e;
        }
        n(e, R.NUMERIC), t(e);
    }
}, T = e => {
    if (E(e)) {
        var a, r = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = c(e, 0)) {
          case "_":
            r && s(e, R.NUMERIC), r = 1;
            break;

          case "0":
          case "1":
            r = 0;
            break;

          default:
            "n" !== a ? e.idx-- : r && s(e, R.NUMERIC);
            break e;
        }
        n(e, R.NUMERIC), t(e);
    }
}, N = e => {
    if (E(e)) {
        var a, r = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = c(e, 0)) {
          case "_":
            r && s(e, R.NUMERIC), r = 1;
            break;

          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
            r = 0;
            break;

          default:
            "n" !== a ? e.idx-- : r && s(e, R.NUMERIC);
            break e;
        }
        n(e, R.NUMERIC), t(e);
    }
}, f = e => {
    if (E(e)) {
        var a, r = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = c(e, 0)) {
          case "_":
            r && s(e, R.NUMERIC), r = 1;
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
            r = 0;
            break;

          default:
            "n" !== a ? e.idx-- : r && s(e, R.NUMERIC);
            break e;
        }
        n(e, R.NUMERIC), t(e);
    }
}, x = (e, a) => {
    if (E(e)) {
        var s = 0;
        e: for (;!(null != a && e.idx >= a); ) switch (s && s--, e.idx++, c(e, 0)) {
          case "":
            break e;

          case "\r":
            r(e, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            r(e, !0);
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
            if (null == a && c(e, 1).trim()) {
                e.idx--;
                break e;
            }
        }
        n(e, R.JSX_TEXT), t(e);
    }
}, L = e => {
    if (E(e)) {
        e.idx++;
        e: for (;;) switch (e.idx++, c(e, 0)) {
          case "":
            break e;

          case "\r":
            r(e, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            r(e, !0);
            break;

          case "-":
            if ("-" === c(e, 1) && ">" === c(e, 2)) {
                e.idx += 2;
                break e;
            }
        }
        var a = e.tokenLast;
        n(e, R.JSX_COMMENT), t(e), e.tokenLast = a;
    }
}, (t, {loc: n = !1, range: d = !1, strict: g = !0, useJSX: C = !0, insideJSX: I = !1, skipStyleTags: A = !1, skipScriptTags: X = !1, parseScriptTags: M = !1, considerChildlessTags: m = !1, proxyCtx: v = {}, proxy: h} = {}) => {
    var J = C && I ? "%><%" : "", y = {
        source: t,
        isBreakLoop: !1,
        proxy: h,
        proxyCtx: v,
        loc: n,
        range: d,
        useJSX: C,
        skipStyleTags: A,
        skipScriptTags: X,
        parseScriptTags: M,
        considerChildlessTags: m,
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
        ENV: J,
        __env__: [ J ]
    };
    return (t => {
        var n, d, g, C, I;
        e: for (;!t.isBreakLoop; ) if (t.idx++, n = c(t, 0), "%><%" === t.ENV) switch (n) {
          case "":
            break e;

          case "{":
            i(t, "%jsxexp%"), k(t, 0, R.JSX_EXPRESSION_START), t.deep++;
            break;

          case "<":
            c(t, 1).trim() ? (t.idx--, i(t, "%jsxtag%")) : x(t);
            break;

          default:
            x(t);
        } else switch (n) {
          case "":
            break e;

          case "\r":
            r(t, !1);
            break;

          case "\n":
          case "\u2028":
          case "\u2029":
            r(t, !0);
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
            p(t);
            break;

          case "`":
            i(t, "%``%"), b(t);
            break;

          case "0":
            switch (c(t, 1)) {
              case "b":
              case "B":
                T(t);
                break;

              case "o":
              case "O":
                N(t);
                break;

              case "x":
              case "X":
                f(t);
                break;

              case ".":
                u(t, 1, 0);
                break;

              case "e":
              case "E":
                u(t, 0, 1);
                break;

              default:
                u(t, 0, 0);
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
            u(t, 0, 0);
            break;

          case ".":
            switch (d = c(t, 1)) {
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
                u(t, 1, 0);
                break;

              default:
                k(t, d === n && c(t, 2) === n ? 2 : 0);
            }
            break;

          case "{":
            i(t, "%{}%"), k(t, 0), t.deep++;
            break;

          case "}":
            switch (t.ENV) {
              case "%``%":
                t.deep--, b(t);
                break;

              case "%{}%":
                t.deep--, i(t, null), k(t, 0);
                break;

              case "%jsxexp%":
                t.deep--, i(t, null), k(t, 0, R.JSX_EXPRESSION_END);
                break;

              default:
                s(t, 'Bracket "}"');
            }
            break;

          case "(":
            i(t, "%()%"), k(t, 0), t.deep++;
            break;

          case ")":
            "%()%" === t.ENV ? (t.deep--, i(t, null), k(t, 0)) : s(t, 'Bracket ")"');
            break;

          case "[":
            i(t, "%[]%"), k(t, 0), t.deep++;
            break;

          case "]":
            "%[]%" === t.ENV ? (t.deep--, i(t, null), k(t, 0)) : s(t, 'Bracket "]"');
            break;

          case ";":
          case ",":
          case "~":
          case ":":
            k(t, 0);
            break;

          case "^":
          case "%":
            k(t, "=" !== c(t, 1) ? 0 : 1);
            break;

          case "!":
            k(t, "=" !== c(t, 1) ? 0 : "=" !== c(t, 2) ? 1 : 2);
            break;

          case "+":
          case "-":
            k(t, "=" === (d = c(t, 1)) || d === n ? 1 : 0);
            break;

          case "?":
            k(t, "." === (d = c(t, 1)) ? 1 : d !== n ? 0 : "=" !== c(t, 2) ? 1 : 2);
            break;

          case "*":
          case "&":
          case "|":
            k(t, "=" === (d = c(t, 1)) ? 1 : d !== n ? 0 : "=" !== c(t, 2) ? 1 : 2);
            break;

          case "=":
            k(t, ">" === (d = c(t, 1)) ? 1 : d !== n ? 0 : c(t, 2) !== n ? 1 : 2);
            break;

          case "<":
            d = c(t, 1), t.useJSX && ("%jsxtag%" === t.ENV && ~i(t, null) || "/" === d && "%script%" === t.ENV[0] && (">" === c(t, 2) || t.source.slice(t.idx + 2, t.idx + 2 + t.ENV[1].length) === t.ENV[1]) || (!(I = t.tokenLast) || I.type === R.KEYWORD || I.type === R.MODIFIER || I.type === R.JSX_EXPRESSION_START || I.type === R.PUCNTUATOR && /[^!.})\]]$/.test(I.value)) && !a(t.source, t.idx)) ? d.trim() ? "!" === d && "-" === c(t, 2) && "-" === c(t, 3) ? L(t) : "/" !== d || /[/*]/.test(c(t, 2)) ? (k(t, 0, R.JSX_TAG_OPENER_START), 
            t.tagNameLast = "", i(t, "%<>%"), t.deep++) : ("%><%" !== t.ENV && "%script%" !== t.ENV[0] || (i(t, null), 
            t.deep--), k(t, 1, R.JSX_TAG_CLOSER_START), i(t, "%</>%"), t.deep++) : k(t, 0) : k(t, "=" === (d = c(t, 1)) ? 1 : d !== n ? 0 : "=" !== c(t, 2) ? 1 : 2);
            break;

          case ">":
            switch (t.ENV) {
              case "%<>%":
                if (i(t, null), "script" === t.tagNameLast) {
                    if (t.deep--, k(t, 0, R.JSX_TAG_OPENER_END), t.deep++, t.parseScriptTags) i(t, [ "%script%", t.tagNameLast ]); else if (i(t, "%><%"), 
                    t.skipScriptTags) {
                        var A = t.source.indexOf("</script", t.idx);
                        A < 0 && s(t, "script"), x(t, A - 1);
                    }
                    break;
                }
                if ("style" === t.tagNameLast) {
                    if (t.deep--, k(t, 0, R.JSX_TAG_OPENER_END), t.deep++, i(t, "%><%"), t.skipStyleTags) {
                        var X = t.source.indexOf("</style", t.idx);
                        X < 0 && s(t, "style"), x(t, X - 1);
                    }
                    break;
                }
                /^[!?%]/.test(t.tagNameLast) || t.considerChildlessTags && (C = t.tagNameLast, !0 === O[C]) ? (t.deep--, 
                k(t, 0, R.JSX_TAG_OPENER_END_CHILDLESS)) : (t.deep--, k(t, 0, R.JSX_TAG_OPENER_END), 
                t.deep++, i(t, "%><%"));
                break;

              case "%</>%":
                t.deep--, i(t, null), k(t, 0, R.JSX_TAG_CLOSER_END);
                break;

              default:
                k(t, "=" === (d = c(t, 1)) ? 1 : d !== n ? 0 : "=" === (g = c(t, 2)) ? 2 : g !== n ? 1 : "=" !== c(t, 3) ? 2 : 3);
            }
            break;

          case "/":
            switch (d = c(t, 1)) {
              case "/":
                o(t);
                break;

              case "*":
                S(t);
                break;

              default:
                "<" === t.ENV[1] && ">" === d ? (t.deep--, i(t, null), k(t, 1, "/" !== t.ENV[2] ? R.JSX_TAG_OPENER_END_CHILDLESS : R.JSX_TAG_CLOSER_END)) : e(t.tokenLast) ? _(t) : k(t, "=" === d ? 1 : 0);
            }
            break;

          default:
            l(t);
        }
        E(t);
    })(y), g && y.deep && s(y, "deep"), y.tokens;
});

export { O as CHILDLESS_TAGS, R as TOKEN_TYPES, g as jsx2tokens };
