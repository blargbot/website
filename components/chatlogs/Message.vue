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
      <div class="message-body">
        <div class="header">
          <span class="username">{{ user.username }}#{{ user.discriminator }}</span>
          <discord-timestamp :value="message.msgtime" />
        </div>
        <rich-text class="message-content" :content="message.content" :context="richContext" :disable="['link']" />
      </div>
    </div>
    <div class="message-embeds">
      <discord-embed v-for="(embed, i) in message.embeds" :key="i" :embed="embed" :context="richContext" />
    </div>
    <div v-if="message.attachments && message.attachments.length">
      <hr>
      <div>Attachments</div>
      <ul class="message-attachments">
        <li v-for="(attachment, i) in message.attachments" :key="i" class="message-attachment">
          <a :href="attachment" target="_blank">{{ attachment.split('/').slice(-1)[0] }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import DiscordTimestamp from '../richText/DiscordTimestamp.vue'
import RichText from '../richText/Index.vue'
import DiscordEmbed from './DiscordEmbed.vue'

export default {
  components: { DiscordTimestamp, RichText, DiscordEmbed },
  props: {
    message: {
      type: Object,
      default: () => ({})
    },
    userCache: {
      type: Object,
      default: () => ({})
    },
    roleCache: {
      type: Object,
      default: () => ({})
    },
    channelCache: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    richContext() {
      return {
        userMap: this.userCache,
        roleMap: this.roleCache,
        channelMap: this.channelCache
      }
    },
    user() {
      return this.userCache[this.message.userid]
    },
    formattedTimestamp() {
      const time = dayjs(this.message.msgtime)

      return time.format('YYYY/MM/DD hh:mm:ss A')
    },
    formattedType() {
      switch (this.message.type) {
        case 0:
          return 'Create'
        case 1:
          return 'Update'
        case 2:
          return 'Delete'
        default:
          return 'Unknown'
      }
    }
  },
  mounted() {}
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

  .message-attachments {
    list-style-type: none;
    margin: 0;
    padding: 0;

    .message-attachment {
      display: inline-block;

      &:after {
        content: "|";
        padding: 0 3px;
      }

      &:last-child:after {
        content: "";
        padding: 0;
      }
    }
  }

  .message-body {
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

    .message-content {
      white-space: pre-wrap;
      line-height: 1.375em;
    }
  }
}
</style>
