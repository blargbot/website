<template>
  <div class="embed">
    <div class="embed-color-pill" :style="{ background: toRgba(embed.color) }" />
    <div class="embed-wrapper">
      <div class="embed-content">
        <div class="embed-content-inner">
          <div v-if="embed.author && embed.author.name" class="embed-author">
            <img v-if="embed.author.icon_url" :src="embed.author.icon_url" role="presentation" class="embed-author-icon">
            <a v-if="embed.author.url" :href="embed.author.url" class="embed-author-name">{{ embed.author.name }}</a>
            <span v-else class="embed-author-name">{{ embed.author.name }}</span>
          </div>
          <template v-if="embed.title">
            <a v-if="embed.url" :href="embed.url" class="embed-title"><rich-text :content="embed.title" :context="context" :features="messageFeatures" /></a>
            <div v-else :href="embed.url" class="embed-title">
              <rich-text :content="embed.title" :context="context" :features="messageFeatures" />
            </div>
          </template>
          <div v-if="embed.description" class="embed-description markup">
            <rich-text :content="embed.description" :context="context" />
          </div>
          <div v-if="embed.fields && embed.fields.length" class="embed-fields">
            <div v-for="(field, i) in embed.fields" :key="i" class="embed-field" :class="{ 'embed-field-inline': field.inline }">
              <div class="embed-field-name">
                <rich-text :content="field.name" :context="context" :features="messageFeatures" />
              </div>
              <div class="embed-field-value markup">
                <rich-text :content="field.value" :context="context" />
              </div>
            </div>
          </div>
        </div>
        <img
          v-if="embed.thumbnail && embed.thumbnail.url"
          :src="embed.thumbnail.url"
          role="presentation"
          class="embed-thumbnail"
          width="80"
          height="80"
        >
      </div>
      <span v-if="embed.image && embed.image.url" class="embed-image"><img class="image" role="presentation" :src="embed.image.url"></span>
      <template v-if="footerText">
        <div>
          <img
            v-if="embed.footer && embed.footer.icon_url"
            :src="embed.footer.icon_url"
            class="embed-footer-icon"
            role="presentation"
            width="20"
            height="20"
          >
          <span class="embed-footer">{{ footerText }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import RichText, { messageFeatures } from '../richText/Index.vue'

dayjs.extend(advancedFormat)

export default {
  components: { RichText },
  props: {
    embed: {
      type: Object,
      required: true
    },
    context: {
      type: Object,
      default: null
    }
  },
  data() {
    return { messageFeatures }
  },
  computed: {
    footerText() {
      const time = dayjs(this.embed.timestamp)
      const timeText = time.isValid()
        ? time.format('ddd MMM Do, YYYY [at] h:mm A')
        : null

      return [this.embed.footer?.text, timeText].filter(v => !!v).join(' | ')
    }
  },
  methods: {
    toRgba(color) {
      if (!color) {
        return undefined
      }

      const r = color >> 16
      const g = (color >> 8) & 255
      const b = color & 255
      return `rgba(${r},${g},${b},1)`
    }
  }
}
</script>

<style lang="scss" scoped>
$background: rgba(46, 48, 54, 0.3);

@mixin display-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

@mixin font-text {
  font-size: 14px;
  font-weight: 500;
  color: hsla(0, 0%, 100%, 0.8);
  display: block;
}

@mixin font-footer {
  font-size: 12px;
  font-weight: 600;
  color: hsla(0, 0%, 100%, 0.8);
  display: inline-block;
}

@mixin font-title {
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  &:not(a) {
    color: #fff;
  }
}

.embed {
  @include display-flex;
  position: relative;
  margin-top: 5px;
  max-width: 520px;
  > :last-child {
    margin-bottom: 0 !important;
  }
  .embed-color-pill {
    background-color: #4f545c;
    width: 4px;
    border-radius: 3px 0 0 3px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }
  .embed-wrapper {
    @include display-flex;
    position: relative;
    background-color: $background;
    border-color: $background;
    padding: 8px 10px;
    box-sizing: border-box;
    border-radius: 0 3px 3px 0;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    .embed-content {
      @include display-flex;
      width: 100%;
      margin-bottom: 10px;
      .embed-content-inner {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        .embed-author {
          @include display-flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          margin-bottom: 5px;
          .embed-author-name {
            @include font-title;
          }
          .embed-author-icon {
            margin-right: 9px;
            width: 20px;
            height: 20px;
            -o-object-fit: contain;
            object-fit: contain;
            border-radius: 50%;
          }
        }
        .embed-title {
          @include font-title;
          margin-bottom: 4px;
        }
        .embed-description {
          @include font-text;
          margin-bottom: 10px;
          white-space: pre-line;
          margin-top: 0 !important;
          pre {
            max-width: 100% !important;
          }
        }
        .embed-fields {
          @include display-flex;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          -ms-flex-direction: row;
          flex-direction: row;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          margin-top: -10px;
          margin-bottom: 10px;
          .embed-field {
            -webkit-box-flex: 0;
            -ms-flex: 0;
            flex: 0;
            padding-top: 10px;
            min-width: 100%;
            max-width: 506px;
            &.embed-field-inline {
              -webkit-box-flex: 1;
              -ms-flex: 1;
              flex: 1;
              min-width: 150px;
              -ms-flex-preferred-size: auto;
              flex-basis: auto;
            }
            .embed-field-name {
              @include font-title;
              margin-bottom: 4px;
            }
            .embed-field-value {
              @include font-text;
            }
          }
        }
      }
      .embed-thumbnail {
        max-height: 80px;
        max-width: 80px;
        border-radius: 3px;
        width: auto;
        -o-object-fit: contain;
        object-fit: contain;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        margin-left: 20px;
      }
      &:last-child {
        margin-bottom: 0 !important;
      }
    }
    .embed-image {
      position: relative;
      display: inline-block;
      margin-bottom: 10px;
    }
    .embed-footer {
      @include font-footer;
    }
    .embed-footer-icon {
      margin-right: 10px;
      height: 18px;
      width: 18px;
      -o-object-fit: contain;
      object-fit: contain;
      float: left;
      border-radius: 50%;
    }
    .image {
      @include display-flex;
      position: relative;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
      overflow: hidden;
      border-radius: 2px;
    }
  }
}
</style>
