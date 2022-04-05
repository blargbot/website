<template>
  <div>
    <div class="control-row v-aligned">
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
export default {
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
      hasLoaded: false
    }
  },
  computed: {
    canSave() {
      return typeof this.saveMethod === 'string'
    },
    canLoad() {
      return typeof this.loadMethod === 'string'
    },
    canDelete() {
      return typeof this.deleteMethod === 'string'
    }
  },
  mounted() {
    this.hasLoaded = false
  },
  methods: {
    async load() {
      await this.updateContent(async () => {
        const tag = await this.$axios[this.loadMethod](this.route)
        return tag.content
      })
    },
    async remove() {
      if (!this.ensureLoaded('delete')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios[this.deleteMethod](this.route)
        return ''
      }, '')
    },
    async save() {
      if (!this.ensureLoaded('save')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios[this.saveMethod](this.route, {
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
            window.location.reload()
            break
          case 'Request failed with status code 403':
            alert(`You don't own that ${this.type}!`)
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

$third: math.div(100%, 3);

.control-row {
  display: grid;
  grid-template-columns: $third $third $third;
}
</style>
