export default function ({ store, redirect, route }) {
  store.commit('auth/isAuth', true)
  if (store.state.auth.user === null) {
    redirect('/login?redirect=' + encodeURIComponent(route.path))
  }
}
