<template>
  <div>
    <div class="control-row v-aligned">
      <label for="tagName">
        {{ type }} name
      </label>
      <input v-model="tagName" name="tagName">
      <button class="button hide-small" :disabled="!canLoad" @click.prevent="load">
        Load
      </button>
      <button class="button ok hide-small" :disabled="!canSave" @click.prevent="save">
        Save
      </button>
    </div>
    <div class="control-row v-aligned">
      <label for="newName">
        New name
      </label>
      <input v-model="newName" name="newName">
      <button class="button hide-small" :disabled="!canRename" @click.prevent="rename">
        Rename
      </button>
      <button class="button danger hide-small" :disabled="!canDelete" @click.prevent="remove">
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
    renameMethod: {
      type: String,
      default: '$patch'
    },
    deleteMethod: {
      type: String,
      default: '$delete'
    }
  },
  data() {
    return {
      tagName: '',
      newName: '',
      lastLoad: null
    }
  },
  computed: {
    endpoint() {
      return `/${this.route}/${encodeURIComponent(this.tagName)}`
    },
    canSave() {
      return typeof this.saveMethod === 'string' && this.tagName
    },
    canLoad() {
      return typeof this.loadMethod === 'string' && this.tagName
    },
    canRename() {
      return (
        typeof this.renameMethod === 'string' && this.tagName && this.newName
      )
    },
    canDelete() {
      return typeof this.deleteMethod === 'string' && this.tagName
    }
  },
  mounted() {
    this.lastLoad = null
  },
  methods: {
    async rename() {
      if (!this.ensureLoaded('rename')) {
        return
      }

      await this.updateContent(async () => {
        await this.$axios[this.renameMethod](this.endpoint, {
          name: this.newName
        })
        this.tagName = this.newName
        this.newName = null
      })
    },
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
    },
    ensureLoaded(action) {
      return (
        this.lastLoad === this.tagName ||
        confirm(
          `You are trying to ${action} the ${this.type} ${this.tagName} before you loaded it, are you sure?`
        )
      )
    },
    async updateContent(action, fallback) {
      const lastLoad = this.tagName
      try {
        const content = await action()
        this.lastLoad = lastLoad
        this.$emit('input', content ?? this.value)
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err
        }
        switch (err.message) {
          case 'Request failed with status code 404':
            this.lastLoad = lastLoad
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
.control-row {
  display: grid;
  grid-template-columns: 10% 60% 15% 15%;
}

@media screen and (max-width: 800px) {
  .control-row {
    grid-template-columns: 1fr 1fr;

    label,
    input {
      grid-column-end: span 3;
    }
  }
}
</style>
