<template>
  <div :class="{hidden: !visible}">
    <h2 class="center">
      {{ name }}
    </h2>
    <div v-if="description" class="subtitle center">
      {{ description }}
    </div>
    <item-list-item
      v-for="(item, i) in items"
      ref="items"
      :key="i"
      :name="item.name"
      :value="item.value"
      :filter="filter"
      :tags="item.tags"
    >
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </item-list-item>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    filter: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isMounted: false
    }
  },
  computed: {
    visible() {
      if (!this.isMounted) {
        return false
      }
      for (const item of this.$refs.items) {
        if (item.visible) {
          return true
        }
      }
      return false
    }
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    expandAll() {
      for (const item of this.$refs.items ?? []) {
        item.expand()
      }
    },
    collapseAll() {
      for (const item of this.$refs.items ?? []) {
        item.collapse()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
