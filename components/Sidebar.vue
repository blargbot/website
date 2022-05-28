<template>
  <div :class="builtIn ? 'built-in' : 'loose'">
    <div class="sidebar" :class="{opened}">
      <div class="button-container">
        <nuxt-link to="/invite" class="sidebar-button show-small">
          Invite
        </nuxt-link>
        <a href="https://support.blargbot.xyz" class="sidebar-button show-small">Support Guild</a>
        <nuxt-link to="/bbtag/editor" class="sidebar-button">
          BBTag Editor
        </nuxt-link>
        <nuxt-link to="/dashboard" class="sidebar-button">
          Dashboard
        </nuxt-link>
        <nuxt-link to="/donate" class="sidebar-button">
          Donate
        </nuxt-link>
        <nuxt-link to="/commands/usage" class="sidebar-button">
          Command Usage
        </nuxt-link>
        <nuxt-link to="/commands" class="sidebar-button child">
          Command List
        </nuxt-link>
        <nuxt-link to="/bbtag" class="sidebar-button">
          BBTag Documentation
        </nuxt-link>
        <nuxt-link to="/bbtag/subtags" class="sidebar-button child">
          Subtags
        </nuxt-link>
      </div>
    </div>
    <div v-if="opened" class="sidebar-behind show-medium" @click.prevent="closeSidebar" />
  </div>
</template>

<script>
export default {
  props: {
    builtIn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      opened: false,
      boundToggleSidebar: this.toggleSidebar.bind(this)
    }
  },
  mounted() {
    this.$root.$on('toggleSidebar', this.boundToggleSidebar)
  },
  destroyed() {
    this.$root.$off('toggleSidebar', this.boundToggleSidebar)
  },
  methods: {
    toggleSidebar() {
      this.opened = !this.opened
    },
    openSidebar() {
      this.opened = true
    },
    closeSidebar() {
      this.opened = false
    }
  }
}
</script>

<style lang="scss" scoped>
.loose {
  z-index: 100;

  .sidebar {
    position: fixed;
    top: 80px;
    left: 0;
    bottom: 0;
    transition-duration: 0.1s;
    z-index: 10;
  }
  .sidebar-behind {
    position: fixed;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  @media screen and (max-width: 1400px) {
    .sidebar {
      left: -300px;
      &.opened {
        left: 0;
      }
    }
  }
}
.built-in {
  flex: 0 0 300px;
  z-index: 100;

  .sidebar {
    position: fixed;
    top: 80px;
    transition-duration: 0.1s;
    z-index: 10;
  }
  .sidebar-behind {
    position: fixed;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  @media screen and (max-width: 800px) {
    & {
      position: fixed;
    }
    .sidebar {
      left: -300px;
      &.opened {
        left: 0;
      }
    }
  }
}
.button-container {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  .sidebar-button {
    padding: 1rem 2rem;
    color: white;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &.child {
      padding-left: 4rem;
    }
  }
}
</style>
