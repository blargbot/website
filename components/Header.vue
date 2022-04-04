<template>
  <header>
    <div class="flexbox row">
      <div
        v-if="showSidebarButton"
        class="sidebar-button"
        :class="sidebarButtonClass"
        @click.prevent="toggleSidebar"
      >
        <span class="material-icons material-icons-outlined"> menu </span>
      </div>
      <nuxt-link
        to="/"
        class="child title primary-text"
      >
        blargbot
      </nuxt-link>
      <div class="child container">
        <div class="flexbox row">
          <div class="child hide-small">
            <nuxt-link
              to="/invite"
              class="button flat"
            >
              Invite
            </nuxt-link>
          </div>
          <div class="child hide-small">
            <a
              href="https://support.blargbot.xyz"
              class="button flat"
            >
              Support Guild
            </a>
          </div>
          <div class="child hide-small">
            <nuxt-link
              to="/donate"
              class="button flat"
            >
              Donate
            </nuxt-link>
          </div>
          <template v-if="$store.state.auth.user">
            <div class="child">
              <nuxt-link
                to="/dashboard"
                class="button flat"
              >
                Dashboard
              </nuxt-link>
            </div>
            <div class="child avatar-wrapper">
              <img
                class="avatar"
                :src="`https://cdn.discordapp.com/avatars/${$store.state.auth.user.id}/${$store.state.auth.user.avatar}.png`"
              >
              <nuxt-link
                to="/logout?redirect=${redirect}"
                class="button flat"
              >
                Logout
              </nuxt-link>
            </div>
          </template>
          <div
            v-else
            class="child"
          >
            <nuxt-link
              :to="`/login?redirect=${redirect}`"
              class="button flat"
            >
              Login
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    builtInSidebar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      documentationOptions: [
        { name: 'Commands', path: '/commands' },
        { name: 'BBTag', path: '/subtags' }
      ]
    }
  },
  computed: {
    showSidebarButton() {
      return this.$route.path !== '/invite'
    },
    sidebarButtonClass() {
      if (this.$route.path === '/') {
        return ''
      }
      return this.builtInSidebar ? 'show-small' : 'show-medium'
    },
    redirect() {
      const path = this.$store.state.auth.isAuth ? '/' : this.$route.path
      return encodeURIComponent(path)
    }
  },
  methods: {
    toggleSidebar() {
      this.$root.$emit('toggleSidebar')
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  position: sticky;
  top: 0;
  height: 80px;
  min-height: 80px;
  max-height: 80px;
  padding: 20px 0;
  z-index: 999;
}
.flexbox {
  justify-content: center;
  align-items: center;
  align-content: center;
  margin: 0 40px;

  .flexbox .child {
    margin: 0;
  }

  .child.title {
    flex: 0 1 auto;
    font-size: 1.5em;
  }
  .child.container {
    flex: 1 0 auto;

    .flexbox {
      justify-content: flex-end;
      margin: 0;
    }
  }
  .child {
    margin: 0 0 0 20px;
  }
}

.sidebar-button {
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
}

.avatar {
  height: 32px;
  width: 32px;
  border-radius: 100px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
}
</style>
