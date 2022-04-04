<template>
  <div>
    <div>This is the Farewell editor</div>
    <div>Current content is: {{ tagContent }}</div>
    <div>GuildId: {{ guildId }}</div>
  </div>
</template>

<script>
export default {
  props: {
    tagContent: {
      type: String,
      default: null
    },
    guildId: {
      type: String,
      required: true
    }
  }
}
</script>
