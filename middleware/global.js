export default function ({ store }) {
  store.commit('auth/isAuth', false)
}
