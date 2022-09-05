<template>
  <section>
    <div class="v-aligned">
      <div>Filter: <input v-model="filter" class="input"></div>
      <button class="button" @click.prevent="expandAll">
        Expand All
      </button>
      <button class="button" @click.prevent="collapseAll">
        Collapse All
      </button>
    </div>
    <template v-for="(item, i) in items">
      <item-list-group
        v-if="'items' in item"
        ref="groups"
        :key="i"
        :items="item.items"
        :name="item.name"
        :description="item.description"
        :filter="filter"
      >
        <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </item-list-group>
      <item-list-item
        v-else
        ref="items"
        :key="i"
        :value="item.value"
        :name="item.name"
        :tags="item.tags"
        :filter="filter"
      >
        <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </item-list-item>
    </template>
  </section>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    },
    defaultFilter: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      filter: this.defaultFilter
    }
  },
  methods: {
    expandAll() {
      for (const group of this.$refs.groups ?? []) {
        group.expandAll()
      }
      for (const item of this.$refs.items ?? []) {
        item.expand()
      }
    },
    collapseAll() {
      for (const group of this.$refs.groups ?? []) {
        group.collapseAll()
      }
      for (const item of this.$refs.items ?? []) {
        item.collapse()
      }
    }
  }
}
</script>
