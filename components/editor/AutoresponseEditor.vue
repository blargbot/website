<template>
  <options-editor
    v-model="valueModel"
    :route="`guilds/${guildId}/autoresponses`"
    type="Autoresponse"
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
      const ars = await this.$axios.$get(`guilds/${this.guildId}/autoresponses`)
      const result = []
      if (ars.everything !== undefined) {
        result.push({
          display: 'Everything Autoresponse',
          emoji: '🌍',
          value: 'everything'
        })
      }
      if (ars.filtered !== undefined) {
        for (const [id, ar] of Object.entries(ars.filtered)) {
          result.push({
            display: `${id}: ${ar.term}`,
            emoji: '💬',
            value: id
          })
        }
      }
      this.options = result
    }
  }
}
</script>
