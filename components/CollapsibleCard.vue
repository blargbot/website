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
  data () {
    return {
      collapsed: true,
      boundCollapse: this.collapse.bind(this),
      boundExpand: this.expand.bind(this),
      boundSetHeight: this.setHeight.bind(this),
      height: 'initial'
    }
  },
  computed: {
    style () {
      return {
        height: this.collapsed ? 0 : this.height + 'px'
      }
    }
  },
  mounted () {
    this.$root.$on('expandAll', this.boundExpand)
    this.$root.$on('collapseAll', this.boundCollapse)
    window.addEventListener('resize', this.boundSetHeight)
    this.setHeight()

    if (this.name && '#' + this.name === window.location.hash) {
      this.collapsed = false
    }
  },
  destroyed () {
    this.$root.$off('expandAll', this.boundExpand)
    this.$root.$off('collapseAll', this.boundCollapse)
    window.removeEventListener('resize', this.boundSetHeight)
  },
  methods: {
    collapse () {
      this.collapsed = true
    },
    expand () {
      this.collapsed = false
    },
    toggleCollapsed () {
      if (this.collapsed) {
        this.expand()
      } else {
        this.collapse()
      }
    },
    setHeight () {
      this.height = this.$refs.content.scrollHeight
    }
  }
}
</script>

<style lang="scss" scoped>

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

    .badges {
      display: flex;

      .badge {
        display: block;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 0.5rem;
      }
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
