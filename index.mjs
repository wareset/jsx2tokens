/* eslint-disable */
var e=Array,a=Error,s=JSON.stringify,c={BOOLEAN:"Boolean",IDENTIFIER:"Identifier",KEYWORD:"Keyword",NULL:"Null",NUMERIC:"Numeric",PUCNTUATOR:"Punctuator",REGULAR_EXPRESSION:"RegularExpression",STRING:"String",TEMPLATE:"Template",TEMPLATE_HEAD:"TemplateHead",TEMPLATE_MIDDLE:"TemplateMiddle",TEMPLATE_TAIL:"TemplateTail",COMMENT_BLOCK:"CommentBlock",COMMENT_LINE:"CommentLine",SPACE:"Space",MODIFIER:"Modifier",JSX_TAG_OPENER_START:"JSXTagOpenerStart",JSX_TAG_OPENER_END:"JSXTagOpenerEnd",JSX_TAG_OPENER_END_CHILDLESS:"JSXTagOpenerEndChildless",JSX_TAG_CLOSER_START:"JSXTagCloserStart",JSX_TAG_CLOSER_END:"JSXTagCloserEnd",JSX_EXPRESSION_START:"JSXExpressionStart",JSX_EXPRESSION_END:"JSXExpressionEnd",JSX_TEXT:"JSXText",JSX_COMMENT:"JSXComment"},t={area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},r=function(){function r(e,a,s,t){return!e||e.type===c.MODIFIER||e.type===c.JSX_EXPRESSION_START||e.type===c.KEYWORD&&(!a||"."!==a.value)||"!"===e.value&&r(a,s,t,null)||e.type===c.PUCNTUATOR&&!/^(?:--|\+\+|[!.})\]])$/.test(e.value)}var i=r;function n(e,a){for(var s=!1,c=!1,t=a+1;t<e.length;t++)if(c||(c=!/\s/.test(e[t]))){if(","===e[t]||"="===e[t])return!0;if(!s&&("-"===e[t]||">"===e[t]))return!1;if(/\s/.test(e[t]))s=!0;else if(s)return/^extends\s$/.test(e.slice(t,t+8))}return!1}function o(c){for(var t=arguments.length,r=new e(t>1?t-1:0),i=1;i<t;i++)r[i-1]=arguments[i];throw new a("jsx2tokens - "+r.join(" ")+": "+s({value:c.source.slice(c.rangeStart,c.idx+1),line:c.lineStart,column:c.columnStart,range:c.rangeStart}))}function l(e,a){return e.source.charAt(e.idx+a)}function d(e,a){(a||"\n"!==l(e,1))&&(e.line++,e.columnDiff=e.idx+1)}function E(e){e.proxy&&(e.isBreakLoop=!!e.proxy(e.tokenLast,e.tokens.length-1,e.tokens,e.proxyCtx))}function k(e,a){return null===a?e.__env__.pop():a&&e.__env__.push(a),e.ENV=e.__env__[e.__env__.length-1]||""}function u(e,a){e.tl4=e.tl3,e.tl3=e.tl2,e.tl2=e.tokenLast,e.tokenLast={deep:e.deep,type:a,value:e.source.slice(e.rangeStart,e.idx+1)};var s=[e.rangeStart,e.rangeStart=e.idx+1],c={start:{line:e.lineStart,column:e.columnStart},end:{line:e.line,column:e.columnStart=e.idx-e.columnDiff+1}};e.loc&&(e.tokenLast.loc=c),e.range&&(e.tokenLast.range=s),e.tokens.push(e.tokenLast)}function f(e){if(e.rangeStart<e.idx){e.idx--;var a=e.tokenLast;u(e,c.SPACE),a&&a.deep>e.tokenLast.deep&&(e.tokenLast.deep=a.deep),E(e),e.tokenLast=a,e.idx++}return e.rangeStart=e.idx,e.lineStart=e.line,e.columnStart=e.idx-e.columnDiff,!e.isBreakLoop}function S(e,a,s){void 0===s&&(s=c.PUCNTUATOR),f(e)&&(a&&(e.idx+=a),p(e),u(e,s),E(e))}function p(e){e.tokenLast&&e.tokenLast.type===c.JSX_TAG_OPENER_START&&(e.tagNameLast=e.source.slice(e.rangeStart,e.idx+1))}function b(e){if(f(e)){e:for(;;)switch(e.idx++,l(e,0)){case"":case"\r":case"\n":case"\u2028":case"\u2029":case"\t":case"\v":case"\f":case" ":case" ":case"\ufeff":case" ":case"᠎":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case"　":case"-":case"+":case'"':case"'":case"`":case"{":case"}":case"(":case")":case"[":case"]":case";":case",":case"~":case":":case"?":case"<":case"=":case">":case"^":case"%":case"!":case"*":case"&":case"|":case".":case"/":e.idx--;break e}p(e),u(e,c.IDENTIFIER);var a=e.tokenLast;switch(a.value){case"null":a.type=c.NULL;break;case"true":case"false":a.type=c.BOOLEAN;break;case"let":case"static":case"implements":case"interface":case"package":case"private":case"protected":case"public":case"await":case"break":case"case":case"catch":case"class":case"const":case"continue":case"debugger":case"default":case"delete":case"do":case"else":case"enum":case"export":case"extends":case"finally":case"for":case"function":case"if":case"import":case"in":case"instanceof":case"new":case"return":case"super":case"switch":case"this":case"throw":case"try":case"typeof":case"var":case"void":case"while":case"with":case"yield":a.type=c.KEYWORD;break;default:a.value.indexOf("@")>-1&&(a.type=c.MODIFIER)}E(e)}}function _(e){if(f(e)){e.idx++;e:for(;;)switch(e.idx++,l(e,0)){case"":case"\r":case"\n":case"\u2028":case"\u2029":e.idx--;break e}var a=e.tokenLast;u(e,c.COMMENT_LINE),E(e),e.tokenLast=a}}function T(e){if(f(e)){e.idx++;e:for(;;)switch(e.idx++,l(e,0)){case"":o(e,c.COMMENT_BLOCK);break;case"\r":d(e,!1);break;case"\n":case"\u2028":case"\u2029":d(e,!0);break;case"*":if("/"===l(e,1)){e.idx++;break e}}var a=e.tokenLast;u(e,c.COMMENT_BLOCK),E(e),e.tokenLast=a}}function N(e){if(f(e)){var a,s=0;e:for(;;)switch(s&&s--,e.idx++,a=l(e,0)){case"":o(e,c.STRING);break;case"\\":s||(s=2);break;case'"':case"'":if(!s&&a===e.source[e.rangeStart])break e}u(e,c.STRING),E(e)}}function x(e){if(f(e)){var a=0,s=!1;e:for(;;)switch(a&&a--,e.idx++,l(e,0)){case"":o(e,c.TEMPLATE);break;case"\r":d(e,!1);break;case"\n":case"\u2028":case"\u2029":d(e,!0);break;case"\\":a||(a=2);break;case"`":if(!a){k(e,null);break e}break;case"$":if(!a&&"{"===l(e,1)){e.idx++,s=!0;break e}}u(e,c.TEMPLATE),s&&e.deep++;var t=e.tokenLast,r=t.value[0],i=t.value[t.value.length-1];"`"===r?"`"!==i&&(t.type=c.TEMPLATE_HEAD):t.type="`"!==i?c.TEMPLATE_MIDDLE:c.TEMPLATE_TAIL,E(e)}}function L(e){if(f(e)){var a=0,s=0;e:for(;;)switch(s&&s--,e.idx++,l(e,0)){case"":case"\r":case"\n":case"\u2028":case"\u2029":o(e,c.REGULAR_EXPRESSION);break;case"\\":s||(s=2);break;case"[":s||(a=1);break;case"]":s||(a=0);break;case"/":if(!s&&!a)for(;;)if(e.idx++,!/\w/.test(l(e,0))){e.idx--;break e}}u(e,c.REGULAR_EXPRESSION),E(e)}}function R(e,a,s,t){if(f(e)){var r;e.idx+=t;e:for(;;)switch(e.idx++,r=l(e,0)){case"_":t&&o(e,c.NUMERIC),t=1;break;case".":if(1!==a&&t&&o(e,c.NUMERIC),a||s){e.idx--;break e}a=1,t=1;break;case"e":case"E":(s||t)&&o(e,c.NUMERIC),s=1,t=1;break;case"+":case"-":if(1!==s){e.idx--;break e}s=2;break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":1===s&&(s=2),1===a&&(a=2),t=0;break;default:"n"!==r&&e.idx--,t&&o(e,c.NUMERIC);break e}u(e,c.NUMERIC),E(e)}}function g(e){if(f(e)){var a,s=1;e.idx++;e:for(;;)switch(e.idx++,a=l(e,0)){case"_":s&&o(e,c.NUMERIC),s=1;break;case"0":case"1":s=0;break;default:"n"!==a?e.idx--:s&&o(e,c.NUMERIC);break e}u(e,c.NUMERIC),E(e)}}function v(e){if(f(e)){var a,s=1;e.idx++;e:for(;;)switch(e.idx++,a=l(e,0)){case"_":s&&o(e,c.NUMERIC),s=1;break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":s=0;break;default:"n"!==a?e.idx--:s&&o(e,c.NUMERIC);break e}u(e,c.NUMERIC),E(e)}}function O(e){if(f(e)){var a,s=1;e.idx++;e:for(;;)switch(e.idx++,a=l(e,0)){case"_":s&&o(e,c.NUMERIC),s=1;break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":case"a":case"A":case"b":case"B":case"c":case"C":case"d":case"D":case"e":case"E":case"f":case"F":s=0;break;default:"n"!==a?e.idx--:s&&o(e,c.NUMERIC);break e}u(e,c.NUMERIC),E(e)}}function C(e,a){if(f(e)){var s=0;e:for(;!(null!=a&&e.idx>=a);)switch(s&&s--,e.idx++,l(e,0)){case"":break e;case"\r":d(e,!1);break;case"\n":case"\u2028":case"\u2029":d(e,!0);break;case"\\":s||(s=2);break;case"{":if(null==a&&!s){e.idx--;break e}break;case"<":if(null==a&&l(e,1).trim()){e.idx--;break e}}u(e,c.JSX_TEXT),E(e)}}function A(e){if(f(e)){e.idx++;e:for(;;)switch(e.idx++,l(e,0)){case"":break e;case"\r":d(e,!1);break;case"\n":case"\u2028":case"\u2029":d(e,!0);break;case"-":if("-"===l(e,1)&&">"===l(e,2)){e.idx+=2;break e}}u(e,c.JSX_COMMENT),E(e)}}return function(e,a){var s=void 0===a?{}:a,E=s.loc,u=void 0!==E&&E,p=s.range,I=void 0!==p&&p,X=s.strict,M=void 0===X||X,m=s.useJSX,h=void 0===m||m,J=s.insideJSX,D=void 0!==J&&J,P=s.skipStyleTags,y=void 0!==P&&P,w=s.skipScriptTags,U=void 0!==w&&w,G=s.parseScriptTags,B=void 0!==G&&G,V=s.considerChildlessTags,K=void 0!==V&&V,j=s.proxyCtx,F=void 0===j?{}:j,H=s.proxy,Y=h&&D?"%><%":"",W={source:e,isBreakLoop:!1,proxy:void 0===H?void 0:H,proxyCtx:F,loc:u,range:I,useJSX:h,skipStyleTags:y,skipScriptTags:U,parseScriptTags:B,considerChildlessTags:K,tokens:[],tokenLast:null,tl2:null,tl3:null,tl4:null,tagNameLast:"",idx:-1,line:1,lineStart:1,deep:0,columnDiff:0,rangeStart:0,columnStart:0,ENV:Y,__env__:[Y]};return function(e){var a,s,E,u;e:for(;!e.isBreakLoop;)if(e.idx++,a=l(e,0),"%><%"===e.ENV)switch(a){case"":break e;case"{":k(e,"%jsxexp%"),S(e,0,c.JSX_EXPRESSION_START),e.deep++;break;case"<":l(e,1).trim()?(e.idx--,k(e,"%jsxtag%")):C(e);break;default:C(e)}else switch(a){case"":break e;case"\r":d(e,!1);break;case"\n":case"\u2028":case"\u2029":d(e,!0);break;case"\t":case"\v":case"\f":case" ":case" ":case"\ufeff":case" ":case"᠎":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case" ":case"　":break;case'"':case"'":N(e);break;case"`":k(e,"%``%"),x(e);break;case"0":switch(l(e,1)){case"b":case"B":g(e);break;case"o":case"O":v(e);break;case"x":case"X":O(e);break;case".":R(e,1,0,1);break;case"e":case"E":R(e,0,1,1);break;default:R(e,0,0,0)}break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":R(e,0,0,0);break;case".":switch(s=l(e,1)){case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":R(e,1,0,0);break;default:S(e,s===a&&l(e,2)===a?2:0)}break;case"{":k(e,"%{}%"),S(e,0),e.deep++;break;case"}":switch(e.ENV){case"%``%":e.deep--,x(e);break;case"%{}%":e.deep--,k(e,null),S(e,0);break;case"%jsxexp%":e.deep--,k(e,null),S(e,0,c.JSX_EXPRESSION_END);break;default:o(e,'Bracket "}"')}break;case"(":k(e,"%()%"),S(e,0),e.deep++;break;case")":"%()%"===e.ENV?(e.deep--,k(e,null),S(e,0)):o(e,'Bracket ")"');break;case"[":k(e,"%[]%"),S(e,0),e.deep++;break;case"]":"%[]%"===e.ENV?(e.deep--,k(e,null),S(e,0)):o(e,'Bracket "]"');break;case";":case",":case"~":case":":S(e,0);break;case"^":case"%":S(e,"="!==l(e,1)?0:1);break;case"!":S(e,"="!==l(e,1)?0:"="!==l(e,2)?1:2);break;case"+":case"-":S(e,"="===(s=l(e,1))||s===a?1:0);break;case"?":S(e,(s=l(e,1))!==a?0:"="!==l(e,2)?1:2);break;case"*":case"&":case"|":S(e,"="===(s=l(e,1))?1:s!==a?0:"="!==l(e,2)?1:2);break;case"=":S(e,">"===(s=l(e,1))?1:s!==a?0:l(e,2)!==a?1:2);break;case"<":s=l(e,1),e.useJSX&&("%jsxtag%"===e.ENV&&~k(e,null)||"/"===s&&"%script%"===e.ENV[0]&&(">"===l(e,2)||e.source.slice(e.idx+2,e.idx+2+e.ENV[1].length)===e.ENV[1])||i(e.tokenLast,e.tl2,e.tl3,e.tl4)&&!n(e.source,e.idx))?s.trim()?"!"===s&&"-"===l(e,2)&&"-"===l(e,3)?A(e):"/"!==s||/[/*]/.test(l(e,2))?(S(e,0,c.JSX_TAG_OPENER_START),e.tagNameLast="",k(e,"%<>%"),e.deep++):("%><%"!==e.ENV&&"%script%"!==e.ENV[0]||(k(e,null),e.deep--),S(e,1,c.JSX_TAG_CLOSER_START),k(e,"%</>%"),e.deep++):S(e,0):S(e,"="===(s=l(e,1))?1:s!==a?0:"="!==l(e,2)?1:2);break;case">":switch(e.ENV){case"%<>%":if(k(e,null),"script"===e.tagNameLast){if(e.deep--,S(e,0,c.JSX_TAG_OPENER_END),e.deep++,e.parseScriptTags)k(e,["%script%",e.tagNameLast]);else if(k(e,"%><%"),e.skipScriptTags){var p=e.source.indexOf("<\/script>",e.idx);p<0&&o(e,"script"),e.idx++,C(e,p-1)}break}if("style"===e.tagNameLast){if(e.deep--,S(e,0,c.JSX_TAG_OPENER_END),e.deep++,k(e,"%><%"),e.skipStyleTags){var I=e.source.indexOf("</style>",e.idx);I<0&&o(e,"style"),e.idx++,C(e,I-1)}break}/^[!?%]/.test(e.tagNameLast)||e.considerChildlessTags&&(u=e.tagNameLast,!0===t[u])?(e.deep--,S(e,0,c.JSX_TAG_OPENER_END_CHILDLESS)):(e.deep--,S(e,0,c.JSX_TAG_OPENER_END),e.deep++,k(e,"%><%"));break;case"%</>%":e.deep--,k(e,null),S(e,0,c.JSX_TAG_CLOSER_END);break;default:S(e,"="===(s=l(e,1))?1:s!==a?0:"="===(E=l(e,2))?2:E!==a?1:"="!==l(e,3)?2:3)}break;case"/":switch(s=l(e,1)){case"/":_(e);break;case"*":T(e);break;default:"<"===e.ENV[1]&&">"===s?(e.deep--,k(e,null),S(e,1,"/"!==e.ENV[2]?c.JSX_TAG_OPENER_END_CHILDLESS:c.JSX_TAG_CLOSER_END)):r(e.tokenLast,e.tl2,e.tl3,e.tl4)?L(e):S(e,"="===s?1:0)}break;default:b(e)}f(e)}(W),W.isBreakLoop||M&&W.deep&&o(W,"deep"),W.tokens}}();export{t as CHILDLESS_TAGS,c as TOKEN_TYPES,r as jsx2tokens};
