<template>
  <img :src="source" class="emoji" draggable="false" :alt="name">
</template>

<script>
import Vue from 'vue'
import { defaultRules } from 'simple-markdown'

export const discordEmoteRules = {
  /** @type {import('simple-markdown').ParserRule} */
  discordEmote: {
    order: defaultRules.strong.order,
    match: source => /^<(a)?:(\w+):(\d+)>/.exec(source),
    parse(capture) {
      return {
        id: capture[3],
        name: capture[2],
        animated: !!capture[1]
      }
    },
    vue(node) {
      return {
        component,
        props: {
          name: node.name,
          animated: node.animated,
          emoteId: node.id
        }
      }
    }
  }
}

const component = Vue.extend({
  props: {
    name: {
      type: String,
      required: true
    },
    animated: {
      type: Boolean,
      required: true
    },
    emoteId: {
      type: String,
      required: true
    }
  },
  computed: {
    source() {
      return `https://cdn.discordapp.com/emojis/${this.emoteId}.${
        this.animated ? 'gif' : 'png'
      }`
    }
  }
})
export default component
</script>
