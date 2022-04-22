import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

// let _subtags = []

monaco.languages.register({ id: 'bbtag' })
monaco.languages.setLanguageConfiguration('bbtag', {
  wordPattern: /[^{};\s]+/,
  autoClosingPairs: [
    { open: '{', close: '}' }
  ],
  brackets: [
    ['{', '}']
  ],
  folding: {
    markers: {
      start: /{/,
      end: /}/
    }
  },
  indentationRules: {
    increaseIndentPattern: /{/,
    decreaseIndentPattern: /}/
  },
  comments: {
    blockComment: ['{//;', '}']
  }
})

monaco.languages.setMonarchTokensProvider('bbtag', {
  brackets: [
    ['{', '}', 'type']
  ],

  tokenizer: {
    root: [
      { include: '@text' },
      [/}/, 'invalid']
    ],
    text: [
      [/{/, { token: '@rematch', next: '@subtag' }]
    ],
    subtag: [
      [/{\s*\/\/\s*[;}]/, { token: 'comment', next: '@comment' }],
      [/{/, { token: '@brackets', next: '@subtagName' }],
      [/;/, { token: 'type', next: '@subtagArg' }],
      [/}/, { token: '@brackets', next: '@pop' }]
    ],
    subtagName: [
      { include: '@text' },
      [/[^{};]/, { token: 'keyword' }],
      [/;|}/, { token: '@rematch', next: '@pop' }]
    ],
    subtagArg: [
      { include: '@text' },
      [/[^{};]/, { token: 'string' }],
      [/;|}/, { token: '@rematch', next: '@pop' }]
    ],
    comment: [
      [/{/, { token: 'comment', next: '@comment' }],
      [/}/, { token: 'comment', next: '@pop' }],
      [/[^{}]/, { token: 'comment' }]
    ]
  }
})

monaco.languages.registerCompletionItemProvider('bbtag', {
  triggerCharacters: ['{'],
  provideCompletionItems(model, position) {
    return {
      suggestions: [...getSubtagCompletions(model, position)]
    }
  }
})

monaco.languages.registerHoverProvider('bbtag', {
  provideHover(model, position) {
    const subtags = model.subtags?.() ?? []
    const prevBrace = model.findPreviousMatch('[{;}]', position, true)?.range
    const nextBrace = model.findNextMatch('[{;}]', position, true)?.range
    if (prevBrace == null || nextBrace == null || model.getValueInRange(prevBrace) !== '{' || model.getValueInRange(nextBrace) === '{') {
      return undefined
    }
    const word = model.getWordAtPosition(position)
    const name = word?.word.toLowerCase()
    const subtag = subtags.find(s => s.name === name) || subtags.find(s => s.aliases?.includes(name))
    if (subtag === undefined) {
      return undefined
    }
    /** @type {monaco.IMarkdownString[]} */
    const contents = [
      { value: `\`\`\`bbtag\n{${subtag.name}} Subtag\n\`\`\`` }
    ]
    if (subtag.description) {
      contents.push({ value: subtag.description })
    }
    for (const signature of subtag.signatures) {
      let markdown = `\`\`\`bbtag\n${stringifySignature(subtag, signature)}\n\`\`\``
      if (signature.description) {
        markdown += `\n\n${signature.description}`
      }
      contents.push({ value: markdown })
    }
    return {
      range: {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      },
      contents
    }
  }
})

/**
 * @param {monaco.editor.ITextModel} model
 * @param {monaco.Position} position
 * @returns {Generator<monaco.languages.CompletionItem>}
 */
function* getSubtagCompletions(model, position) {
  let prevBrace = model.findPreviousMatch('[{;}]', position, true)?.range
  let nextBrace = model.findNextMatch('[{;}]', position, true)?.range
  if (prevBrace == null || model.getValueInRange(prevBrace) !== '{') {
    prevBrace = {
      startColumn: model.getWordUntilPosition(position).startColumn,
      startLineNumber: position.lineNumber
    }
  }
  if (nextBrace == null || model.getValueInRange(nextBrace) !== '}') {
    nextBrace = {
      endColumn: position.column,
      endLineNumber: position.lineNumber
    }
  }
  const subtags = model.subtags?.() ?? []
  const range = {
    startColumn: prevBrace.startColumn,
    startLineNumber: prevBrace.startLineNumber,
    endColumn: nextBrace.endColumn,
    endLineNumber: nextBrace.endLineNumber
  }

  for (const subtag of subtags) {
    for (const signature of subtag.signatures) {
      const parameters = [...signature.parameters]
      for (let i = 0; i < parameters.length; i++) {
        if (Array.isArray(parameters[i]?.nested)) {
          parameters.splice(i, 1, ...parameters[i--].nested)
        }
      }
      const patterns = [[]]
      for (const parameter of parameters) {
        if (parameter.required) {
          for (const pattern of patterns) {
            pattern.push(parameter.name)
          }
        } else {
          patterns.push([...patterns[0]])
          patterns[0].push(parameter.name)
        }
      }
      const names = signature.subtagName === undefined ? [subtag.name, ...subtag.aliases || []] : [signature.subtagName]
      for (const name of names) {
        for (const pattern of patterns) {
          yield {
            label: `{${[name, ...pattern].join(';')}}`,
            insertText: `{${[name, ...pattern.map((p, i) => `\${${i + 1}:{//;${p}\\}}`)].join(';')}}`,
            documentation: subtag.description,
            kind: monaco.languages.CompletionItemKind.Function,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          }
        }
      }
    }
  }
  if (subtags.some(s => s.name === 'function')) {
    yield {
      label: '{func.name;[args]...}',
      // eslint-disable-next-line no-template-curly-in-string
      insertText: '{func.${1:{//;name\\}};${2:{//;arguments\\}}}',
      documentation: 'Call a user defined function',
      kind: monaco.languages.CompletionItemKind.Function,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range
    }
  }
}

function stringifySignature(subtag, signature) {
  const out = []
  for (const param of signature.parameters) {
    out.push(stringifyParameter(param))
  }

  if (out.length > 0) {
    return `{${signature.subtagName || subtag.name};${out.join(';')}}`
  } else {
    return `{${signature.subtagName || subtag.name}}`
  }
}

function stringifyParameter(parameter) {
  if ('nested' in parameter) {
    if (parameter.nested.length === 1) {
      return stringifyParameter(parameter.nested[0]) + '...'
    }
    return `(${parameter.nested.map(stringifyParameter).join(';')})...`
  }
  return parameter.required ? `<${parameter.name}>` : `[${parameter.name}]`
}
