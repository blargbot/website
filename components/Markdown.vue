<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="markdown" v-html="renderedContent" />
</template>

<script>
import render from '@/assets/js/markup'

export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    autoNewLines: {
      type: Boolean,
      default: false
    },
    markdownOptions: {
      type: Object,
      default: () => ({})
    },
    xssOptions: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    renderedContent() {
      let content = this.content
      if (this.autoNewLines) {
        content = content.replace(/\n/g, '  \n')
      }
      return render(
        content,
        this.options,
        this.markdownOptions,
        this.xssOptions
      )
    }
  }
}
</script>
