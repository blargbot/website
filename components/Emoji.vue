<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span class="twemoji" v-html="renderedContent" />
</template>

<script>
import twemoji from 'twemoji'

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    renderedContent() {
      const a = twemoji.parse(this.content)
      return a
    }
  }
}
</script>
