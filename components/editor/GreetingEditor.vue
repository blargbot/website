<template>
  <single-editor :route="`guilds/${guildId}/greeting`" type="greeting" />
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
  }
}
</script>
