<template>
  <section class="full">
    <div class="card">
      <h1>BBTag Editor</h1>
      <dropdown-button v-model="destination" :options="targetTree" prompt="Select a Tag destination" />
      <component :is="destination.component" v-if="destination != null" v-model="content" :guild-id="destination.id" />
      <bbtag-editor ref="editor" v-model="content" />
    </div>
  </section>
</template>

<script>
import BbtagEditor from '~/components/BbtagEditor.vue'
import DropdownButton from '~/components/DropdownButton.vue'
import AutoresponseEditor from '~/components/editor/AutoresponseEditor.vue'
import CensorsEditor from '~/components/editor/CensorsEditor.vue'
import CustomCommandEditor from '~/components/editor/CustomCommandEditor.vue'
import FarewellEditor from '~/components/editor/FarewellEditor.vue'
import GreetingEditor from '~/components/editor/GreetingEditor.vue'
import IntervalEditor from '~/components/editor/IntervalEditor.vue'
import RolemesEditor from '~/components/editor/RolemesEditor.vue'
import TagEditor from '~/components/editor/TagEditor.vue'

const types = [
  {
    key: 'ccommands',
    display: '⚙️ Custom Commands',
    editor: CustomCommandEditor
  },
  {
    key: 'censors',
    display: '🛡️ Censors',
    editor: CensorsEditor
  },
  {
    key: 'autoresponses',
    display: '💬 Autoresponses',
    editor: AutoresponseEditor
  },
  {
    key: 'rolemes',
    display: '🎟️ Rolemes',
    editor: RolemesEditor
  },
  {
    key: 'interval',
    display: '⏱️ Interval',
    editor: IntervalEditor
  },
  {
    key: 'greeting',
    display: '📣 Greeting',
    editor: GreetingEditor
  },
  {
    key: 'farewell',
    display: '👋 Farewell',
    editor: FarewellEditor
  }
]

export default {
  components: { DropdownButton, BbtagEditor },
  middleware: 'authenticated',
  data() {
    const targetTree = []
    const unavailable = []
    for (const guild of this.$store.state.guilds.list) {
      const group = {
        display: `Guild: ${guild.guild.name}`,
        options: [],
        emptyText: "You don't have permission to use BBTag here"
      }
      for (const type of types) {
        if (guild[type.key]) {
          group.options.push({
            display: type.display,
            value: { component: type.editor }
          })
        }
      }
      if (guild.guild.name === 'Git Outta My Server') {
        group.options.length = 0
      }
      group.options.forEach((opt) => {
        opt.selectDisplay = `${guild.guild.name} ${opt.display}`
        opt.value.id = guild.guild.id
      })
      if (group.options.length === 0) {
        unavailable.push(group)
      } else {
        targetTree.push(group)
      }
    }

    return {
      destination: null,
      content: null,
      targetTree: [
        {
          display: 'Public tags',
          emoji: '👥',
          value: { component: TagEditor }
        },
        ...targetTree.sort((a, b) => (a.display < b.display ? -1 : 1)),
        ...unavailable
      ]
    }
  },
  watch: {
    content(newVal) {
      localStorage.setItem('content', newVal)
    }
  },
  mounted() {
    const content = localStorage.getItem('content')
    if (content) {
      this.content = content
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  background: transparent;
  padding: 0 1rem;
}
</style>
