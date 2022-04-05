<template>
  <crud-editor v-model="valueModel" :route="`guilds/${guildId}/ccommands`" type="Command" />
</template>

<script>
import CrudEditor from './CrudEditor.vue'

export default {
  components: { CrudEditor },
  props: {
    value: {
      type: String,
      default: null
    },
    guildId: {
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
