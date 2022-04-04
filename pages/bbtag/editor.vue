<template>
  <section class="wider">
    <div class="card">
      <h1>BBTag IDE</h1>
      <dropdown-button v-model="destination" :options="targets" prompt="Select a Tag destination" />
      <br>
      <br>
      <br>
      <br>
      Selected: {{ destination }}
      <div class="ide-wrapper">
        <button class="button col-1">
          Button 1
        </button>
        <button class="button col-1">
          Button 1
        </button>
        <button class="button col-1">
          Button 1
        </button>
        <button class="button col-1">
          Button 1
        </button>
        <button class="button col-1">
          Button 1
        </button>
        <button class="button col-1">
          Button 1
        </button>
      </div>
      <tag-editor ref="editor" v-model="tagContent" />
    </div>
  </section>
</template>

<script>
import TagEditor from '~/components/editor/TagEditor.vue'
import DropdownButton from '~/components/DropdownButton.vue'

let tagContent = ''

export default {
  components: { TagEditor, DropdownButton },
  middleware: 'authenticated',
  data() {
    const targets = []
    targets.push({ display: 'Public tags', value: 'tag' })
    for (const guild of this.$store.state.guilds.list) {
      const group = { display: `Guild: ${guild.guild.name}`, options: [] }
      targets.push(group)
      if (guild.ccommands) {
        group.options.push({ display: 'Custom Commands', value: 'ccommands' })
      }
      if (guild.censors) {
        group.options.push({ display: 'Censors', value: 'censors' })
      }
      if (guild.autoresponses) {
        group.options.push({ display: 'Autoresponses', value: 'autoresponses' })
      }
      if (guild.rolemes) {
        group.options.push({ display: 'Rolemes', value: 'rolemes' })
      }
      if (guild.interval) {
        group.options.push({ display: 'Interval', value: 'interval' })
      }
      if (guild.greeting) {
        group.options.push({ display: 'Greeting', value: 'greeting' })
      }
      if (guild.farewell) {
        group.options.push({ display: 'Farewell', value: 'farewell' })
      }
      group.options.forEach((opt) => {
        opt.value = `${guild.guild.id}|${opt.value}`
        opt.selectDisplay = `${guild.guild.name} ${opt.display}`
      })
    }
    return {
      destination: null,
      targets
    }
  },
  computed: {
    tagContent: {
      get() {
        return tagContent
      },
      set(value) {
        tagContent = value
        localStorage.setItem('tagContent', value)
      }
    }
  },
  mounted() {
    tagContent = localStorage.getItem('tagContent')
    this.$refs.editor.setValue(tagContent)
  }
}
</script>

<style lang="scss" scoped>
.ide-wrapper {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;

  @for $i from 1 to 5 {
    .col-#{$i} {
      grid-column-end: span $i;
    }
  }
}
</style>
