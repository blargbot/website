<template>
  <section class="wider">
    <div class="card">
      <h1>BBTag IDE</h1>
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

class Test {
  _field
  abc() {
    return false
  }
}

new Test().abc()

export default {
  components: { DropdownButton, BbtagEditor },
  middleware: 'authenticated',
  data() {
    const targetTree = [
      { display: 'Public tags', emoji: '👥', value: { component: TagEditor } }
    ]
    const targets = [...targetTree]
    for (const guild of this.$store.state.guilds.list) {
      const group = { display: `Guild: ${guild.guild.name}`, options: [] }
      targetTree.push(group)
      if (guild.ccommands) {
        group.options.push({
          display: '⚙️ Custom Commands',
          value: { component: CustomCommandEditor }
        })
      }
      if (guild.censors) {
        group.options.push({
          display: '🛡️ Censors',
          value: { component: CensorsEditor }
        })
      }
      if (guild.autoresponses) {
        group.options.push({
          display: '💬 Autoresponses',
          value: { component: AutoresponseEditor }
        })
      }
      if (guild.rolemes) {
        group.options.push({
          display: '🎟️ Rolemes',
          value: { component: RolemesEditor }
        })
      }
      if (guild.interval) {
        group.options.push({
          display: '⏱️ Interval',
          value: { component: IntervalEditor }
        })
      }
      if (guild.greeting) {
        group.options.push({
          display: '📣 Greeting',
          value: { component: GreetingEditor }
        })
      }
      if (guild.farewell) {
        group.options.push({
          display: '👋 Farewell',
          value: { component: FarewellEditor }
        })
      }
      group.options.forEach((opt) => {
        opt.selectDisplay = `${guild.guild.name} ${opt.display}`
        opt.value.id = guild.guild.id
        targets.push(opt)
      })
    }

    return {
      destination: null,
      content: null,
      targetTree,
      targets
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
