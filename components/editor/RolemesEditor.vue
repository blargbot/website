<template>
  <options-editor
    :route="`guilds/${guildId}/rolemes`"
    type="roleme"
    :options="options"
    @reload="loadOptions"
  />
</template>

<script>
import OptionsEditor from './base/OptionsEditor.vue'

export default {
  components: { OptionsEditor },
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
  data() {
    return {
      options: []
    }
  },
  watch: {
    async guildId() {
      this.options = []
      await this.loadOptions()
    }
  },
  async mounted() {
    await this.loadOptions()
  },
  methods: {
    async loadOptions() {
      const rolemes = await this.$axios.$get(`guilds/${this.guildId}/rolemes`)
      const result = []
      for (const [id, roleme] of Object.entries(rolemes)) {
        result.push({
          display: `🎟️ #${id} (${roleme.message}) - Output message`,
          selectDisplay: `#${id} - Output message`,
          value: `${id}/output`
        })
      }
      this.options = result
    }
  }
}
</script>
