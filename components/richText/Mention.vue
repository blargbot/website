<template>
  <span class="mention" :class="{ colored: !!color }" :style="style" :title="details" @click.prevent="copyValue">{{ tag }}{{ name }}</span>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: null
    },
    details: {
      type: String,
      default: null
    },
    color: {
      type: Number,
      default: 0
    }
  },
  computed: {
    style() {
      if (!this.color) {
        return undefined
      }
      const r = this.color >> 16
      const g = (this.color >> 8) & 255
      const b = this.color & 255
      return `--red: ${r}; --green: ${g}; --blue: ${b}`
    }
  },
  methods: {
    copyValue() {
      if (this.value !== null) {
        window.navigator.clipboard.writeText(this.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mention {
  cursor: pointer;
}
</style>
