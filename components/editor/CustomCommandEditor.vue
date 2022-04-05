<template>
  <div>
    <div class="control-row v-aligned">
      <label for="ccName" class="col-1">Command Name</label>
      <input v-model="ccName" name="ccName" class="input col-1">
      <button class="button col-1" @click.prevent="loadCC">
        Load
      </button>
      <button class="button col-1" @click.prevent="saveCC">
        Save
      </button>
    </div>
    <div class="control-row v-aligned">
      <label for="newName" class="col-1">New name</label>
      <input v-model="newName" name="newName" class="input col-1">
      <button class="button col-1" @click.prevent="renameCC">
        Rename
      </button>
      <button class="button danger col-1 v-align" @click.prevent="deleteCC">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    guildId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      ccName: '',
      newName: '',
      hasLoaded: false
    }
  },
  mounted() {
    this.hasLoaded = false
  },
  methods: {
    renameCC() {
      alert(
        `You are renaming the custom command ${this.commandName} to ${this.newName}`
      )
    },
    loadCC() {
      this.hasLoaded = true
      alert(`You are trying to load the custom command ${this.commandName}`)
    },
    deleteCC() {
      if (!this.hasLoaded) {
        alert(
          `You are trying to delete the custom command ${this.commandName} before you loaded it`
        )
      } else {
        alert(`You are trying to delete the custom command ${this.commandName}`)
      }
    },
    saveCC() {
      if (!this.hasLoaded) {
        alert(
          `You are trying to save the custom command ${this.commandName} before you loaded it`
        )
      } else {
        alert(`You are trying to save the custom command ${this.commandName}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.control-row {
  display: grid;
  grid-template-columns: 10% 60% 15% 15%;

  .col-1 {
    grid-column-end: span 1;
  }
  .col-2 {
    grid-column-end: span 2;
  }
}
</style>
