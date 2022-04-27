<template>
  <div class="cluster-wrapper">
    <div class="card shadow-2" :class="status">
      <h3 class="cluster-header">
        Cluster {{ id }}
      </h3>
      <hr>
      <div class="cluster-stats">
        <span class="label">Status</span>
        <code>{{ status }}</code>
        <span class="label">Guilds</span>
        <code>{{ guilds }}</code>
        <span class="label">Memory</span>
        <code>{{ formatMemory(rss) }}</code>
        <span class="label">User CPU</span>
        <code>{{ formatPercent(userCpu) }}</code>
        <span class="label">System CPU</span>
        <code>{{ formatPercent(systemCpu) }}</code>
        <span class="label">Uptime</span>
        <code>{{ formatDuration(readyTime, time) }}</code>
        <span class="label">Last update</span>
        <code>{{ formatTime(time) }}</code>
        <span class="label">Shards</span>
        <code>{{ shardCount }}</code>
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
      ...this.cluster,
      status: 'ready',
      updater: setInterval(() => this.tick(), 1000)
    }
  },
  watch: {
    cluster(newValue) {
      Object.assign(this, newValue)
      this.status = 'ready'
    }
  },
  destroyed() {
    clearInterval(this.updater)
  },
  methods: {
    tick() {
      if (Date.now() - this.time > 60000) {
        this.rss = NaN
        this.userCpu = NaN
        this.systemCpu = NaN
        this.readyTime = NaN
        this.status = 'unknown'
      }
    },
    formatPercent(value) {
      if (isNaN(value) || typeof value !== 'number') {
        return '--'
      }
      return (Math.round(value * 100) / 100).toFixed(2) + '%'
    },
    formatMemory(value) {
      if (isNaN(value) || typeof value !== 'number') {
        return '--'
      }
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      const i = Math.floor(Math.log(value) / Math.log(1024))
      return (
        (Math.round((value * 100) / Math.pow(1024, i)) / 100).toFixed(2) +
        sizes[i]
      )
    },
    formatDuration(from, to) {
      if (
        isNaN(from) ||
        typeof from !== 'number' ||
        isNaN(to) ||
        typeof to !== 'number'
      ) {
        return '--'
      }
      const duration = dayjs.duration(to - from, 'ms')
      const hoursStr = duration
        .hours()
        .toString()
        .padStart(2, '0')
      return `${hoursStr}:${duration.format('mm:ss')}`
    },
    formatTime(value) {
      if (isNaN(value) || typeof value !== 'number') {
        return '--'
      }
      return dayjs(value, 'ms').format('HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/_variables";

.cluster-wrapper {
  > .card {
    border-top: 3px solid nth(map-get($colors, "danger"), 2);

    &.ready {
      border-top-color: nth(map-get($colors, "ok"), 1);
    }

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
  }
}
</style>
