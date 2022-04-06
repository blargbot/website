<template>
  <div class="cluster-wrapper">
    <div class="card">
      <h3 class="cluster-header">
        Cluster {{ cluster.id }}
      </h3>
      <hr>
      <div class="cluster-stats">
        <span class="label">Guilds</span>
        <code>{{ cluster.guilds }}</code>
        <span class="label">Memory</span>
        <code>{{ formatMemory(cluster.rss) }}</code>
        <span class="label">User CPU</span>
        <code>{{ formatPercent(cluster.userCpu) }}</code>
        <span class="label">System CPU</span>
        <code>{{ formatPercent(cluster.systemCpu) }}</code>
        <span class="label">Uptime</span>
        <code>{{ formatDuration(cluster.readyTime, cluster.time) }}</code>
        <span class="label">Last update</span>
        <code>{{ formatTime(cluster.time) }}</code>
        <span class="label">Shards</span>
        <code>{{ cluster.shardCount }}</code>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export default {
  props: {
    cluster: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      updater: setInterval(() => this.tick(), 1000)
    }
  },
  destroyed() {
    clearInterval(this.updater)
  },
  methods: {
    tick() {
      this.now = Date.now()
    },
    formatPercent(value) {
      return (Math.round(value * 10000) / 100).toFixed(2) + '%'
    },
    formatMemory(value) {
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      const i = Math.floor(Math.log(value) / Math.log(1024))
      return (
        (Math.round((value * 100) / Math.pow(1024, i)) / 100).toFixed(2) +
        sizes[i]
      )
    },
    formatDuration(from, to) {
      const duration = dayjs.duration(to - from, 'ms')
      const hoursStr = duration
        .hours()
        .toString()
        .padStart(2, '0')
      return `${hoursStr}:${duration.format('mm:ss')}`
    },
    formatTime(value) {
      return dayjs(value, 'ms').format('HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
.cluster-header {
  text-align: center;
  text-transform: uppercase;
}
.cluster-stats {
  display: grid;
  grid-template-columns: 50% 50%;
  .label {
    text-align: right;
    margin: 2px;
  }

  code {
    margin: 2px;
  }
}
</style>
