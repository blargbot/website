export const state = () => ({
  list: []
})

export const mutations = {
  setList (state, guilds) {
    state.list = guilds
  }
}

export const actions = {
  async reload ({ commit }) {
    const guilds = await this.$axios.$get('/guilds')
    commit('setList', guilds)
  }
}
