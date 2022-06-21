/* eslint-disable */
/*
dester builds:
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e, a, s, c, r, t, i, n, o, d, l, p, k, u, x, b, E, f, S, T, N, _, m, g = {
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
}, O = (e = e => !e || "Keyword" === e.type || "Modifier" === e.type || "JSXExpressionStart" === e.type || "Punctuator" === e.type && "!.})]".indexOf(e.value) < 0, 
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
o = (e, a) => {
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
}, d = e => {
    if (e.rangeStart < e.idx) {
        e.idx--;
        var a = e.tokenLast;
        o(e, "Space"), a && a.deep > e.tokenLast.deep && (e.tokenLast.deep = a.deep), i(e), 
        e.tokenLast = a, e.idx++;
    }
    return e.rangeStart = e.idx, e.lineStart = e.line, e.columnStart = e.idx - e.columnDiff, 
    !e.isBreakLoop;
}, l = (e, a, s = "Punctuator") => {
    d(e) && (a && (e.idx += a), o(e, s), i(e));
}, p = e => {
    if (d(e)) {
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
        o(e, "Identifier");
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
}, k = e => {
    if (d(e)) {
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
        o(e, "CommentLine"), i(e), e.tokenLast = a;
    }
}, u = e => {
    if (d(e)) {
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
        o(e, "CommentBlock"), i(e), e.tokenLast = a;
    }
}, x = e => {
    if (d(e)) {
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
        o(e, "String"), i(e);
    }
}, b = e => {
    if (d(e)) {
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
        o(e, "Template"), s && e.deep++;
        var l = e.tokenLast, p = l.value[0], k = l.value[l.value.length - 1];
        "`" === p ? "`" !== k && (l.type = "TemplateHead") : l.type = "`" !== k ? "TemplateMiddle" : "TemplateTail", 
        i(e);
    }
}, E = e => {
    if (d(e)) {
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
        o(e, "RegularExpression"), i(e);
    }
}, f = (e, a, s) => {
    if (d(e)) {
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
        o(e, "Numeric"), i(e);
    }
}, S = e => {
    if (d(e)) {
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
        o(e, "Numeric"), i(e);
    }
}, T = e => {
    if (d(e)) {
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
        o(e, "Numeric"), i(e);
    }
}, N = e => {
    if (d(e)) {
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
        o(e, "Numeric"), i(e);
    }
}, _ = e => {
    if (d(e)) {
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
        o(e, "JSXText"), i(e);
    }
}, m = e => {
    if (d(e)) {
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
        o(e, "JSXComment"), i(e), e.tokenLast = a;
    }
}, (i, {strict: o = !0, useJSX: d = !0, insideJSX: O = !1, parseStyleTags: L = !1, parseScriptTags: v = !1, considerChildlessTags: X = !1, proxy: h = s} = {}, J) => {
    var w = d && O ? "%><%" : "", y = {
        source: i,
        isBreakLoop: !1,
        proxy: h,
        useJSX: d,
        parseStyleTags: L,
        parseScriptTags: v,
        considerChildlessTags: X,
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
        ENV: w,
        __env__: [ w ]
    };
    return (s => {
        var i, o, d, O, L;
        e: for (;!s.isBreakLoop; ) if (s.idx++, i = r(s, 0), "%><%" === s.ENV) switch (i) {
          case "":
            break e;

          case "{":
            n(s, "%jsxexp%"), l(s, 0, "JSXExpressionStart"), s.deep++;
            break;

          case "<":
            r(s, 1).trim() ? (s.idx--, n(s, "%jsxtag%")) : _(s);
            break;

          default:
            _(s);
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
            x(s);
            break;

          case "`":
            n(s, "%``%"), b(s);
            break;

          case "0":
            switch (r(s, 1)) {
              case "b":
              case "B":
                S(s);
                break;

              case "o":
              case "O":
                T(s);
                break;

              case "x":
              case "X":
                N(s);
                break;

              case ".":
                f(s, 1, 0);
                break;

              case "e":
              case "E":
                f(s, 0, 1);
                break;

              default:
                f(s, 0, 0);
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
            f(s, 0, 0);
            break;

          case ".":
            switch (o = r(s, 1)) {
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
                f(s, 1, 0);
                break;

              default:
                l(s, o === i && r(s, 2) === i ? 2 : 0);
            }
            break;

          case "{":
            n(s, "%{}%"), l(s, 0), s.deep++;
            break;

          case "}":
            switch (s.ENV) {
              case "%``%":
                s.deep--, b(s);
                break;

              case "%{}%":
                s.deep--, n(s, null), l(s, 0);
                break;

              case "%jsxexp%":
                s.deep--, n(s, null), l(s, 0, "JSXExpressionEnd");
                break;

              default:
                c(s, 'Bracket "}"');
            }
            break;

          case "(":
            n(s, "%()%"), l(s, 0), s.deep++;
            break;

          case ")":
            "%()%" === s.ENV ? (s.deep--, n(s, null), l(s, 0)) : c(s, 'Bracket ")"');
            break;

          case "[":
            n(s, "%[]%"), l(s, 0), s.deep++;
            break;

          case "]":
            "%[]%" === s.ENV ? (s.deep--, n(s, null), l(s, 0)) : c(s, 'Bracket "]"');
            break;

          case ";":
          case ",":
          case "~":
          case ":":
            l(s, 0);
            break;

          case "^":
          case "%":
            l(s, "=" !== r(s, 1) ? 0 : 1);
            break;

          case "!":
            l(s, "=" !== r(s, 1) ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "+":
          case "-":
            l(s, "=" === (o = r(s, 1)) || o === i ? 1 : 0);
            break;

          case "?":
            l(s, "." === (o = r(s, 1)) ? 1 : o !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "*":
          case "&":
          case "|":
            l(s, "=" === (o = r(s, 1)) ? 1 : o !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case "=":
            l(s, ">" === (o = r(s, 1)) ? 1 : o !== i ? 0 : r(s, 2) !== i ? 1 : 2);
            break;

          case "<":
            o = r(s, 1), s.useJSX && ("%jsxtag%" === s.ENV && ~n(s, null) || "/" === o && "%script%" === s.ENV[0] && (">" === r(s, 2) || s.source.slice(s.idx + 2, s.idx + 2 + s.ENV[1].length) === s.ENV[1]) || (!(L = s.tokenLast) || "Keyword" === L.type || "Modifier" === L.type || "JSXExpressionStart" === L.type || "Punctuator" === L.type && /[^!.})\]]$/.test(L.value)) && !a(s.source, s.idx)) ? o.trim() ? "!" === o && "-" === r(s, 2) && "-" === r(s, 3) ? m(s) : "/" !== o || /[/*]/.test(r(s, 2)) ? (l(s, 0, "JSXTagOpenerStart"), 
            s.tagNameLast = "", n(s, "%<>%"), s.deep++) : ("%><%" !== s.ENV && "%script%" !== s.ENV[0] || (n(s, null), 
            s.deep--), l(s, 1, "JSXTagCloserStart"), n(s, "%</>%")) : l(s, 0) : l(s, "=" === (o = r(s, 1)) ? 1 : o !== i ? 0 : "=" !== r(s, 2) ? 1 : 2);
            break;

          case ">":
            switch (s.ENV) {
              case "%<>%":
                n(s, null), s.parseScriptTags && "script" === s.tagNameLast || s.parseStyleTags && "style" === s.tagNameLast ? (l(s, 0, "JSXTagOpenerEnd"), 
                s.deep++, n(s, [ "%script%", s.tagNameLast ])) : /^[!?%]/.test(s.tagNameLast) || s.considerChildlessTags && (O = s.tagNameLast, 
                !0 === g[O]) ? (s.deep--, l(s, 0, "JSXTagOpenerEnd")) : (l(s, 0, "JSXTagOpenerEnd"), 
                s.deep++, n(s, "%><%"));
                break;

              case "%</>%":
                s.deep--, n(s, null), l(s, 0, "JSXTagCloserEnd");
                break;

              default:
                l(s, "=" === (o = r(s, 1)) ? 1 : o !== i ? 0 : "=" === (d = r(s, 2)) ? 2 : d !== i ? 1 : "=" !== r(s, 3) ? 2 : 3);
            }
            break;

          case "/":
            switch (o = r(s, 1)) {
              case "/":
                k(s);
                break;

              case "*":
                u(s);
                break;

              default:
                "<" === s.ENV[1] && ">" === o ? (s.deep--, n(s, null), l(s, 1, "/" !== s.ENV[2] ? "JSXTagOpenerEnd" : "JSXTagCloserEnd")) : e(s.tokenLast) ? E(s) : l(s, "=" === o ? 1 : 0);
            }
            break;

          default:
            p(s);
        }
    })(y), o && y.deep && c(y, "deep"), y.tokens;
});

exports.CHILDLESS_TAGS = g, exports.TOKEN_BOOLEAN = "Boolean", exports.TOKEN_COMMENT_BLOCK = "CommentBlock", 
exports.TOKEN_COMMENT_LINE = "CommentLine", exports.TOKEN_IDENTIFIER = "Identifier", 
exports.TOKEN_JSX_COMMENT = "JSXComment", exports.TOKEN_JSX_EXPRESSION_END = "JSXExpressionEnd", 
exports.TOKEN_JSX_EXPRESSION_START = "JSXExpressionStart", exports.TOKEN_JSX_TAG_CLOSER_END = "JSXTagCloserEnd", 
exports.TOKEN_JSX_TAG_CLOSER_START = "JSXTagCloserStart", exports.TOKEN_JSX_TAG_OPENER_END = "JSXTagOpenerEnd", 
exports.TOKEN_JSX_TAG_OPENER_START = "JSXTagOpenerStart", exports.TOKEN_JSX_TEXT = "JSXText", 
exports.TOKEN_KEYWORD = "Keyword", exports.TOKEN_MODIFIER = "Modifier", exports.TOKEN_NULL = "Null", 
exports.TOKEN_NUMERIC = "Numeric", exports.TOKEN_PUCNTUATOR = "Punctuator", exports.TOKEN_REGULAR_EXPRESSION = "RegularExpression", 
exports.TOKEN_SPACE = "Space", exports.TOKEN_STRING = "String", exports.TOKEN_TEMPLATE = "Template", 
exports.TOKEN_TEMPLATE_HEAD = "TemplateHead", exports.TOKEN_TEMPLATE_MIDDLE = "TemplateMiddle", 
exports.TOKEN_TEMPLATE_TAIL = "TemplateTail", exports.jsx2tokens = O;
