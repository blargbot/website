<template>
  <div>
    <div class="control-row v-aligned">
      <dropdown-button v-model="selected" :options="options" :prompt="prompt" />
      <button class="button col-1" :disabled="selected === null" @click.prevent="load">
        Load
      </button>
      <button class="button col-1 ok" :disabled="selected === null" @click.prevent="save">
        Save
      </button>
      <button class="button danger col-1 v-align" :disabled="selected === null" @click.prevent="remove">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import DropdownButton from '../../DropdownButton.vue'
export default {
  components: { DropdownButton },
  props: {
    value: {
      type: String,
      default: null
    },
    route: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      hasLoaded: false,
      selected: null
    }
  },
  computed: {
    prompt() {
      if ('aieou'.includes(this.type[0].toLowerCase())) {
        return `Pick an ${this.type}`
      }
      return `Pick a ${this.type}`
    },
    endpoint() {
      return `${this.route}/${this.selected}`
    }
  },
  mounted() {
    this.hasLoaded = false
  },
  methods: {
    async load() {
      await this.updateContent(async () => {
        const tag = await this.$axios.$get(this.endpoint)
        return tag.content
      })
    },
    async remove() {
      if (!this.ensureLoaded('delete')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios.$delete(this.endpoint)
        return ''
      }, '')
      this.$emit('reload')
    },
    async save() {
      if (!this.ensureLoaded('save')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios.$put(this.endpoint, {
          content: this.value
        })
      })
    },
    ensureLoaded(action) {
      return (
        this.hasLoaded ||
        confirm(
          `You are trying to ${action} the ${this.type} ${this.tagName} before you loaded it, are you sure?`
        )
      )
    },
    async updateContent(action, fallback) {
      try {
        const content = await action()
        this.hasLoaded = true
        this.$emit('input', content ?? this.value)
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err
        }
        switch (err.message) {
          case 'Request failed with status code 404':
            this.hasLoaded = true
            this.$emit('input', fallback ?? this.value)
            break
          case 'Request failed with status code 401':
            this.$router.app.refresh()
            break
          case 'Request failed with status code 403':
            alert(`You dont own that ${this.type}!`)
            break
          default:
            throw err
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use "sass:math";

$sixth: math.div(100%, 6);

.control-row {
  display: grid;
  grid-template-columns: 50% $sixth $sixth $sixth;

  .col-1 {
    grid-column-end: span 1;
  }
  .col-2 {
    grid-column-end: span 2;
  }
}
</style>
