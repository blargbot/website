<template>
  <span class="timestamp" :title="formatTimestamp(value, 'F')">{{ formatTimestamp(value, format) }}</span>
</template>

<script>
import Vue from 'vue'
import { defaultRules } from 'simple-markdown'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const discordTimestampRules = {
  /** @type {import('simple-markdown').ParserRule} */
  discordTimestamp: {
    order: defaultRules.strong.order,
    match: source => /^<t:(\d+)(?::([tTdDfFR]))?>/.exec(source),
    parse(capture) {
      return {
        value: capture[1],
        format: capture[2]
      }
    },
    vue(node) {
      return {
        component,
        props: {
          value: node.value,
          format: node.format
        }
      }
    }
  }
}

const component = Vue.extend({
  props: {
    value: {
      type: String,
      required: true
    },
    format: {
      type: String,
      default: 'f'
    }
  },
  data() {
    return {
      now: dayjs(),
      tickId: null
    }
  },
  computed: {
    display() {
      return this.value
    }
  },
  destroyed() {
    if (this.tickId) {
      clearInterval(this.tickId)
    }
  },
  mounted() {
    if (this.tickId) {
      clearInterval(this.tickId)
    }
    this.tickId = setInterval(() => this.tick(), 1000)
  },
  methods: {
    tick() {
      this.now = dayjs()
    },
    formatTimestamp(value, format) {
      let timestamp = dayjs.unix(value)
      if (!timestamp.isValid()) {
        timestamp = dayjs(value)
      }
      switch (format) {
        case 't':
          return timestamp.format('HH:mm')
        case 'T':
          return timestamp.format('HH:mm:ss')
        case 'd':
          return timestamp.format('DD/MM/YYYY')
        case 'D':
          return timestamp.format('DD MMMM YYYY')
        case 'F':
          return timestamp.format('dddd, DD MMMM YYYY HH:mm')
        case 'R':
          return dayjs.duration(timestamp.diff(this.now)).humanize(true)
        default:
          return timestamp.format('DD MMMM YYYY HH:mm')
      }
    }
  }
})
export default component
</script>
