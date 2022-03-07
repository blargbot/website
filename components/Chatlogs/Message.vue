<template>
  <div ref="message" class="message" :class="'type-' + message.type">
    <div class="badge-bar">
      <div class="badge">
        ACTION: {{ formattedType }}
      </div>
      <div class="badge">
        ID: {{ message.userid }}
      </div>
      <div class="badge">
        MSG ID: {{ message.msgid }}
      </div>
    </div>
    <div class="message-wrapper">
      <img class="avatar" :src="user.avatarURL">
      <div class="message-content">
        <div class="header">
          <span class="username">{{ user.username }}#{{ user.discriminator }}</span>
          <span class="timestamp">{{ formattedTimestamp }}</span>
        </div>
        <div class="content" v-html="sanitized" />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    message: {
      type: Object,
      default: () => ({})
    },
    userCache: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    user () {
      return this.userCache[this.message.userid]
    },
    formattedTimestamp () {
      const time = dayjs(this.message.msgtime)

      return time.format('YYYY/MM/DD hh:mm:ss A')
    },
    formattedType () {
      switch (this.message.type) {
        case 0: return 'Create'
        case 1: return 'Update'
        case 2: return 'Delete'
        default: return 'Unknown'
      }
    },
    sanitized () {
      return this.$sanitize(this.message.content)
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.message {
  padding: 15px;
  position: relative;

  // update
  &.type-1 {
    background: #593864;
  }

  // delete
  &.type-2 {
    background: #7e3f3f;
  }

  .badge-bar {
    display: flex;

    .badge {
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 0.5rem;

      &:not(:last-child) {
        margin-right: 0.5rem;
      }
    }
  }

  .message-wrapper {
    display: flex;
    margin-top: 0.5rem;
  }

  .avatar {
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    border-radius: 1000px;
    margin-right: 0.5rem;
  }

  .message-content {
    flex: 1 1 auto;

    .header {
      display: flex;
      justify-content: space-between;
      // margin-bottom: 0.5rem;

      .username {
        font-size: 1.2em;
      }

      .timestamp {
        font-size: 0.9em;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .content {
      white-space: pre-wrap;
      line-height: 1.375em;
    }
  }
}
</style>
