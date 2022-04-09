<template>
  <span class="spoiler"><slot name="content" /></span>
</template>

<script>
import Vue from 'vue'

export const spoilerRules = {
  /** @type {import('simple-markdown').ParserRule} */
  spoiler: {
    order: 0,
    match: source => /^\|\|([\s\S]+?)\|\|/.exec(source),
    parse(capture, parse, state) {
      return {
        content: parse(capture[1], state)
      }
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
