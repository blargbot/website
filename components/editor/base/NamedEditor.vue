<template>
  <div>
    <div class="control-row v-aligned">
      <label for="tagName">
        {{ type.slice(0, 1).toUpperCase() + type.slice(1) }} name
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

    <div class="control-row v-aligned show-small">
      <button class="button" :disabled="!canLoad" @click.prevent="load">
        Load
      </button>
      <button class="button ok" :disabled="!canSave" @click.prevent="save">
        Save
      </button>
      <button class="button" :disabled="!canRename" @click.prevent="rename">
        Rename
      </button>
      <button class="button danger" :disabled="!canDelete" @click.prevent="remove">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import bbtagEditor from '~/mixins/bbtagEditor'

export default {
  mixins: [bbtagEditor],
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
      newName: ''
    }
  },
  computed: {
    name() {
      return `${this.type} ${this.tagName}`
    },
    endpoint() {
      return `/${this.route}/${encodeURIComponent(this.tagName)}`
    },
    canSave() {
      return this.checkAction('saveMethod')
    },
    canLoad() {
      return this.checkAction('loadMethod')
    },
    canRename() {
      return this.checkAction('renameMethod') && this.newName
    },
    canDelete() {
      return this.checkAction('deleteMethod')
    }
  },
  methods: {
    checkAction(name) {
      return !this.loading && typeof this[name] === 'string' && this.tagName
    },
    async rename() {
      await this.updateContent({
        action: {
          do: 'rename',
          doing: 'renaming',
          done: 'renamed'
        },
        async request() {
          await this.$axios[this.renameMethod](this.endpoint, {
            name: this.newName
          })
          this.tagName = this.newName
          this.newName = null
        }
      })
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
