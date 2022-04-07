<template>
  <section>
    Redirecting you to the feedback page...
  </section>
</template>

<script>
export default {
  async mounted() {
    const url = await this.$axios.$get(`/feedback/${this.$route.params.id}/url`)
    window.location.href = url
  }
}
</script>
