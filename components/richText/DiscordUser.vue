<template>
  <mention tag="@" :details="`${username}#${discriminator}`" :value="userId" :name="username" />
</template>

<script>
import Vue from 'vue'
import { defaultRules } from 'simple-markdown'
import Mention from './Mention.vue'

export const discordUserRules = {
  /** @type {import('simple-markdown').ParserRule} */
  discordUser: {
    order: defaultRules.strong.order,
    match: source => /^<@!?(\d+)>/.exec(source),
    parse(capture) {
      return {
        id: capture[1]
      }
    },
    vue(node, _, state) {
      const user = state.context?.userMap?.[node.id]
      return {
        component,
        props: {
          username: user?.username || 'unknown',
          discriminator: user?.discriminator || '0000',
          userId: node.id
        }
      }
    }
  }
}

const component = Vue.extend({
  components: { Mention },
  props: {
    username: {
      type: String,
      required: true
    },
    discriminator: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  }
})
export default component
</script>
