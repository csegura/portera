Prism.languages.jst = {
  // ^[\s]*at[\s]*([\w.]*|[\w.<\w>]*)[\s]*\(([\w:\\]?[\w\\]+[\w\/]+).js:([\d]*):([\d]*)\)

  "number": /([\d]*):([\d]*)/,
  //"number": /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  "keyword": /[\s]*([\w$\.]*|[\w\.<\w>]*)\s/,
  "string": /([\w\:\\]+|[\w\\]+[\w\/]+)/,
  "punctuation": /[.():]/,
  //"function": /at/,
  // "stack": {
  //   pattern: /^[\t ]*at[\t ]*([\w$\.]*|[\w\.<\w>]*)[\s]*\(([\w:\\]+|[\w\\]+[\w\/]+).js:([\d]*):([\d]*)\)/m,
  //   inside: {
  //     "string": {
  //       pattern: /[\t ]*([\w$\.]*|[\w\.<\w>]*)[\s]*\(/,
  //       //lookbehind: false,
  //     },
  //     "number": {
  //       pattern: /:([\d] *):([\d] *) \)/,
  //       //lookbehind: true,
  //     },
  //     "function": {
  //       pattern: /\(([\w: \\] +| [\w\\] + [\w\/]+).js:/,
  //       //lookbehind: true,
  //     },
  //     "punctuation": /[.\(\):]/,
  //   },
  // },
};
