<template>
  <span>
    <template v-for="(segment, i) of segments">
      <component :is="segment.component" v-if="segment.component" v-bind="segment.props" :key="i" />
      <span v-else :key="i"><emoji :content="$sanitize(segment)" /></span>
    </template>
  </span>
</template>

<script>
import Mention from './Mention.vue'
import Timestamp from './Timestamp.vue'
import CustomEmote from './CustomEmote.vue'
import CodeBlock from './CodeBlock.vue'

export default {
  props: {
    content: {
      type: String,
      required: true
    },
    userMap: {
      type: Object,
      default: () => ({})
    },
    roleMap: {
      type: Object,
      default: () => ({})
    },
    channelMap: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    segments() {
      return [...segmentByCodeBlock(this.content, this)]
    }
  }
}

function* segmentByCodeBlock(content, ctx) {
  let match
  let i = 0
  while ((match = codeblockRegex.exec(content))) {
    if (i < match.index) {
      yield * segmentByTag(content.slice(i, match.index), ctx)
    }
    i = match.index + match[0].length
    yield {
      component: CodeBlock,
      props: {
        content: match.groups.block || match.groups.inline,
        inline: !!match.groups.inline
      }
    }
  }
  if (i < content.length) {
    yield * segmentByTag(content.slice(i), ctx)
  }
}

function* segmentByTag(content, ctx) {
  let tagMatch
  let i = 0
  while ((tagMatch = tagRegex.exec(content))) {
    if (i < tagMatch.index) {
      yield content.slice(i, tagMatch.index)
    }
    yield handleTag(tagMatch[0], ctx)
    i = tagMatch.index + tagMatch[0].length
  }
  if (i < content.length) {
    yield content.slice(i)
  }
}

function handleTag(content, ctx) {
  for (const tag of wellKnownTags) {
    const innerMatch = tag.test.exec(content)
    if (innerMatch) {
      return tag.emit(innerMatch, ctx)
    }
  }
  return content
}

const codeblockRegex = /```(?<block>.+?)```|`(?<inline>.+?)`/g
const tagRegex = /<[^<>]*?>/g
const wellKnownTags = [
  {
    test: /^<@!?(?<id>\d{1,30})>$/,
    emit(match, { userMap }) {
      const user = userMap[match.groups.id]
      const username = user?.username ?? 'unknown'
      const discrim = user?.discriminator ?? '0000'
      return {
        component: Mention,
        props: {
          tag: '@',
          name: username,
          details: `${username}#${discrim}`,
          value: user?.id
        }
      }
    }
  },
  {
    test: /^<@&(?<id>\d{1,30})>$/,
    emit(match, { roleMap }) {
      const role = roleMap[match.groups.id]
      const name = role?.name || 'unknown'
      return {
        component: Mention,
        props: { tag: '@', name, value: role?.id, color: role?.color }
      }
    }
  },
  {
    test: /^<#(?<id>\d{1,30})>$/,
    emit(match, { channelMap }) {
      const channel = channelMap[match.groups.id]
      const name = channel?.name || 'unknown'
      return {
        component: Mention,
        props: { tag: '#', name, value: channel?.id }
      }
    }
  },

  {
    test: /^<t:(?<val>\d{1,30})(?::(?<style>[tTdDfFR]))?>$/,
    emit(match) {
      return {
        component: Timestamp,
        props: { value: match.groups.val, format: match.groups.style || 'f' }
      }
    }
  },

  {
    test: /^<(?<animated>a)?:(?<name>[^:]+):(?<id>\d{1,30})>$/,
    emit(match) {
      return {
        component: CustomEmote,
        props: {
          id: match.groups.id,
          name: match.groups.name,
          animated: !!match.groups.animated
        }
      }
    }
  }
]
</script>
