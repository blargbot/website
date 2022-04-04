<template>
  <section>
    <h1>Logging you out...</h1>
  </section>
</template>

<script>
export default {
  mounted () {
    this.$axios.setToken(false)
    this.$cookies.set('token', null)
    this.$store.commit('auth/setToken', null)
    this.$store.commit('auth/setUser', null)
    this.$router.push(this.$route.query.redirect || '/')
  }
}
</script>
