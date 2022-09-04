<template>
  <options-editor
    :route="`guilds/${guildId}/censors`"
    type="censor"
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
      const censors = await this.$axios.$get(`guilds/${this.guildId}/censors`)
      const result = [
        {
          display: 'Defaults',
          options: getCensorTypes('Default')
        }
      ]
      if (censors.list !== undefined) {
        for (const [id, censor] of Object.entries(censors.list)) {
          result.push({
            display: `#${id} (${censor.term})`,
            options: getCensorTypes(`#${id}`, t => `${id}/${t}`)
          })
        }
      }
      this.options = result
    }
  }
}

function getCensorTypes(id, getValue = v => v) {
  return [
    {
      display: '🗑️ Delete message',
      selectDisplay: `${id} - delete message`,
      value: getValue('deletemessage')
    },
    {
      display: '🛑 Ban message',
      selectDisplay: `${id} - ban message`,
      value: getValue('banmessage')
    },
    {
      display: '👋 Kick message',
      selectDisplay: `${id} - kick message`,
      value: getValue('kickmessage')
    }
  ]
}
</script>
