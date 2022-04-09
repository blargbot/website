<template>
  <mention tag="@" :value="roleId" :name="name" :color="color" />
</template>

<script>
import Vue from 'vue'
import { defaultRules } from 'simple-markdown'
import Mention from './Mention.vue'

export const discordRoleRules = {
  /** @type {import('simple-markdown').ParserRule} */
  discordRole: {
    order: defaultRules.strong.order,
    match: source => /^<@&(\d+)>/.exec(source),
    parse(capture) {
      return {
        id: capture[1]
      }
    },
    vue(node, _, state) {
      const role = state.context?.roleMap?.[node.id]
      return {
        component,
        props: {
          name: role?.name || 'unknown',
          color: role?.color,
          roleId: node.id
        }
      }
    }
  }
}

const component = Vue.extend({
  components: { Mention },
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: Number,
      default: null
    },
    roleId: {
      type: String,
      required: true
    }
  }
})
export default component
</script>
