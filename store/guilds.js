export const state = () => ({
  list: [],
  settings: []
})

export const mutations = {
  setList(state, guilds) {
    state.list = guilds.sort((a, b) => a.guild.name < b.guild.name ? -1 : 1)
  },
  setSettings(state, settings) {
    state.settings = settings.sort((a, b) => a.name < b.name ? -1 : 1)
  }
}

export const actions = {
  async reloadMine({ commit }) {
    const settings = await this.$axios.$get('/guilds')
    commit('setList', Object.values(settings))
  },
  async reloadSettings({ commit }) {
    const settings = await this.$axios.$get('/guilds/settings')
    commit('setSettings', Object.values(settings))
  }
}
