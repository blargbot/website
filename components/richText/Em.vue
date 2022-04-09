<template>
  <em><slot name="content" /></em>
</template>

<script>
import Vue from 'vue'

import { defaultRules } from 'simple-markdown'

export const emRules = {
  /** @type {import('simple-markdown').ParserRule} */
  em: {
    ...defaultRules.em,
    parse(capture, parse, state) {
      const parsed = defaultRules.em.parse(capture, parse, {
        ...state,
        inEmphasis: true
      })
      return state.inEmphasis ? parsed.content : parsed
    },
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
