<template>
  <div class="block-quote">
    <slot name="content" />
  </div>
</template>
<script>
import Vue from 'vue'
import { defaultRules } from 'simple-markdown'

export const blockQuoteRules = {
  /** @type {import('simple-markdown').ParserRule} */
  blockQuote: {
    ...defaultRules.blockQuote,
    match(source, state, prevSource) {
      return !/^$|\n *$/.test(prevSource) || state.inQuote
        ? null
        : /^( *>>> ([\s\S]*))|^( *> [^\n]*(\n *> [^\n]*)*\n?)/.exec(source)
    },
    parse(capture, parse, state) {
      const all = capture[0]
      const isBlock = !!/^ *>>> ?/.exec(all)
      const removeSyntaxRegex = isBlock ? /^ *>>> ?/ : /^ *> ?/gm
      const content = all.replace(removeSyntaxRegex, '')

      return {
        content: parse(content, { ...state, inQuote: true })
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
