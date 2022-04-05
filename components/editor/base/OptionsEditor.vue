<template>
  <div>
    <div class="control-row v-aligned">
      <dropdown-button v-model="selected" :options="options" :prompt="prompt" />
      <button class="button" :disabled="!canLoad" @click.prevent="load">
        Load
      </button>
      <button class="button ok" :disabled="!canSave" @click.prevent="save">
        Save
      </button>
      <button class="button danger" :disabled="!canDelete" @click.prevent="remove">
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
    },
    loadMethod: {
      type: String,
      default: '$get'
    },
    saveMethod: {
      type: String,
      default: '$put'
    },
    deleteMethod: {
      type: String,
      default: '$delete'
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
    },
    canSave() {
      return typeof this.saveMethod === 'string' && this.selected !== null
    },
    canLoad() {
      return typeof this.loadMethod === 'string' && this.selected !== null
    },
    canDelete() {
      return typeof this.deleteMethod === 'string' && this.selected !== null
    }
  },
  mounted() {
    this.hasLoaded = false
  },
  methods: {
    async load() {
      await this.updateContent(async () => {
        const tag = await this.$axios[this.loadMethod](this.endpoint)
        return tag.content
      })
    },
    async remove() {
      if (!this.ensureLoaded('delete')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios[this.deleteMethod](this.endpoint)
        return ''
      }, '')
      this.$emit('reload')
    },
    async save() {
      if (!this.ensureLoaded('save')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios[this.saveMethod](this.endpoint, {
          content: this.value
        })
      })
      this.$emit('reload')
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
            window.location.reload()
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
}
</style>
