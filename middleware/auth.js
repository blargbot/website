export default function ({ store, redirect }) {
  if (store.state.auth.user === null) {
    redirect('/login')
  }
}
