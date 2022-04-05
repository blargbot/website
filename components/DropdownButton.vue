<template>
  <div class="dropdown" :tabindex="tabindex" @blur="active = false">
    <div class="dropdown-display button flat" :class="{ open: active }" @click="active = !active">
      {{ display }}
    </div>
    <div class="dropdown-collapsable-wrapper">
      <div class="dropdown-collapsable" :class="{ open: active }">
        <div class="dropdown-options-wrapper">
          <div class="dropdown-options">
            <template v-if="options.length === 0">
              No options available
            </template>
            <template v-for="(entry, i) in options" v-else>
              <div v-if="entry.options !== undefined" :key="i" class="dropdown-option-group">
                <div class="dropdown-option-group-header">
                  {{ entry.display }}
                </div>
                <div class="dropdown-options">
                  <div v-for="(option, j) in entry.options" :key="j" class="dropdown-option" @click="selectOption(option)">
                    <emoji content="⚙️" />
                    <span>{{ option.display }}</span>
                  </div>
                </div>
              </div>
              <div v-else :key="i" class="dropdown-option" @click="selectOption(entry)">
                <emoji content="⚙️" />
                <span>{{ entry.display }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    prompt: {
      type: String,
      required: false,
      default: 'Select a value'
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      active: false,
      value: null,
      display: this.prompt
    }
  },
  mounted() {
    this.$emit('input', this.value)
  },
  methods: {
    selectOption(option) {
      if (option == null) {
        this.value = null
        this.display = this.prompt
      } else {
        this.value = option.value
        this.display = option.selectDisplay || option.display
      }
      this.active = false
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables";

$dropdown-background: #28343a;

.dropdown {
  .dropdown-display {
    text-align: left;
    background: $dropdown-background;
    &:hover {
      background: $dropdown-background;
    }
  }

  .dropdown-collapsable-wrapper {
    position: relative;

    .dropdown-collapsable {
      position: absolute;
      top: -4px;
      left: 1px;
      right: 1px;
      z-index: 1;
      overflow: hidden;
      -webkit-transition: max-height 0.3s;
      -moz-transition: max-height 0.3s;
      -ms-transition: max-height 0.3s;
      -o-transition: max-height 0.3s;
      transition: max-height 0.3s;
      max-height: 0;

      &.open {
        max-height: 50vh;

        .dropdown-options-wrapper {
          background: $dropdown-background;
        }
      }

      .dropdown-options-wrapper {
        background: $dropdown-background;
        border-radius: 3px;
        padding: 0.5rem;
        max-height: inherit;
        overflow: auto;

        .dropdown-options {
          .twemoji {
            display: inline-block;
          }

          .dropdown-option {
            padding: 0.5rem;
            border-radius: 3px;
            cursor: pointer;

            &:hover {
              background: nth(map-get($colors, "primary"), 1);
            }
          }

          .dropdown-option-group {
            background: rgba(256, 256, 256, 0.06);
            border: 1px solid black;
            border-radius: 3px;
            margin: 3px;

            .dropdown-option-group-header {
              padding: 0.5rem;
              border-bottom: 1px solid black;
            }
          }
        }
      }
    }
  }
}
</style>
