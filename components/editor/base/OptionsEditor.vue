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
      selected: null
    }
  },
  computed: {
    name() {
      return `${this.type} ${this.selected}`
    },
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
      return this.checkAction('saveMethod')
    },
    canLoad() {
      return this.checkAction('loadMethod')
    },
    canDelete() {
      return this.checkAction('deleteMethod')
    }
  },
  methods: {
    checkAction(name) {
      return !this.loading && typeof this[name] === 'string' && this.selected
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

@media screen and (max-width: 800px) {
  .control-row {
    grid-template-columns: 1fr 1fr 1fr;

    :first-child {
      grid-column-end: span 3;
    }
  }
}
</style>
