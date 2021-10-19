<template>
  <div class="dropdown-wrapper" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="dropdown button flat">
      {{ name }}
    </div>
    <div v-if="active" class="dropdown-content">
      <div v-for="option in options" :key="option.name" class="dropdown-content-option">
        {{ option.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    name: {
      type: String,
      default: 'Dropdown'
    }
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    onMouseEnter () {
      this.active = true
    },
    onMouseLeave () {
      this.active = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-wrapper {
  position: relative;
}

.dropdown-content {
  position: absolute;
  width: 100%;
  padding: 0.5rem;
  background: #32424A;
  display: flex;
  flex-direction: column;

  .dropdown-content-option {

  }
}
</style>
