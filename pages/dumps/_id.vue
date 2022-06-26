<template>
  <div>
    <section>
      <div v-if="id != null" class="child card shadow-2">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-twemoji v-html="content" />
        <discord-embed
          v-for="embed in embeds"
          :key="JSON.stringify(embed)"
          :embed="embed"
          :context="{}"
        />
        <hr>
        <p>This page will expire {{ expiry }} ({{ delta }})</p>
        <a :href="'/dumps/' + id + '.txt'" :download="id + '.txt'" class="button shadow-1">Download</a>
      </div>
      <template v-else>
        <p>
          That dump is either invalid or has expired!
        </p>
      </template>
    </section>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import showdown, { Converter } from 'showdown'
import hljs from 'highlight.js'
import xss from 'xss'
import DiscordEmbed from '~/components/chatlogs/DiscordEmbed.vue'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

export * from 'highlight.js/scss/base16/solarized-dark.scss'

export default {
  components: { DiscordEmbed },
  async asyncData({ params, $axios }) {
    let dump
    try {
      dump = await $axios.$get('/dumps/' + params.id)
      let expiry = 'never'
      let delta = 'never'
      if (dump.expiry > 0) {
        expiry = dayjs()
          .add(dump.expiry, 's')
          .format('MMMM Do, YYYY')
        delta = dayjs.duration(dump.expiry, 's').humanize(true)
      }
      return {
        id: dump.id,
        channelid: dump.channelid,
        content: xss(converter.makeHtml(dump.content), { whiteList }),
        embeds: dump.embeds,
        expiry,
        delta
      }
    } catch (err) {
      return {
        id: null
      }
    }
  }
}

const whiteList = xss.whiteList
// Allow marquees
whiteList.marquee = [
  'behavior',
  'direction',
  'hspace',
  'loop',
  'scrollamount',
  'scrolldelay',
  'truespeed',
  'vspace'
]
// Allow style without attributes
whiteList.style = []
// Allow link tags for external CSS.
whiteList.link = ['rel', 'href']
// add custom attributes to all elements
for (const key in whiteList) {
  whiteList[key].push('class', 'id', 'style', 'title', 'data-tooltip')
}

const converter = new Converter({
  extensions: [
    {
      type: 'output',
      filter(text, converter, options) {
        // use new shodown's regexp engine to conditionally parse codeblocks
        const left = '<pre><code\\b[^>]*>'
        const right = '</code></pre>'
        const flags = 'g'
        function replacement(wholeMatch, match, left, right) {
          // unescape match to prevent double escaping
          match = match
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
          return left + hljs.highlightAuto(match).value + right
        }
        return showdown.helper.replaceRecursiveRegExp(
          text,
          replacement,
          left,
          right,
          flags
        )
      }
    }
  ]
})

converter.setFlavor('github')
converter.setOption('disableForced4SpacesIndentedSublists', true)
</script>

<style scoped>
.card {
  padding-top: 15px;
}
</style>
