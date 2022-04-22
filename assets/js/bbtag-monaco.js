import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

// let _subtags = []

monaco.languages.register({ id: 'bbtag' })

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
  provideCompletionItems(model, position, context) {
    let prevBrace = model.findPreviousMatch('([{}])', position, true)?.range
    if (prevBrace == null || model.getValueInRange(prevBrace) === '}') {
      prevBrace = {
        startColumn: model.getWordUntilPosition(position).startColumn,
        startLineNumber: position.lineNumber
      }
    }
    const subtags = model.subtags?.() ?? []
    const range = {
      startColumn: prevBrace.startColumn,
      startLineNumber: prevBrace.startLineNumber,
      endColumn: position.column,
      endLineNumber: position.lineNumber
    }
    const sugg = subtags.map(t => t.signatures.map(s => renderTemplate(t, s).map(t => ({
      ...t,
      documentation: s.description,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range
    })))).flat().flat()
    return {
      suggestions: sugg
    }
  }
})

function renderTemplate(subtag, signature) {
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
  return patterns.map(p => ({
    label: `{${[signature.subtagName || subtag.name, ...p].join(';')}}`,
    insertText: `{${[signature.subtagName || subtag.name, ...p.map((p, i) => `\${${i + 1}:${p}}`)].join(';')}}`
  }))
}
