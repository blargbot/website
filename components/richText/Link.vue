<template>
  <a class="link" :href="href">
    <slot name="content" />
  </a>
</template>

<script>
import Vue from 'vue'

import { defaultRules } from 'simple-markdown'

export const linkRules = {
  autolink: defaultRules.autolink,
  url: defaultRules.url,
  /** @type {import('simple-markdown').ParserRule} */
  link: {
    ...defaultRules.link,
    match(source, state, ...args) {
      if (!state.allowLinks) {
        return null
      }
      return defaultRules.link.match(source, state, ...args)
    },
    vue(node, output, state) {
      return {
        component,
        slots: {
          content: output(node.content, state)
        },
        props: {
          href: node.target
        }
      }
    }
  }
}

const component = Vue.extend({
  props: {
    href: {
      type: String,
      required: true
    }
  }
})
export default component
</script>
