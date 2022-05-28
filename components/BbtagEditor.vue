<template>
  <div ref="wrapper" class="bbtag-editor" style="height: 500px" />
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
  },
  mounted() {
    const monaco = require('monaco-editor/esm/vs/editor/editor.api')
    require('@/assets/js/bbtag-monaco')
    const editor = (this.editor = monaco.editor.create(this.$refs.wrapper, {
      value: this.value || '',
      theme: 'vs-dark',
      language: 'bbtag'
    }))
    const model = editor.getModel()
    model.subtags = () => this.subtags
    model.onDidChangeContent(() => {
      this.$emit('input', model.getValue())
    })
  },
  methods: {
    clearHistory() {
      this.editor?.clearHistory()
    }
  }
}
</script>

<style lang="scss" scoped>
.bbtag-editor {
  max-width: 100%;
  width: 100%;
}
</style>
