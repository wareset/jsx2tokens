/* eslint-disable */
/*
dester builds:
index.ts
*/
var e, a, s, c, r, t, i, n, d, l, o, k, u, p, b, f, x, m, S, g, N, h, v, E = "Boolean", T = "Identifier", w = "Keyword", L = "Null", y = "Numeric", J = "Punctuator", X = "RegularExpression", _ = "String", C = "Template", V = "TemplateHead", B = "TemplateMiddle", O = "TemplateTail", j = "CommentBlock", M = "CommentLine", D = "Space", K = "Modifier", P = "JSXTagOpenerStart", $ = "JSXTagOpenerEnd", R = "JSXTagCloserStart", A = "JSXTagCloserEnd", H = "JSXExpressionStart", I = "JSXExpressionEnd", F = "JSXText", q = "JSXComment", z = {
    img: !0,
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    input: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
}, G = (e = e => !e || "Keyword" === e.type || "Modifier" === e.type || "JSXExpressionStart" === e.type || "Punctuator" === e.type && "!.})]".indexOf(e.value) < 0, 
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
    e.isBreakLoop = !!e.proxy(e.tokenLast, e.tokens.length - 1, e.tokens, e.cbCtx);
}, n = (e, a) => (null === a ? e.__env__.pop() : a && e.__env__.push(a), e.ENV = e.__env__[e.__env__.length - 1] || ""), 
d = (e, a) => {
    e.tokenLast = {
        deep: e.deep,
        type: a,
        value: e.source.slice(e.rangeStart, e.idx + 1),
        range: [ e.rangeStart, e.rangeStart = e.idx + 1 ],
        loc: {
            start: {
                line: e.lineStart,
                column: e.columnStart
            },
            end: {
                line: e.line,
                column: e.columnStart = e.idx - e.columnDiff + 1
            }
        }
    }, e.tokens.push(e.tokenLast);
}, l = e => {
    if (e.rangeStart < e.idx) {
        e.idx--;
        var a = e.tokenLast;
        d(e, "Space"), a && a.deep > e.tokenLast.deep && (e.tokenLast.deep = a.deep), i(e), 
        e.tokenLast = a, e.idx++;
    }
    return e.rangeStart = e.idx, e.lineStart = e.line, e.columnStart = e.idx - e.columnDiff, 
    !e.isBreakLoop;
}, o = (e, a, s = "Punctuator") => {
    l(e) && (a && (e.idx += a), d(e, s), i(e));
}, k = e => {
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
        var a = e.tokenLast;
        d(e, "Identifier");
        var s = e.tokenLast;
        if (a && "JSXTagOpenerStart" === a.type && (e.tagNameLast = s.value), !a || !/^[.]$/.test(a.value)) switch (s.value) {
          case "null":
            s.type = "Null";
            break;

          case "true":
          case "false":
            s.type = "Boolean";
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
            s.type = "Keyword";
        }
        s.value.indexOf("@") > -1 && (s.type = "Modifier"), i(e);
    }
}, u = e => {
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
        d(e, "CommentLine"), i(e), e.tokenLast = a;
    }
}, p = e => {
    if (l(e)) {
        e.idx++;
        e: for (;;) switch (e.idx++, r(e, 0)) {
          case "":
            c(e, "CommentBlock");
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
        d(e, "CommentBlock"), i(e), e.tokenLast = a;
    }
}, b = e => {
    if (l(e)) {
        var a, s = 0;
        e: for (;;) switch (s && s--, e.idx++, a = r(e, 0)) {
          case "":
            c(e, "String");
            break;

          case "\\":
            s || (s = 2);
            break;

          case '"':
          case "'":
            if (!s && a === e.source[e.rangeStart]) break e;
        }
        d(e, "String"), i(e);
    }
}, f = e => {
    if (l(e)) {
        var a = 0, s = !1;
        e: for (;;) switch (a && a--, e.idx++, r(e, 0)) {
          case "":
            c(e, "Template");
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
        d(e, "Template"), s && e.deep++;
        var o = e.tokenLast, k = o.value[0], u = o.value[o.value.length - 1];
        "`" === k ? "`" !== u && (o.type = "TemplateHead") : o.type = "`" !== u ? "TemplateMiddle" : "TemplateTail", 
        i(e);
    }
}, x = e => {
    if (l(e)) {
        var a = 0, s = 0;
        e: for (;;) switch (s && s--, e.idx++, r(e, 0)) {
          case "":
          case "\r":
          case "\n":
          case "\u2028":
          case "\u2029":
            c(e, "RegularExpression");
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
        d(e, "RegularExpression"), i(e);
    }
}, m = (e, a, s) => {
    if (l(e)) {
        var t, n = a || s || 0;
        e.idx += n;
        e: for (;;) switch (e.idx++, t = r(e, 0)) {
          case "_":
            n && c(e, "Numeric"), n = 1;
            break;

          case ".":
            if (n && c(e, "Numeric"), a) {
                e.idx--;
                break e;
            }
            a = 1, n = 1;
            break;

          case "e":
          case "E":
            s && c(e, "Numeric"), s = 1, n = 1;
            break;

          case "+":
          case "-":
            if (1 !== s) {
                n && c(e, "Numeric"), e.idx--;
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
            "n" !== t ? e.idx-- : n && c(e, "Numeric");
            break e;
        }
        d(e, "Numeric"), i(e);
    }
}, S = e => {
    if (l(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, "Numeric"), s = 1;
            break;

          case "0":
          case "1":
            s = 0;
            break;

          default:
            "n" !== a ? e.idx-- : s && c(e, "Numeric");
            break e;
        }
        d(e, "Numeric"), i(e);
    }
}, g = e => {
    if (l(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, "Numeric"), s = 1;
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
            "n" !== a ? e.idx-- : s && c(e, "Numeric");
            break e;
        }
        d(e, "Numeric"), i(e);
    }
}, N = e => {
    if (l(e)) {
        var a, s = 1;
        e.idx++;
        e: for (;;) switch (e.idx++, a = r(e, 0)) {
          case "_":
            s && c(e, "Numeric"), s = 1;
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
            "n" !== a ? e.idx-- : s && c(e, "Numeric");
            break e;
        }
        d(e, "Numeric"), i(e);
    }
}, h = e => {
    if (l(e)) {
        var a = 0;
        e: for (;;) switch (a && a--, e.idx++, r(e, 0)) {
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
            a || (a = 2);
            break;

          case "{":
            if (!a) {
                e.idx--;
                break e;
            }
            break;

          case "<":
            if (r(e, 1).trim()) {
                e.idx--;
                break e;
            }
        }
        d(e, "JSXText"), i(e);
    }
}, v = e => {
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
        var a = e.tokenLast;
        d(e, "JSXComment"), i(e), e.tokenLast = a;
    }
}, (i, {strict: d = !0, useJSX: l = !0, insideJSX: E = !1, parseStyleTags: T = !1, parseScriptTags: w = !1, considerChildlessTags: L = !1, proxy: y = s} = {}, J) => {
    var X = l && E ? "%><%" : "", _ = {
        source: i,
        isBreakLoop: !1,
        proxy: y,
        useJSX: l,
        parseStyleTags: T,
        parseScriptTags: w,
        considerChildlessTags: L,
        cbCtx: J || {},
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
        ENV: X,
        __env__: [ X ]
    };
    return (s => {
        var i, d, l, E, T;
        e: for (;!s.isBreakLoop; ) if (s.idx++, i = r(s, 0), "%><%" === s.ENV) switch (i) {
          case "":
            break e;

          case "{":
            n(s, "%jsxexp%"), o(s, 0, "JSXExpressionStart"), s.deep++;
            break;

          case "<":
            r(s, 1).trim() ? (s.idx--, n(s, "%jsxtag%")) : h(s);
            break;

          default:
            h(s);
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
            b(s);
            break;

          case "`":
            n(s, "%``%"), f(s);
            break;

          case "0":
            switch (r(s, 1)) {
              case "b":
              case "B":
                S(s);
                break;

              case "o":
              case "O":
                g(s);
                break;

              case "x":
              case "X":
                N(s);
                break;

              case ".":
                m(s, 1, 0);
                break;

              case "e":
              case "E":
                m(s, 0, 1);
                break;

              default:
                m(s, 0, 0);
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
            m(s, 0, 0);
            break;

          case ".":
            switch (d = r(s, 1)) {
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
                m(s, 1, 0);
                break;

              default:
                o(s, d === i && r(s, 2) === i ? 2 : 0);
            }
            break;

          case "{":
            n(s, "%{}%"), o(s, 0), s.deep++;
            break;

          case "}":
            switch (s.ENV) {
              case "%``%":
                s.deep--, f(s);
                break;

              case "%{}%":
                s.deep--, n(s, null), o(s, 0);
                break;

              case "%jsxexp%":
                s.deep--, n(s, null), o(s, 0, "JSXExpressionEnd");
                break;

              default:
                c(s, 'Bracket "}"');
            }
            break;

          case "(":
            n(s, "%()%"), o(s, 0), s.deep++;
            break;

          case ")":
            "%()%" === s.ENV ? (s.deep--, n(s, null), o(s, 0)) : c(s, 'Bracket ")"');
            break;

          case "[":
            n(s, "%[]%"), o(s, 0), s.deep++;
            break;

          case "]":
            "%[]%" === s.ENV ? (s.deep--, n(s, null), o(s, 0)) : c(s, 'Bracket "]"');
            break;

          case ";":
          case ",":
          case "~":
          case ":":
            o(s, 0);
            break;

          case "^":
          case "%":
            o(s, "=" !== r(s, 1) ? 0 : 1);
            break;

          case "!":
            o(s, "=" !== r(s, 1) ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "+":
          case "-":
            o(s, "=" === (d = r(s, 1)) || d === i ? 1 : 0);
            break;

          case "?":
            o(s, "." === (d = r(s, 1)) ? 1 : d !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "*":
          case "&":
          case "|":
            o(s, "=" === (d = r(s, 1)) ? 1 : d !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "=":
            o(s, ">" === (d = r(s, 1)) ? 1 : d !== i ? 0 : r(s, 2) !== i ? 1 : 2);
            break;

          case "<":
            d = r(s, 1), s.useJSX && ("%jsxtag%" === s.ENV && ~n(s, null) || "/" === d && "%script%" === s.ENV[0] && (">" === r(s, 2) || s.source.slice(s.idx + 2, s.idx + 2 + s.ENV[1].length) === s.ENV[1]) || (!(T = s.tokenLast) || "Keyword" === T.type || "Modifier" === T.type || "JSXExpressionStart" === T.type || "Punctuator" === T.type && /[^!.})\]]$/.test(T.value)) && !a(s.source, s.idx)) ? d.trim() ? "!" === d && "-" === r(s, 2) && "-" === r(s, 3) ? v(s) : "/" !== d || /[/*]/.test(r(s, 2)) ? (o(s, 0, "JSXTagOpenerStart"), 
            s.tagNameLast = "", n(s, "%<>%"), s.deep++) : ("%><%" !== s.ENV && "%script%" !== s.ENV[0] || (n(s, null), 
            s.deep--), o(s, 1, "JSXTagCloserStart"), n(s, "%</>%")) : o(s, 0) : o(s, "=" === (d = r(s, 1)) ? 1 : d !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case ">":
            switch (s.ENV) {
              case "%<>%":
                n(s, null), s.parseScriptTags && "script" === s.tagNameLast || s.parseStyleTags && "style" === s.tagNameLast ? (o(s, 0, "JSXTagOpenerEnd"), 
                s.deep++, n(s, [ "%script%", s.tagNameLast ])) : /^[!?%]/.test(s.tagNameLast) || s.considerChildlessTags && (E = s.tagNameLast, 
                !0 === z[E]) ? (s.deep--, o(s, 0, "JSXTagOpenerEnd")) : (o(s, 0, "JSXTagOpenerEnd"), 
                s.deep++, n(s, "%><%"));
                break;

              case "%</>%":
                s.deep--, n(s, null), o(s, 0, "JSXTagCloserEnd");
                break;

              default:
                o(s, "=" === (d = r(s, 1)) ? 1 : d !== i ? 0 : "=" === (l = r(s, 2)) ? 2 : l !== i ? 1 : "=" !== r(s, 3) ? 2 : 3);
            }
            break;

          case "/":
            switch (d = r(s, 1)) {
              case "/":
                u(s);
                break;

              case "*":
                p(s);
                break;

              default:
                "<" === s.ENV[1] && ">" === d ? (s.deep--, n(s, null), o(s, 1, "/" !== s.ENV[2] ? "JSXTagOpenerEnd" : "JSXTagCloserEnd")) : e(s.tokenLast) ? x(s) : o(s, "=" === d ? 1 : 0);
            }
            break;

          default:
            k(s);
        }
    })(_), d && _.deep && c(_, "deep"), _.tokens;
});

export { z as CHILDLESS_TAGS, E as TOKEN_BOOLEAN, j as TOKEN_COMMENT_BLOCK, M as TOKEN_COMMENT_LINE, T as TOKEN_IDENTIFIER, q as TOKEN_JSX_COMMENT, I as TOKEN_JSX_EXPRESSION_END, H as TOKEN_JSX_EXPRESSION_START, A as TOKEN_JSX_TAG_CLOSER_END, R as TOKEN_JSX_TAG_CLOSER_START, $ as TOKEN_JSX_TAG_OPENER_END, P as TOKEN_JSX_TAG_OPENER_START, F as TOKEN_JSX_TEXT, w as TOKEN_KEYWORD, K as TOKEN_MODIFIER, L as TOKEN_NULL, y as TOKEN_NUMERIC, J as TOKEN_PUCNTUATOR, X as TOKEN_REGULAR_EXPRESSION, D as TOKEN_SPACE, _ as TOKEN_STRING, C as TOKEN_TEMPLATE, V as TOKEN_TEMPLATE_HEAD, B as TOKEN_TEMPLATE_MIDDLE, O as TOKEN_TEMPLATE_TAIL, G as jsx2tokens };
