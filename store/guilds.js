export const state = () => ({
  list: []
})

export const mutations = {
  setList(state, guilds) {
    state.list = guilds.sort((a, b) => a.guild.name < b.guild.name ? -1 : 1)
  }
}

export const actions = {
  async reload({ commit }) {
    const guilds = await this.$axios.$get('/guilds')
    commit('setList', guilds)
  }
}
