<template>
  <single-editor v-model="valueModel" :route="`guilds/${guildId}/greeting`" type="Greeting" />
</template>

<script>
import SingleEditor from './base/SingleEditor.vue'

export default {
  components: { SingleEditor },
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
