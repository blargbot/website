<template>
  <section class="wider">
    <div class="card">
      <h1>BBTag IDE</h1>
      <div class="ide-wrapper">
        <select class="col-1" v-bind="target">
          <option v-for="t in validTargets" :key="t.value" :value="t.value">
            {{ t.name }}
          </option>
        </select>
        <select class="col-1" v-bind="type">
          <option v-for="t in validTypes" :key="t.value" :value="t.value">
            {{ t.name }}
          </option>
        </select>
        <button class="button col-1">
          Button 1 aaaaaaaa aaaaaaa
        </button>
        <button class="button col-1">
          Button 1 aaaaaaaa aaaaaaa
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
        <div class="col-4">
          <tag-editor ref="editor" v-model="tagContent" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TagEditor from '~/components-client/TagEditor.vue'

let tagContent = ''

export default {
  components: { TagEditor },
  middleware: 'auth',
  async asyncData ({ $axios }) {
    const guilds = await $axios.$get('/guilds')
    return {
      guildLookup: new Map(guilds.map(g => [g.guild.id, g])),
      guildList: guilds
        .map(g => ({ name: g.guild.name, value: g.guild.id }))
        .sort((a, b) => (a.name < b.name ? -1 : 1))
    }
  },
  data () {
    return {
      target: '',
      type: null
    }
  },
  computed: {
    tagContent: {
      get () {
        return tagContent
      },
      set (value) {
        tagContent = value
        localStorage.setItem('tagContent', value)
      }
    },
    validTargets () {
      return [
        {
          name: 'Public Tags',
          value: ''
        },
        ...this.guildList
      ]
    },
    validTypes () {
      console.log(this.target)
      return []
    }
  },
  mounted () {
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
