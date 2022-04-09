<template>
  <mention :tag="channelTag" :value="channelId" :name="name" />
</template>

<script>
import Vue from 'vue'
import { defaultRules } from 'simple-markdown'
import Mention from './Mention.vue'

export const discordChannelRules = {
  /** @type {import('simple-markdown').ParserRule} */
  discordChannel: {
    order: defaultRules.strong.order,
    match: source => /^<#(\d+)>/.exec(source),
    parse(capture) {
      return {
        id: capture[1]
      }
    },
    vue(node, _, state) {
      const channel = state.context?.channelMap?.[node.id]
      return {
        component,
        props: {
          name: channel?.name || 'unknown',
          type: channel?.type,
          channelId: node.id
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
    type: {
      type: Number,
      default: null
    },
    channelId: {
      type: String,
      required: true
    }
  },
  computed: {
    channelTag() {
      switch (this.type) {
        default:
          return '#'
      }
    }
  }
})
export default component
</script>
