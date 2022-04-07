<template>
  <img class="emoji" draggable="false" :alt="name" :src="`https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}`">
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    animated: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    formatted() {
      return `Custom emote ${this.id}`
    }
  }
}
</script>
