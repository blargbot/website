<template>
  <code class="inline-code">{{ content }}</code>
</template>
<script>
import Vue from 'vue'
import { defaultRules } from 'simple-markdown'

export const inlineCodeRules = {
  /** @type {import('simple-markdown').ParserRule} */
  inlineCode: {
    ...defaultRules.inlineCode,
    match: source => defaultRules.inlineCode.match.regex.exec(source),
    vue(node) {
      return {
        component,
        props: {
          content: node.content
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
