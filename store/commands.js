export const state = () => ({
  list: []
})

export const mutations = {
  setList(store, commands) {
    store.list = commands
  }
}

export const actions = {
  async reload({ commit }) {
    const commands = await this.$axios.$get('/commands')
    commit('setList', Object.values(commands))
  }
}
