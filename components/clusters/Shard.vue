<template>
  <div class="shard-wrapper">
    <div class="card shadow-2" :class="status">
      <h3 class="shard-header">
        Shard {{ id }}
      </h3>
      <hr>
      <div class="shard-stats">
        <span class="label">Status</span>
        <code>{{ status }}</code>
        <span class="label">Guilds</span>
        <code>{{ guilds }}</code>
        <span class="label">Latency</span>
        <code>{{ formatMs(latency) }}</code>
        <span class="label">Last update</span>
        <code>{{ formatTime(time) }}</code>
        <span class="label">Cluster</span>
        <code>{{ cluster }}</code>
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
    shard: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ...this.shard,
      updater: setInterval(() => this.tick(), 1000)
    }
  },
  watch: {
    shard(newValue) {
      Object.assign(this, newValue)
    }
  },
  destroyed() {
    clearInterval(this.updater)
  },
  methods: {
    tick() {
      if (Date.now() - this.time > 60000) {
        this.status = 'unknown'
        this.latency = NaN
      }
    },
    formatTime(value) {
      if (isNaN(value) || typeof value !== 'number') {
        return '--'
      }
      return dayjs(value, 'ms').format('HH:mm:ss')
    },
    formatMs(value) {
      if (isNaN(value) || typeof value !== 'number') {
        return '--'
      }
      return `${value} ms`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/_variables";

.shard-wrapper {
  > .card {
    border-top: 3px solid nth(map-get($colors, "danger"), 2);
    &.connecting {
      border-top-color: nth(map-get($colors, "gold"), 2);
    }
    &.disconnected {
      border-top-color: nth(map-get($colors, "warning"), 1);
    }
    &.handshaking {
      border-top-color: nth(map-get($colors, "gold"), 2);
    }
    &.identifying {
      border-top-color: nth(map-get($colors, "gold"), 2);
    }
    &.ready {
      border-top-color: nth(map-get($colors, "ok"), 1);
    }
    &.resuming {
      border-top-color: nth(map-get($colors, "gold"), 2);
    }

    .shard-header {
      text-align: center;
      text-transform: uppercase;
    }
    .shard-stats {
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
