<template>
  <section>
    <h1>Logging you in...</h1>
  </section>
</template>

<script>
/* global window */
export default {
  async mounted () {
    if (this.$route.query && this.$route.query.code) {
      const token = await this.$axios.$get('/auth/validate', {
        params: {
          code: this.$route.query.code
        }
      })

      if (token) {
        this.$axios.setToken(token)
        this.$cookies.set('token', token)
        this.$store.commit('auth/setToken', token)

        const user = await this.$axios.$get('/users/@me')

        console.log(user)

        this.$store.commit('auth/setUser', user)
        this.$router.push('/')
      }
    } else {
      window.location.href =
        'https://discordapp.com/oauth2/authorize' +
        '?client_id=' + this.$config.id +
        '&scope=identify' +
        '&response_type=code' +
        '&redirect_uri=' + this.$config.callback
    }
  }
}
</script>
