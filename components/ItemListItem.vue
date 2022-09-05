<template>
  <collapsible-card ref="card" :name="name" :class="{hidden: !visible}">
    <template #title-bar>
      <slot :value="value" name="title-bar" />
    </template>
    <slot :value="value" />
  </collapsible-card>
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    filter: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      required: true
    }
  },
  computed: {
    visible() {
      return this.tags.some(i =>
        i.toLowerCase().includes(this.filter.toLowerCase())
      )
    }
  },
  methods: {
    collapse() {
      this.$refs.card.collapse()
    },
    expand() {
      this.$refs.card.expand()
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
