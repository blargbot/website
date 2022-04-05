<template>
  <div>
    <div class="control-row v-aligned">
      <label for="tagName" class="col-1">
        {{ type }} name
      </label>
      <input v-model="tagName" name="tagName" class="input col-1">
      <button class="button col-1" :disabled="!tagName" @click.prevent="load">
        Load
      </button>
      <button class="button col-1 ok" :disabled="!tagName" @click.prevent="save">
        Save
      </button>
    </div>
    <div class="control-row v-aligned">
      <label for="newName" class="col-1">
        New name
      </label>
      <input v-model="newName" name="newName" class="input col-1">
      <button class="button col-1" :disabled="!newName || !tagName" @click.prevent="rename">
        Rename
      </button>
      <button class="button danger col-1 v-align" :disabled="!tagName" @click.prevent="remove">
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
        await this.$axios.$patch(this.endpoint, {
          name: this.newName
        })
        this.tagName = this.newName
        this.newName = null
      })
    },
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
.control-row {
  display: grid;
  grid-template-columns: 10% 60% 15% 15%;

  .col-1 {
    grid-column-end: span 1;
  }
  .col-2 {
    grid-column-end: span 2;
  }
}
</style>
