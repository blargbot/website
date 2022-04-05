<template>
  <div>
    <div class="control-row v-aligned">
      <label for="tagName" class="col-1">
        Tag name
      </label>
      <input v-model="tagName" name="tagName" class="input col-1">
      <button class="button col-1" :disabled="!tagName" @click.prevent="loadTag">
        Load
      </button>
      <button class="button col-1" :disabled="!tagName" @click.prevent="saveTag">
        Save
      </button>
    </div>
    <div class="control-row v-aligned">
      <label for="newName" class="col-1">
        New name
      </label>
      <input v-model="newName" name="newName" class="input col-1">
      <button class="button col-1" :disabled="!newName" @click.prevent="renameTag">
        Rename
      </button>
      <button class="button danger col-1 v-align" :disabled="!tagName" @click.prevent="deleteTag">
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
    }
  },
  data() {
    return {
      tagName: '',
      newName: '',
      loadedTag: null
    }
  },
  computed: {
    endpoint() {
      return `/tags/${encodeURIComponent(this.tagName)}`
    }
  },
  mounted() {
    this.loadedTag = null
  },
  methods: {
    async renameTag() {
      if (!this.ensureLoaded('rename')) {
        return
      }

      await this.updateContent(async () => {
        await this.$axios.$patch(this.endpoint, {
          newName: this.newName
        })
        this.tagName = this.newName
        this.newName = null
      })
    },
    async loadTag() {
      await this.updateContent(async () => {
        const tag = await this.$axios.$get(this.endpoint)
        return tag.content
      })
    },
    async deleteTag() {
      if (!this.ensureLoaded('delete')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios.$delete(this.endpoint)
        return ''
      }, '')
    },
    async saveTag() {
      if (!this.ensureLoaded('save')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios.$post(this.endpoint, {
          content: this.value
        })
      })
    },
    ensureLoaded(action) {
      return (
        this.loadedTag === this.tagName ||
        confirm(
          `You are trying to ${action} the tag ${this.tagName} before you loaded it, are you sure?`
        )
      )
    },
    async updateContent(action, fallback) {
      const loadedTag = this.tagName
      try {
        const content = await action()
        this.loadedTag = loadedTag
        this.$emit('input', content ?? this.value)
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err
        }
        switch (err.message) {
          case 'Request failed with status code 404':
            this.loadedTag = loadedTag
            this.$emit('input', fallback ?? this.value)
            break
          case 'Request failed with status code 401':
            this.$router.app.refresh()
            break
          case 'Request failed with status code 403':
            alert('You dont own that tag!')
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
