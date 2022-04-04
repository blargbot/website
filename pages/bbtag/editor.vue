<template>
  <section class="wider">
    <div class="card">
      <h1>BBTag IDE</h1>
      <dropdown-button v-model="destination" :options="targetTree" prompt="Select a Tag destination" />
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
        <button class="button col-1" @click="tagContent = 'abc'">
          Button 1
        </button>
      </div>
      <bbtag-editor v-model="tagContent" class="full-width" />
    </div>
  </section>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    const targetTree = [{ display: 'Public tags', value: 'tag' }]
    const targets = [...targetTree]
    for (const guild of this.$store.state.guilds.list) {
      const group = { display: `Guild: ${guild.guild.name}`, options: [] }
      targetTree.push(group)
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
        targets.push(opt)
      })
    }

    return {
      destination: null,
      tagContent:
        '{//;Start by typing an opening brace.\nDocumentation is available here: https://blargbot.xyz/bbtag/}',
      targetTree,
      targets
    }
  },
  watch: {
    tagContent(newVal) {
      localStorage.setItem('tagContent', newVal)
    }
  },
  mounted() {
    const content = localStorage.getItem('tagContent')?.trim()
    if (content) {
      this.tagContent = content
    }
  }
}
</script>

<style lang="scss" scoped>
.full-width {
  max-width: 100%;
  width: 99999px;
}
</style>
