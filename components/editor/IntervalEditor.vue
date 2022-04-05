<template>
  <div>
    <div>This is the Interval editor</div>
    <div>Current content is: {{ value }}</div>
    <div>GuildId: {{ guildId }}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
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
