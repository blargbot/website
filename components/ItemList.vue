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
    <template v-for="item, i in filteredItems">
      <div v-if="!filteredItems[i - 1] || filteredItems[i - 1].category !== item.category" :key="i + '-' + item.category">
        <template v-if="typeof getCategory(item.category) === 'object'">
          <h2 class="center">
            {{ getCategory(item.category).name }} {{ itemLabel }}
          </h2>
          <div class="subtitle center">
            {{ getCategory(item.category).desc }}
          </div>
        </template>
        <template v-else>
          <h2 class="center">
            {{ getCategory(item.category) }} {{ itemLabel }}
          </h2>
        </template>
      </div>
      <collapsible-card :key="item.name" :name="item.name">
        <template #title-bar>
          <slot :item="item" name="title-bar" />
        </template>
        <slot :item="item" />
      </collapsible-card>
    </template>
  </section>
</template>

<script>
import CollapsibleCard from '~/components/CollapsibleCard.vue'

export default {
  components: { CollapsibleCard },
  props: {
    items: {
      type: Array,
      default () { return [] }
    },
    defaultFilter: {
      type: String,
      default () { return '' }
    },
    categories: {
      type: Array,
      default () { return [] }
    },
    itemLabel: {
      type: String,
      default () { return 'Items' }
    }
  },
  data () {
    return {
      filter: this.defaultFilter
    }
  },
  computed: {
    filteredItems () {
      const filter = this.filter.toLowerCase()
      return this.items.filter(item =>
        (item.name.toLowerCase().includes(filter) ||
          (typeof item.category === 'string'
            ? item.category.toLowerCase().includes(filter)
            : this.categories[item.category].name.toLowerCase().includes(filter)) ||
          item.aliases.some(a => a.toLowerCase().includes(filter))) &&
        !item.disabled && !item.hidden)
    }
  },
  methods: {
    getCategory (category) {
      if (typeof category === 'string') {
        return category
      }

      return this.categories[category]
    },
    expandAll () {
      this.$root.$emit('expandAll')
    },
    collapseAll () {
      this.$root.$emit('collapseAll')
    }
  }
}
</script>
