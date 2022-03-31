<template>
  <div>
    <section>
      <p>Id: {{ id }}</p>
      <p>Content: {{ content }}</p>
      <p>Embeds: {{ embeds || [] }}</p>
      <p>ChannelId: {{ channelid }}</p>
      <p>Expiry: {{ expiry }}</p>
      <p>Delta: {{ delta }}</p>
    </section>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

export default {
  async asyncData ({ params, $axios }) {
    const dump = await $axios.$get('/dumps/' + params.id)
    let expiry = 'never'
    let delta = 'never'
    if (dump.expiry > 0) {
      expiry = dayjs()
        .add(dump.expiry, 's')
        .format('MMMM Do, YYYY')
      delta = dayjs.duration(dump.expiry, 's').humanize(true)
    }

    return {
      ...dump,
      expiry,
      delta
    }
  }
}
</script>
