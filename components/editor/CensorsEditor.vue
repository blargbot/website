<template>
  <options-editor v-model="valueModel" :route="`guilds/${guildId}/censors`" type="Censor" :options="options" @reload="loadOptions" />
</template>

<script>
import OptionsEditor from './OptionsEditor.vue'

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
  computed: {
    valueModel: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    async guildId() {
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
          display: 'Default messages',
          options: [
            { display: 'Delete message', value: 'deletemessage' },
            { display: 'Ban message', value: 'banMessage' },
            { display: 'Kick message', value: 'kickMessage' }
          ]
        }
      ]
      if (censors.list !== undefined) {
        for (const [id, censor] of Object.entries(censors.list)) {
          result.push({
            display: `${id}: ${censor.term}`,
            options: [
              { display: 'Delete message', value: `${id}/deletemessage` },
              { display: 'Ban message', value: `${id}/banMessage` },
              { display: 'Kick message', value: `${id}/kickMessage` }
            ]
          })
        }
      }
      this.options = result
    }
  }
}
</script>
