export function state() {
  return {
    token: null,
    user: null,
    isAuth: false
  }
}

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  setUser(state, user) {
    state.user = user
  },
  isAuth(state, isAuth) {
    state.isAuth = isAuth
  }
}

export const actions = {
  async processAuth({ commit, dispatch }) {
    const token = this.$cookies.get('token')
    if (!token) {
      return
    }

    try {
      commit('setToken', token)
      this.$axios.setToken(token)

      const user = await this.$axios.$get('/users/@me')
      commit('setUser', user)

      await dispatch('guilds/reload', null, { root: true })
    } catch (err) {
      this.$axios.setToken(false)
      this.$cookies.remove('token')
    }
  }
}
