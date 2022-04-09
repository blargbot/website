<template>
  <strong><slot name="content" /></strong>
</template>

<script>
import Vue from 'vue'

import { defaultRules } from 'simple-markdown'

export const strongRules = {
  /** @type {import('simple-markdown').ParserRule} */
  strong: {
    ...defaultRules.strong,
    vue(node, output, state) {
      return {
        component,
        slots: {
          content: output(node.content, state)
        }
      }
    }
  }
}

const component = Vue.extend({})
export default component
</script>
