<template>
  <div class="embed">
    <div class="embed-color-pill" :style="{ background: toRgba(embed.color) }" />
    <div class="embed-wrapper">
      <div class="embed-content">
        <div class="embed-content-inner">
          <div v-if="embed.author && embed.author.name" class="embed-author">
            <img v-if="embed.author.proxy_icon_url" :src="embed.author.proxy_icon_url" role="presentation" class="embed-author-icon">
            <a v-if="embed.author.url" :href="embed.author.url" class="embed-author-name">{{ embed.author.name }}</a>
            <span v-else class="embed-author-name">{{ embed.author.name }}</span>
          </div>
          <template v-if="embed.title">
            <a v-if="embed.url" :href="embed.url" class="embed-title"><rich-text :content="embed.title" :context="context" :disable="['link', 'autolink', 'url']" /></a>
            <div v-else :href="embed.url" class="embed-title">
              <rich-text :content="embed.title" :context="context" :disable="['link', 'autolink', 'url']" />
            </div>
          </template>
          <div v-if="embed.description" class="embed-description markup">
            <rich-text :content="embed.description" :context="context" />
          </div>
          <div v-if="embed.fields && embed.fields.length" class="embed-fields">
            <div v-for="(field, i) in embed.fields" :key="i" class="embed-field" :class="{ 'embed-field-inline': field.inline }">
              <div class="embed-field-name">
                <rich-text :content="field.name" :context="context" :disable="['link']" />
              </div>
              <div class="embed-field-value markup">
                <rich-text :content="field.value" :context="context" />
              </div>
            </div>
          </div>
        </div>
        <img
          v-if="embed.thumbnail && embed.thumbnail.proxy_url && embed.type !== 'article'"
          :src="embed.thumbnail.proxy_url"
          role="presentation"
          class="embed-thumbnail"
          width="80"
          height="80"
        >
      </div>
      <span v-if="embed.image && embed.image.proxy_url" class="embed-image">
        <img class="image" role="presentation" :src="embed.image.proxy_url">
      </span>
      <span v-if="embed.type === 'article' && embed.thumbnail && embed.thumbnail.proxy_url" class="embed-image">
        <img class="image" role="presentation" :src="embed.thumbnail.proxy_url">
      </span>
      <template v-if="footerText">
        <div>
          <img
            v-if="embed.footer && embed.footer.proxy_icon_url"
            :src="embed.footer.proxy_icon_url"
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
import RichText from '../richText/Index.vue'

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
  computed: {
    footerText() {
      const parts = [this.embed.footer?.text]
      if (this.embed.timestamp) {
        const time = dayjs(this.embed.timestamp)
        const timeText = time.isValid()
          ? time.format('ddd MMM Do, YYYY [at] h:mm A')
          : null
        parts.push(timeText)
      }

      return parts.filter(v => !!v).join(' | ')
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
@import "../../assets/scss/_text";

$background: rgba(46, 48, 54, 0.3);
$gutter: 5px;

@mixin display-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

@mixin title {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: $gutter;
}

@mixin text {
  color: hsla(0, 0%, 100%, 0.8);
  font-size: 14px;
  font-weight: 500;
  display: block;
}

@mixin footer {
  color: hsla(0, 0%, 100%, 0.8);
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.embed {
  @include display-flex;
  position: relative;
  margin-top: $gutter;
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
    padding: $gutter * 2;
    box-sizing: border-box;
    border-radius: 0 3px 3px 0;
    -ms-flex-direction: column;
    flex-direction: column;
    .embed-content {
      @include display-flex;
      width: 100%;
      margin-bottom: $gutter * 2;
      .embed-content-inner {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        .embed-author {
          @include display-flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          margin-bottom: $gutter;
          .embed-author-name {
            @include title;
            margin-bottom: 0;
          }
          .embed-author-icon {
            margin-right: $gutter * 2;
            width: $gutter * 4;
            height: $gutter * 4;
            -o-object-fit: contain;
            object-fit: contain;
            border-radius: 50%;
          }
        }
        .embed-title {
          @include title;
        }
        a.embed-title {
          @include link;
        }
        .embed-description {
          @include text;
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
          margin-bottom: $gutter * 2;
          .embed-field {
            -webkit-box-flex: 0;
            -ms-flex: 0;
            flex: 0;
            padding-top: $gutter * 2;
            min-width: 100%;
            max-width: 506px;
            &:first-child {
              padding-top: 0;
            }
            &.embed-field-inline {
              -webkit-box-flex: 1;
              -ms-flex: 1;
              flex: 1;
              min-width: 150px;
              -ms-flex-preferred-size: auto;
              flex-basis: auto;
            }
            .embed-field-name {
              @include title;
            }
            .embed-field-value {
              @include text;
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
        margin-left: $gutter * 4;
      }
    }
    .embed-image {
      position: relative;
      display: inline-block;
      margin-bottom: $gutter * 2;
    }
    .embed-footer {
      @include footer;
    }
    .embed-footer-icon {
      margin-right: $gutter * 2;
      height: $gutter * 4;
      width: $gutter * 4;
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
      max-width: 100%;
    }
  }
}
</style>
