export default function ({ store, redirect, route }) {
  if (store.state.auth.user === null) {
    redirect('/login?redirect=' + encodeURIComponent(route.path))
  }
}
