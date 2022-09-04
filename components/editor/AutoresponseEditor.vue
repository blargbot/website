<template>
  <options-editor
    :route="`guilds/${guildId}/autoresponses`"
    type="autoresponse"
    :options="options"
    :delete-method="null"
    save-method="$patch"
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
      const ars = await this.$axios.$get(`guilds/${this.guildId}/autoresponses`)
      const result = []
      if (ars.everything !== undefined) {
        result.push({
          display: '🌍 Everything Autoresponse',
          selectDisplay: 'Everything Autoresponse',
          value: 'everything'
        })
      }
      if (ars.filtered !== undefined) {
        for (const [id, ar] of Object.entries(ars.filtered)) {
          result.push({
            display: `💬 ${id}: ${ar.term}`,
            selectDisplay: `${id}: ${ar.term}`,
            value: id
          })
        }
      }
      this.options = result
    }
  }
}
</script>
