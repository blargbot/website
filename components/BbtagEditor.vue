<template>
  <div class="editor">
    <div ref="wrapper" class="bbtag-editor" />
    <p>
      Font size and wordwrapping can be enabled in the command pallet.
      To access the command pallet, press F1 while focused on the editor.
    </p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      editor: null,
      subtags: []
    }
  },
  async fetch() {
    const subtags = await this.$axios.$get('/subtags')
    this.subtags = Object.values(subtags)
  },
  watch: {
    value(newValue, oldValue) {
      const model = this.editor.getModel()
      if (newValue === model.getValue()) {
        return
      }

      model.setValue(newValue || '')
    }
  },
  beforeDestroy() {
    this.$refs.wrapper.remove()
    window.removeEventListener('resize', this.resize.bind(this))
  },
  mounted() {
    const monaco = require('monaco-editor/esm/vs/editor/editor.api')
    require('@/assets/js/bbtag-monaco')
    const editor = (this.editor = monaco.editor.create(this.$refs.wrapper, {
      value: this.value || '',
      theme: 'vs-dark',
      language: 'bbtag',
      wordWrap: localStorage.getItem('editor-wordwrap'),
      wordWrapColumn: 9999999
    }))
    window.editor = editor
    editor.addAction({
      id: 'editor.action.enableWordWrap',
      label: 'Enable word wrapping',
      run() {
        localStorage.setItem('editor-wordwrap', 'bounded')
        editor.updateOptions({ wordWrap: 'bounded' })
      }
    })
    editor.addAction({
      id: 'editor.action.disableWordWrap',
      label: 'Disable word wrapping',
      run() {
        localStorage.setItem('editor-wordwrap', 'off')
        editor.updateOptions({ wordWrap: 'off' })
      }
    })
    const model = editor.getModel()
    model.subtags = () => this.subtags
    model.onDidChangeContent(() => {
      this.$emit('input', model.getValue())
    })

    window.addEventListener('resize', this.resize.bind(this))
    this.resize()
  },
  methods: {
    clearHistory() {
      this.editor?.clearHistory()
    },
    resize() {
      if (this.editor && this.$refs.wrapper) {
        this.editor?.layout({ height: 0, width: 0 })
        const rect = this.$refs.wrapper.getBoundingClientRect()

        this.editor.layout({
          height: Math.floor(rect.height),
          width: Math.floor(rect.width)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bbtag-editor {
  max-width: 100%;
  width: 100%;
  flex: 1 0 auto;
}

.editor {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
