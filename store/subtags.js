export const state = () => ({
  list: [],
  categories: []
})

export const mutations = {
  setList (state, subtags) {
    state.list = subtags
  },
  setCategories (state, categories) {
    state.categories = categories
  }
}

export const actions = {
  async reload ({ dispatch }) {
    await Promise.all([
      dispatch('reloadListOnly'),
      dispatch('reloadCategories')
    ])
  },
  async reloadListOnly ({ commit }) {
    const subtags = await this.$axios.$get('/subtags')
    await commit('setList', subtags)
  },
  async reloadCategories ({ commit }) {
    const categories = await this.$axios.$get('/subtags/meta/categories')
    await commit('setCategories', Object.keys(categories).map(i => categories[i]))
  }
}
