<template>
  <mention tag="@" :name="text" />
</template>

<script>
import Vue from 'vue'
import { defaultRules } from 'simple-markdown'
import Mention from './Mention.vue'

export const discordEveryoneRules = {
  /** @type {import('simple-markdown').ParserRule} */
  discordEveryone: {
    order: defaultRules.strong.order,
    match: source => /^@(everyone|here)/.exec(source),
    parse(capture) {
      return {
        text: capture[1]
      }
    },
    vue(node) {
      return {
        component,
        props: {
          text: node.text
        }
      }
    }
  }
}

const component = Vue.extend({
  components: { Mention },
  props: {
    text: {
      type: String,
      required: true
    }
  }
})
export default component
</script>
