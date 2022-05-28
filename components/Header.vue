<template>
  <header>
    <div class="flexbox row">
      <div v-if="showSidebarButton" class="sidebar-button" :class="sidebarButtonClass" @click.prevent="toggleSidebar">
        <span class="material-icons material-icons-outlined">
          menu
        </span>
      </div>
      <nuxt-link to="/" class="child title primary-text">
        blargbot
      </nuxt-link>
      <div class="child container">
        <div class="flexbox row">
          <div class="child hide-small">
            <nuxt-link to="/invite" class="button flat">
              Invite
            </nuxt-link>
          </div>
          <div class="child hide-small">
            <a href="https://support.blargbot.xyz" class="button flat">Support Guild</a>
          </div>
          <template v-if="user">
            <div class="child avatar-wrapper">
              <img class="avatar" :src="avatarUrl">
              <nuxt-link :to="`/logout?redirect=${redirect}`" class="button flat">
                Logout
              </nuxt-link>
            </div>
          </template>
          <div v-else class="child hide-small">
            <nuxt-link :to="`/login?redirect=${redirect}`" class="button flat">
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
      return this.builtInSidebar ? 'show-small' : 'show-medium'
    },
    redirect() {
      const path = this.$store.state.auth.isAuth ? '/' : this.$route.path
      return encodeURIComponent(path)
    },
    user() {
      return this.$store.state.auth.user
    },
    avatarUrl() {
      if (!this.user?.avatar) {
        const discrim = parseInt(this.user.discriminator)
        return `https://cdn.discordapp.com/embed/avatars/${discrim % 5}.png`
      }
      const ext = this.user?.avatar?.startsWith('a_') ? 'gif' : 'png'
      return `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.${ext}`
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
