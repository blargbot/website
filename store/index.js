export const state = () => ({})

export const actions = {
  async nuxtServerInit ({ dispatch }, ctx) {
    await dispatch('auth/processAuth', ctx)
    await dispatch('subtags/reload')
    await dispatch('commands/reload')
  }
}
