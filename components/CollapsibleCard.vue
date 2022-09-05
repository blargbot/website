<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="title-bar" @click.prevent="toggleCollapsed">
        <slot name="title-bar" />
      </div>
      <div class="content-wrapper" :style="style">
        <div ref="content" class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startCollapsed: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      collapsed: true
    }
  },
  computed: {
    style() {
      return {
        height: this.collapsed ? 0 : this.$refs.content.scrollHeight + 'px'
      }
    }
  },
  watch: {
    $route(to) {
      if (to.hash === '#' + this.name) {
        this.expand()
      }
    }
  },
  mounted() {
    if (this.name && '#' + this.name === window.location.hash) {
      this.expand()
      this.$el.scrollIntoView()
    }
  },
  methods: {
    collapse() {
      this.collapsed = true
    },
    expand() {
      this.collapsed = false
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrapper {
  scroll-margin-top: 100px;
  max-width: 96vw;
  margin: 0 auto;
}

.card {
  padding: 0;

  .title-bar {
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-radius: 0.5rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 5px 15px 5px 15px;

    user-select: none;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }

  .content-wrapper {
    overflow: hidden;
    transition: height 0.2s;

    &.collapsed {
      height: 0;
    }
  }

  .content {
    padding: 0 15px 0 15px;
    overflow: hidden;
  }
}
</style>
