<template>
  <div ref="wrapper">
    <textarea ref="editor" />
  </div>
</template>

<script>
export * from 'codemirror/lib/codemirror.css'
export * from 'codemirror/theme/monokai.css'
export * from 'codemirror/addon/hint/show-hint.css'

let CodeMirror = null
if (process.client) {
  CodeMirror = require('codemirror')
  require('codemirror/addon/mode/simple')
  require('codemirror/addon/edit/matchbrackets')
  require('codemirror/addon/edit/closebrackets')
  require('codemirror/addon/edit/matchtags')
  require('codemirror/addon/hint/show-hint')
}

const defaultValue =
  '{//;Start by typing an opening brace.\nDocumentation is available here: https://blargbot.xyz/bbtag/}'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      subtags: []
    }
  },
  async fetch () {
    const subtags = await this.$axios.$get('/subtags')
    this.subtags = Object.values(subtags)
      .map(t =>
        t.signatures.map(s => ({
          name: t.name,
          text: s.parameters.length > 0 ? t.name + ';' : t.name + '}',
          displayText: renderParameters(t, s)
        }))
      )
      .flat()
  },
  beforeDestroy () {
    this.$refs.wrapper.remove()
  },
  mounted () {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (!process.client) {
      return
    }
    const $this = this
    const elem = this.$refs.editor
    this.editor = CodeMirror?.fromTextArea(elem, {
      mode: 'cattag',
      lineNumbers: true,
      indentWithTabs: false,
      styleActiveLine: true,
      matchBrackets: true,
      smartIndent: true,
      autoCloseBrackets: false,
      theme: 'monokai',
      electricChars: true,
      lineWrapping: true,
      hintOptions: {
        get subtags () {
          return $this.subtags
        }
      },
      scrollbarStyle: null,
      tabMode: 'indent',
      extraKeys: {
        'Ctrl-Space' (editor) {
          editor.showHint()
        },
        'Ctrl-.' (editor) {
          editor.showHint()
        }
      }
    })
    this.setValue(this.value)
    this.editor?.on('inputRead', function (editor, change) {
      if (change.text[0] === '{') {
        editor.showHint()
      }
    })
    this.editor?.on('change', function (editor) {
      $this.$emit('input', editor.getValue())
    })
  },
  methods: {
    setValue (value) {
      this.editor?.setValue(value || defaultValue)
    }
  }
}

function renderParameters (item, signature) {
  const out = []
  for (const param of signature.parameters) {
    out.push(stringifyParameter(param))
  }

  if (out.length > 0) {
    return `{${signature.subtagName || item.name};${out.join(';')}}`
  } else {
    return `{${signature.subtagName || item.name}}`
  }
}
function stringifyParameter (parameter) {
  if ('nested' in parameter) {
    if (parameter.nested.length === 1) {
      return stringifyParameter(parameter.nested[0]) + '...'
    }
    return `(${parameter.nested.map(stringifyParameter).join(';')})...`
  }
  return parameter.required ? `<${parameter.name}>` : `[${parameter.name}]`
}

const brace = 'builtin'
const semiColon = 'bracket'
CodeMirror?.defineSimpleMode('cattag', {
  start: [
    { regex: /\d/, token: 'number' },
    { regex: /\{\/\//, token: 'comment', push: 'comment' },
    { regex: /\{/, token: brace, push: 'innerTag', indent: true },
    { regex: /[;}]/, token: brace },
    { regex: /[^{};]*/, token: 'bracket' }
  ],
  comment: [
    { regex: /\}/, token: 'comment', pop: true },
    { regex: /\{/, token: 'comment', push: 'comment' },
    { regex: /[^{}]*/, token: 'comment' }
  ],
  innerTag: [
    { regex: /\{\/\//, token: 'comment', push: 'comment' },
    { regex: /\{/, token: brace, push: 'innerTag', indent: true },
    { regex: /\}/, token: brace, pop: true, dedent: true },
    { regex: /([^{}; ]+)/, token: 'keyword' },
    { regex: /(;+)(\{\/\/)/, token: [semiColon, 'comment'], push: 'comment' },
    {
      regex: /(;+)(\{)/,
      token: [semiColon, brace],
      push: 'innerTag',
      indent: true
    },
    { regex: /(;+)(})/, token: [semiColon, brace], pop: true, dedent: true },
    { regex: /(;+)$/, token: [semiColon] },
    { regex: /(;+)(\d*)?([^{};]*)?/, token: [semiColon, 'number', 'string'] },
    { regex: /^(\d*)?([^{};]*)?/, token: ['number', 'string'] }
  ],
  args: [
    { regex: /\{\/\//, token: 'comment', push: 'comment' },
    { regex: /\{/, token: brace, push: 'innerTag', indent: true },
    { regex: /\}/, token: brace, pop: true, dedent: true },
    { regex: /;/, token: semiColon },
    { regex: /[^{};]+/, token: 'string' }
  ],
  meta: {}
})
CodeMirror?.registerHelper('hint', 'cattag', (editor, options) => {
  const cursor = editor.getCursor()
  const token = editor.getTokenAt(cursor)
  const end = CodeMirror.Pos(cursor.line, token.end)
  const [term, start] =
    token.string && /\w/.test(token.string.slice(-1))
      ? [token.string, CodeMirror.Pos(cursor.line, token.start)]
      : ['', end]

  const found = []
  for (const subtag of options.subtags || []) {
    if (subtag.name.slice(0, term.length) === term) {
      found.push({
        text: subtag.text,
        displayText: subtag.displayText
      })
    }
  }

  if (found.length > 0) {
    return { list: found, from: start, to: end }
  }
})
</script>

<style lang="scss">
.CodeMirror {
  height: 100%;
}
</style>
