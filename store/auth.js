export function state () {
  return {
    token: null,
    user: null
  }
}

export const mutations = {
  setToken (state, token) {
    state.token = token
  },
  setUser (state, user) {
    state.user = user
  }
}

export const actions = {
  async processAuth ({ commit }, { app: { $axios, $cookies }, req }) {
    if (req.headers.cookie) {
      const token = $cookies.get('token')

      if (token) {
        try {
          commit('setToken', token)
          $axios.setToken(token)

          const user = await $axios.$get('/users/@me')

          commit('setUser', user)
        } catch (err) {
          console.error(err)
          $axios.setToken(false)
          $cookies.remove('token')
        }
      }
    }
  }
}
