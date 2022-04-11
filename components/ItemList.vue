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
    <template v-for="group, i in filteredItemGroups">
      <div :key="i">
        <template v-if="typeof group.category === 'object'">
          <h2 class="center">
            {{ group.category.name }} {{ itemLabel }}
          </h2>
          <div class="subtitle center">
            {{ group.category.desc }}
          </div>
        </template>
        <template v-else>
          <h2 class="center">
            {{ group.category }} {{ itemLabel }}
          </h2>
        </template>
        <collapsible-card v-for="(item, j) in group.items" :key="`${i}_${j}`" :name="item.value.name">
          <template #title-bar>
            <slot :item="item.value" name="title-bar" />
          </template>
          <slot :item="item.value" />
        </collapsible-card>
      </div>
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
      default() {
        return []
      }
    },
    defaultFilter: {
      type: String,
      default() {
        return ''
      }
    },
    categories: {
      type: Object,
      default() {
        return {}
      }
    },
    itemLabel: {
      type: String,
      default() {
        return 'Items'
      }
    }
  },
  data() {
    return {
      filter: this.defaultFilter,
      itemGroups: []
    }
  },
  computed: {
    filteredItemGroups() {
      const filter = this.filter.toLowerCase()
      if (filter.length === 0) {
        return this.itemGroups
      }
      return this.itemGroups
        .map(g => ({
          category: g.category,
          items: g.items.filter(i => i.labels.some(l => l.includes(filter)))
        }))
        .filter(g => g.items.length > 0)
    }
  },
  watch: {
    items(newValue) {
      this.itemGroups = this.groupItems(newValue, this.categories)
    },
    categories(newValue) {
      this.itemGroups = this.groupItems(this.items, newValue)
    }
  },
  mounted() {
    this.itemGroups = this.groupItems(this.items, this.categories)
  },
  methods: {
    expandAll() {
      this.$root.$emit('expandAll')
    },
    collapseAll() {
      this.$root.$emit('collapseAll')
    },
    groupItems(items, categories) {
      const groups = new Map()
      for (const item of items) {
        let group = groups.get(item.category)
        if (group === undefined) {
          groups.set(item.category, (group = []))
        }
        group.push(item)
      }

      return [...groups.entries()].map(([cid, items]) => {
        const category = categories[cid] || cid
        return {
          category,
          items: items
            .filter(i => !i.disabled && !i.hidden)
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .map(i => ({
              labels: [i.name, ...i.aliases, category?.name, cid]
                .filter(v => typeof v === 'string')
                .map(v => v.toLowerCase()),
              value: i
            }))
        }
      })
    }
  }
}
</script>
