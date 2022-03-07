<template>
  <section class="full">
    <div class="card min">
      <div class="card-title">
        <h1 class="center">
          Logs from {{ guildName }}
        </h1>
      </div>
      <div class="card-contents">
        <div class="log-legend">
          <span class="key">Channel:</span>
          <span class="value">{{ channelName }} ({{ channel }})</span>
          <template v-if="users.length > 0">
            <span class="key">Users:</span>
            <span class="value">{{ users.join(', ') }}</span>
          </template>
          <span class="key">Message Types:</span>
          <span class="value">{{ formattedTypes }}</span>
          <span class="key">Message Count:</span>
          <span class="value">{{ messages.length }}</span>
        </div>
        <p class="center">
          Click on a mention to copy the user's ID.
        </p>
      </div>
    </div>

    <div class="card edgeless">
      <div class="card-title">
        <h2 class="center">
          Messages
        </h2>
      </div>
      <div class="card-contents">
        <div class="message-wrapper">
          <message v-for="message in messages" :key="message.id" :message="message" :user-cache="userCache" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Message from '@/components/Chatlogs/Message.vue'

export default {
  components: { Message },
  async asyncData ({ params, $axios }) {
    const logs = await $axios.$get('/chatlogs/' + params.id)
    logs.messages.sort((a, b) => {
      return new Date(a.msgtime) - new Date(b.msgtime)
    })

    console.log(logs)

    return {
      channel: logs.channel,
      channelName: logs.channelName,
      guildName: logs.guildName,
      keycode: logs.keycode,
      limit: logs.limit,
      messages: logs.messages,
      types: logs.types,
      users: logs.users,
      userCache: logs.parsedUsers
    }
  },
  data () {
    return {
      typeMap: ['create', 'update', 'delete']
    }
  },
  computed: {
    formattedTypes () {
      if (this.types.length === 0) {
        return 'create, update, delete'
      } else {
        return this.types.map(t => this.typeMap[t]).join(', ')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.log-legend {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.5rem;

  .key {
    text-align: right;
  }
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.card.edgeless {
  padding-left: 0;
  padding-right: 0;
}

.card.min {
  margin-bottom: 0.5rem;

}

.message:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
