<template>
  <div>
    <section>
      <h1>Subtags</h1>
      <p>Not sure how to use BBTag? Check out the documentation:</p>

      <div class="button-grid">
        <nuxt-link to="/bbtag" class="child-2 button shadow-2">
          Documentation
        </nuxt-link>
      </div>
    </section>
    <item-list :items="subtags" item-label="Subtags" :categories="categories">
      <template #title-bar="{ item }">
        <h2 class="title">
          {{ item.name }}
          <template v-if="item.aliases.length > 0">
            ({{ item.aliases.join(', ') }})
          </template>
        </h2>

        <div class="badges">
          <span v-if="item.deprecated" class="badge warning">Deprecated</span>
          <span class="badge">{{ (categories[item.category] || {}).name }}</span>
          <div class="copy" title="Copy URL" @click.prevent="copyUrl(item, $event)">
            <emoji content="🔗" />
          </div>
        </div>
        <div :id="item.name" class="anchor" />
      </template>

      <template #default="{ item }">
        <div v-if="item.deprecated" class="deprecated-message">
          This subtag has been deprecated and will be removed in the future.<br>
          <span v-if="typeof item.deprecated === 'string'">
            Use the
            <router-link :to="`#${item.deprecated}`">
              <code>{{ "{" + item.deprecated + "}" }}</code>
            </router-link>
            subtag instead.
          </span>
        </div>

        <markdown v-if="item.description" :content="item.description" :auto-new-lines="true" />

        <!-- <template v-if="item.flags.length > 0">
          <h3>Flags:</h3>
          <markdown :content="renderFlags(item)" />
        </template> -->

        <div v-for="signature, i of getSignatures(item)" :key="i" class="subtag-signature">
          <h3>
            <div class="v-aligned">
              <emoji content="ℹ️ " />
              <pre><code>{{ renderParameters(item, signature) }}</code></pre>
            </div>
          </h3>
          <div class="quote">
            <markdown :content="renderParameterAttributes(signature.parameters)" />
          </div>
          <markdown :content="signature.description" :auto-new-lines="true" />
          <div class="examples">
            <div class="example">
              <h4>Example Code</h4>
              <pre><code>{{ signature.exampleCode }}</code></pre>
            </div>
            <div class="example">
              <h4>Example Output</h4>
              <pre><code>{{ signature.exampleOut }}</code></pre>
            </div>
          </div>
        </div>
      </template>
    </item-list>
  </div>
</template>

<script>
import { render } from '@bots-gg/markup'
import ItemList from '@/components/ItemList.vue'
import Emoji from '~/components/Emoji.vue'
import Markdown from '~/components/Markdown.vue'

export default {
  components: { Emoji, ItemList, Markdown },
  async asyncData ({ $axios }) {
    const subtags = await $axios.$get('/subtags')
    const apiCategories = await $axios.$get('/subtags/meta/categories')

    const list = Object.values(subtags)
    list.sort((a, b) => {
      return a.category - b.category
    })

    const categories = []
    for (const key in apiCategories) {
      categories[key] = apiCategories[key]
    }

    return {
      subtags: list,
      categories
    }
  },
  methods: {
    copyUrl (item, event) {
      event.stopPropagation()
      this.$router.push(`#${item.name}`)
      window.navigator.clipboard.writeText(window.location.href)
    },
    renderMarkup (...args) {
      return render(...args)
    },
    getSignatures (item) {
      return item.signatures.filter(s => !s.hidden)
    },
    renderFlags (item) {
      const out = []
      for (const flag of item.flags) {
        out.push(`\`-${flag.flag}\`/\`--${flag.word}\`: ${flag.description}`)
      }

      return out.join('  \n')
    },
    renderParameters (item, signature) {
      const out = []
      for (const param of signature.parameters) {
        out.push(this.stringifyParameter(param))
      }

      if (out.length > 0) {
        return `{${signature.subtagName || item.name};${out.join(';')}}`
      } else {
        return `{${signature.subtagName || item.name}}`
      }
    },
    renderParameter (parameter) {
      switch (parameter.kind) {
        case 'literal':
          return parameter.name
        case 'singleVar':
        case 'concatVar':
          if (parameter.required) {
            return `<${parameter.name}>`
          }
          return `[${parameter.name}]`
        case 'greedyVar':
          if (parameter.minLength === 0) {
            return `[...${parameter.name}]`
          }
          return `<...${parameter.name}>`
      }
    },
    stringifyParameter (parameter) {
      if ('nested' in parameter) {
        if (parameter.nested.length === 1) {
          return this.stringifyParameter(parameter.nested[0]) + '...'
        }
        return `(${parameter.nested.map(this.stringifyParameter).join(';')})...`
      }
      return parameter.required ? `<${parameter.name}>` : `[${parameter.name}]`
    },
    renderParameterAttributes (parameters) {
      return parameters
        .map(p => p.nested || [p])
        .flat()
        .map(param => this.getPrarameterModifiers(param))
        .filter(modifiers => modifiers !== undefined)
        .join('  \n')
    },
    getPrarameterModifiers (parameter) {
      const modifiers = []
      if (parameter.maxLength !== 1_000_000) {
        modifiers.push(`can at most be ${parameter.maxLength} characters long`)
      }
      if (parameter.defaultValue !== '') {
        modifiers.push(
          `defaults to \`${parameter.defaultValue}\` if ${
            parameter.required ? '' : 'omitted or'
          } left blank.`
        )
      }
      if (modifiers.length === 0) {
        return undefined
      }

      return `\`${parameter.name}\` ${this.smartJoin(
        modifiers,
        ', ',
        ', and '
      )}`
    },
    smartJoin (values, separator, lastSeparator) {
      switch (values.length) {
        case 0:
        case 1:
          return values.join(lastSeparator)
        default:
          return [
            values.slice(0, -1).join(separator),
            values.slice(-1)[0]
          ].join(lastSeparator)
      }
    },
    renderParameterAttribute (parameter) {
      switch (parameter.kind) {
        case 'literal':
          if (parameter.alias.length > 0) {
            return `\`${parameter.name}\` can be replaced with ${this.smartJoin(
              parameter.alias.map(a => `\`${a}\``),
              ', ',
              ' or '
            )}`
          }
          break
        case 'concatVar':
        case 'singleVar': {
          const result = []
          if (parameter.type.descriptionSingular !== undefined) {
            result.push(` should be ${parameter.type.descriptionSingular}`)
          }
          if (
            parameter.fallback !== undefined &&
            parameter.fallback.length > 0
          ) {
            result.push(`defaults to \`${parameter.fallback}\``)
          }
          if (result.length > 0) {
            return `\`${parameter.name}\` ${result.join(' and ')}`
          }
          break
        }
        case 'greedyVar': {
          const result = []
          if (parameter.minLength > 1) {
            result.push(`${parameter.minLength} or more`)
          }
          if (parameter.type.descriptionPlural !== undefined) {
            result.push(parameter.type.descriptionPlural)
          }
          if (result.length > 0) {
            return `\`${parameter.name}\` are ${result.join(' ')}`
          }
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.invite-grid {
  display: grid;
  grid-template-columns: 40% 60%;
  align-content: center;
  align-items: center;

  p {
    margin: 10px;
  }
}
.subtag-signature {
  margin: 1em 0;
}
.deprecated-message {
  margin-top: 1em;
}
</style>
