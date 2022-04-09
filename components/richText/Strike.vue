<template>
  <del><slot name="content" /></del>
</template>

<script>
import Vue from 'vue'

import { defaultRules, inlineRegex } from 'simple-markdown'

export const strikeRules = {
  /** @type {import('simple-markdown').ParserRule} */
  strike: {
    ...defaultRules.del,
    match: inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
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
