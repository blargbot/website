<template>
  <span v-twemoji class="plain-text">{{ content }}</span>
</template>

<script>
import Vue from 'vue'

import { defaultRules } from 'simple-markdown'

export const textRules = {
  escape: defaultRules.escape,
  /** @type {import('simple-markdown').ParserRule */
  text: {
    ...defaultRules.text,
    match: source =>
      /^[\s\S]+?(?=[^0-9A-Za-z\s\u00C0-\uFFFF-]|\n\n|\n|\w+:\S|$)/.exec(source),
    vue(node) {
      return {
        component,
        props: {
          content: node.content
        }
      }
    }
  },
  /** @type {import('simple-markdown').ParserRule */
  newLine: {
    ...defaultRules.newline,
    vue() {
      return {
        component,
        props: {
          content: '\n'
        }
      }
    }
  }
}

const component = Vue.extend({
  props: {
    content: {
      type: String,
      required: true
    }
  }
})
export default component
</script>
<style lang="scss" scoped>
.plain-text {
  word-break: break-word;
}
</style>
