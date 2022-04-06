<template>
  <section>
    <h1>Logging you in...</h1>
  </section>
</template>

<script>
/* global window */
export default {
  async mounted() {
    if (this.$route.query && this.$route.query.error) {
      localStorage.removeItem('redirect')
      this.$router.push('/')
    } else if (this.$route.query && this.$route.query.code) {
      const token = await this.$axios.$post('/auth/validate', {
        code: this.$route.query.code
      })

      if (token) {
        this.$cookies.set('token', token, { secure: true })
        await this.$store.dispatch('auth/processAuth')
        const route = localStorage.getItem('redirect')
        localStorage.removeItem('redirect')
        this.$router.push(route || '/')
      }
    } else {
      localStorage.setItem('redirect', this.$route.query.redirect || '/')
      window.location.href =
        'https://discordapp.com/oauth2/authorize' +
        '?client_id=' +
        this.$config.id +
        '&scope=identify' +
        '&response_type=code' +
        '&redirect_uri=' +
        this.$config.callback
    }
  }
}
</script>
