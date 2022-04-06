<template>
  <section>
    <div class="stats">
      <h1 class="stats-header">
        Clusters
      </h1>
      <div class="stats-body">
        <template v-for="(cluster, i) in clusters">
          <cluster :key="`cluster_${i}`" :cluster="cluster" class="stats-item" />
        </template>
      </div>
    </div>
    <div class="stats">
      <h1 class="stats-header">
        Shards
      </h1>
      <div class="stats-body">
        <template v-for="(shard, i) in shards">
          <shard :key="`shard_${i}`" :shard="shard" class="stats-item" />
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import Cluster from '~/components/clusters/Cluster.vue'
import Shard from '~/components/clusters/Shard.vue'

export default {
  components: { Cluster, Shard },
  data() {
    return {
      connection: null,
      clusterStats: {}
    }
  },
  computed: {
    clusters() {
      return Object.values(this.clusterStats).sort((a, b) => a.id - b.id)
    },
    shards() {
      return Object.values(this.clusterStats)
        .map(s => s.shards)
        .flat()
        .sort((a, b) => a.id - b.id)
    }
  },
  destroyed() {
    this.connection.onclose = undefined
    this.connection?.close()
  },
  mounted() {
    this.reconnect()
  },
  methods: {
    reconnect() {
      this.connection?.close()

      const scheme = window.location.porotocol === 'https' ? 'wss' : 'ws'
      this.connection = new WebSocket(
        `${scheme}://${window.location.host}${this.$axios.defaults.baseURL}clusters`
      )
      this.connection.onmessage = (msg) => {
        this.clusterStats = JSON.parse(msg.data)
      }
      this.connection.onclose = () => {
        setTimeout(() => this.reconnect(), 10000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.stats {
  align-items: center;

  .stats-header {
    text-align: center;
  }

  .stats-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .stats-item {
      min-width: 15rem;
      flex: 0;
    }
  }
}
</style>
