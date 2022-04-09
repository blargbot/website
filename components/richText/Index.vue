<template>
  <span class="rich-text">
    <component-tree-node v-for="(node, i) in components" :key="i" :component="node.component" :slots="node.slots" :props="node.props" />
  </span>
</template>

<script>
import markdown from 'simple-markdown'
import ComponentTreeNode from '../ComponentTreeNode.vue'
import { blockQuoteRules } from './BlockQuote.vue'
import { brRules } from './Br.vue'
import { codeBlockRules } from './CodeBlock.vue'
import { discordChannelRules } from './DiscordChannel.vue'
import { discordEmoteRules } from './DiscordEmote.vue'
import { discordEveryoneRules } from './DiscordEveryone.vue'
import { discordRoleRules } from './DiscordRole.vue'
import { discordTimestampRules } from './DiscordTimestamp.vue'
import { discordUserRules } from './DiscordUser.vue'
import { emRules } from './Em.vue'
import { inlineCodeRules } from './InlineCode.vue'
import { linkRules } from './Link.vue'
import { spoilerRules } from './Spoiler.vue'
import { strikeRules } from './Strike.vue'
import { strongRules } from './Strong.vue'
import { textRules } from './PlainText.vue'
import PlainText, { uRules } from './U.vue'

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
