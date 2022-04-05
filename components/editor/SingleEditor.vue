<template>
  <div>
    <div class="control-row v-aligned">
      <button class="button col-1" @click.prevent="load">
        Load
      </button>
      <button class="button col-1" @click.prevent="save">
        Save
      </button>
      <button class="button danger col-1 v-align" @click.prevent="remove">
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
      hasLoaded: false
    }
  },
  mounted() {
    this.hasLoaded = false
  },
  methods: {
    async load() {
      await this.updateContent(async () => {
        const tag = await this.$axios.$get(this.route)
        return tag.content
      })
    },
    async remove() {
      if (!this.ensureLoaded('delete')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios.$delete(this.route)
        return ''
      }, '')
    },
    async save() {
      if (!this.ensureLoaded('save')) {
        return
      }
      await this.updateContent(async () => {
        await this.$axios.$put(this.route, {
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

$third: math.div(100%, 3);

.control-row {
  display: grid;
  grid-template-columns: $third $third $third;

  .col-1 {
    grid-column-end: span 1;
  }
  .col-2 {
    grid-column-end: span 2;
  }
}
</style>
