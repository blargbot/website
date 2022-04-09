<template>
  <span class="rich-text">
    <component-tree-node v-for="(node, i) in components" :key="i" :component="node.component" :slots="node.slots" :props="node.props" />
  </span>
</template>

<script>
import markdown from 'simple-markdown'
import { blockQuoteRules } from './richText/BlockQuote.vue'
import { brRules } from './richText/Br.vue'
import { codeBlockRules } from './richText/CodeBlock.vue'
import { discordChannelRules } from './richText/DiscordChannel.vue'
import { discordEmoteRules } from './richText/DiscordEmote.vue'
import { discordEveryoneRules } from './richText/DiscordEveryone.vue'
import { discordRoleRules } from './richText/DiscordRole.vue'
import { discordTimestampRules } from './richText/DiscordTimestamp.vue'
import { discordUserRules } from './richText/DiscordUser.vue'
import { emRules } from './richText/Em.vue'
import { inlineCodeRules } from './richText/InlineCode.vue'
import { linkRules } from './richText/Link.vue'
import { spoilerRules } from './richText/Spoiler.vue'
import { strikeRules } from './richText/Strike.vue'
import { strongRules } from './richText/Strong.vue'
import { textRules } from './richText/PlainText.vue'
import PlainText, { uRules } from './richText/U.vue'
import ComponentTreeNode from './ComponentTreeNode.vue'

const rules = {
  Array: {
    vue(arr, output, state) {
      const results = arr.map(v => output(v, state))
      for (let i = 0; i < results.length; i++) {
        const r1 = results[i]
        const r2 = results[i + 1]
        if (r1?.component === PlainText && r2?.component === PlainText) {
          r1.props.content += r2.props.content
          results.splice(i + 1, 1)
          i--
        }
      }
      return results
    }
  },
  ...blockQuoteRules,
  ...codeBlockRules,
  ...textRules,
  ...brRules,
  ...linkRules,
  ...emRules,
  ...strikeRules,
  ...strongRules,
  ...uRules,
  ...inlineCodeRules,
  ...spoilerRules,
  ...discordUserRules,
  ...discordRoleRules,
  ...discordChannelRules,
  ...discordEmoteRules,
  ...discordTimestampRules,
  ...discordEveryoneRules
}

const parser = markdown.parserFor(rules)
const toComponentTree = markdown.outputFor(rules, 'vue')

function parseRichText(content, state) {
  return toComponentTree(parser(content, state), state)
}

export const embedFeatures = {}

export const messageFeatures = {
  aliasedLinks: false
}

export default {
  components: { ComponentTreeNode },
  props: {
    content: {
      type: String,
      required: true
    },
    context: {
      type: Object,
      default: () => ({})
    },
    features: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    components() {
      return parseRichText(this.content, {
        context: this.context,
        allowLinks: this.features.aliasedLinks !== false,
        inline: true,
        inQuote: false,
        inEmphasis: false
      })
    }
  }
}
</script>
