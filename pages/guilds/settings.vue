<template>
  <section>
    <h1>Guild settings</h1>
    <p>Settings for you guild can be changed using the <code>b!settings set &lt;key&gt; &lt;value&gt;</code> command</p>
    <guild-setting v-for="setting in settings" :key="setting.key" :setting="setting" />
  </section>
</template>

<script>
import GuildSetting from '~/components/guilds/GuildSetting.vue'
export default {
  components: { GuildSetting },
  computed: {
    settings() {
      return this.$store.state.guilds.settings
    }
  }
}
</script>
