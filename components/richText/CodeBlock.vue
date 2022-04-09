<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <pre class="code-block" :lang="lang"><code class="hljs" :class="{ [lang]: isWellKnownLang }" v-html="formattedContent" /></pre>
</template>
<script>
import Vue from 'vue'
import hljs from 'highlight.js'
import { defaultRules, inlineRegex } from 'simple-markdown'

export * from 'highlight.js/scss/base16/solarized-dark.scss'

export const codeBlockRules = {
  /** @type {import('simple-markdown').ParserRule} */
  codeBlock: {
    ...defaultRules.codeBlock,
    match: inlineRegex(/^```(([a-z0-9-]+?)\n+)?\n*([^]+?)\n*```/i),
    parse(capture, _, state) {
      return {
        lang: (capture[2] || '').trim(),
        content: capture[3] || '',
        inQuote: state.inQuote || false
      }
    },
    vue(node, output, state) {
      return {
        component,
        props: {
          content: node.content,
          lang: node.lang
        }
      }
    }
  }
}

const component = Vue.extend({
  props: {
    lang: {
      type: String,
      default: null
    },
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    formattedContent() {
      if (this.isWellKnownLang) {
        return hljs.highlight(this.content, {
          language: this.lang,
          ignoreIllegals: true
        })
      }
      return this.$sanitize(this.content)
    },
    isWellKnownLang() {
      return this.lang && !!hljs.getLanguage(this.lang)
    }
  }
})
export default component
</script>

<style lang="scss" scoped>
.code-block {
  .hljs {
    padding: 0;
  }
}
</style>
