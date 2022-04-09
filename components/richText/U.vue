<template>
  <u><slot name="content" /></u>
</template>

<script>
import Vue from 'vue'

import { defaultRules } from 'simple-markdown'

export const uRules = {
  /** @type {import('simple-markdown').ParserRule} */
  u: {
    ...defaultRules.u,
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
