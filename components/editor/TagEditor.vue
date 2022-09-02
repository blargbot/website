<template>
  <crud-editor v-model="valueModel" route="tags" type="tag" />
</template>

<script>
import CrudEditor from './base/NamedEditor.vue'

export default {
  components: { CrudEditor },
  props: {
    value: {
      type: String,
      default: null
    }
  },
  computed: {
    valueModel: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
