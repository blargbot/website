<template>
  <div>
    <div class="sidebar" :class="{opened}">
      Wow!
    </div>
    <div v-if="opened" class="sidebar-behind show-medium" @click.prevent="closeSidebar" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      opened: false,
      boundToggleSidebar: this.toggleSidebar.bind(this)
    }
  },
  mounted () {
    this.$root.$on('toggleSidebar', this.boundToggleSidebar)
  },
  destroyed () {
    this.$root.$off('toggleSidebar', this.boundToggleSidebar)
  },
  methods: {
    toggleSidebar () {
      this.opened = !this.opened
    },
    openSidebar () {
      this.opened = true
    },
    closeSidebar () {
      this.opened = false
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
