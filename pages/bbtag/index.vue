<template>
  <div>
    <section>
      <h1>BBTag</h1>
      <p>
        blargbot is equipped with a system of tags called BBTag, designed to mimic a
        programming language while still being relatively easy to use. You can use this system as the
        building-blocks to create your own advanced commands, whether it be through public tags or
        guild-specific custom commands.
      </p>

      <div class="button-grid">
        <nuxt-link to="/bbtag/subtags" class="child-2 button shadow-2">
          View Subtags
        </nuxt-link>
        <nuxt-link to="/bbtag/editor" class="child-2 button shadow-2">
          View the editor
        </nuxt-link>
      </div>

      <markdown :content="docs" :options="{anchorTags: true}" />
    </section>
  </div>
</template>

<script>
import docs from '@/assets/md/subtags.md'
import Markdown from '~/components/Markdown.vue'

export default {
  components: { Markdown },
  data () {
    return {
      docs
    }
  }
}
</script>
