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
    <editor-bbtag-monaco v-model="value" @save="canSave && save()" />
  </div>
</template>

<script>
import bbtagEditor from '~/mixins/bbtagEditor'
export default {
  mixins: [bbtagEditor],
  props: {
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
      value: ''
    }
  },
  computed: {
    name() {
      return this.type
    },
    endpoint() {
      return this.route
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
      return !this.loading && typeof this[name] === 'string'
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
