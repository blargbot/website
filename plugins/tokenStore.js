export default function ({ store, app: { $axios } }) {
  if (store.state.auth.token) { $axios.setToken(store.state.auth.token) }
}
