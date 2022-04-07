<template>
  <code v-if="inline">{{ content }}</code>
  <pre v-else><code>{{ content }}</code></pre>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    inline: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    formatted() {
      return `Custom emote ${this.id}`
    }
  }
}
</script>
