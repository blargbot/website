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
    <item-list :items="listItems">
      <template #title-bar="{ value }">
        <h2 class="title">
          {{ value.name }}
          <template v-if="value.aliases.length > 0">
            ({{ value.aliases.join(', ') }})
          </template>
        </h2>

        <div class="badges">
          <span v-if="value.deprecated" class="badge warning">Deprecated</span>
          <span class="badge">{{ (categories[value.category] || {}).name }}</span>
          <span v-twemoji class="badge copy" title="Copy URL" @click.prevent="copyUrl(value, $event)">
            🔗
          </span>
        </div>
        <div :id="value.name" class="anchor" />
      </template>

      <template #default="{ value }">
        <div v-if="value.deprecated" class="deprecated-message">
          This subtag has been deprecated and will be removed in the future.<br>
          <span v-if="typeof value.deprecated === 'string'">
            Use the
            <router-link :to="`#${value.deprecated}`">
              <code>{{ "{" + value.deprecated + "}" }}</code>
            </router-link>
            subtag instead.
          </span>
        </div>

        <markdown v-if="value.description" :content="value.description" :auto-new-lines="true" />

        <div v-for="signature, i of getSignatures(value)" :key="i" class="subtag-signature">
          <h3>
            <div v-twemoji class="v-aligned gap">
              ℹ️ <pre><code>{{ renderParameters(value, signature) }}</code></pre>
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

export default {
  computed: {
    subtags() {
      return this.$store.state.subtags.list
    },
    categories() {
      return this.$store.state.subtags.categories
    },
    listItems() {
      const groups = {}
      for (const subtag of this.subtags) {
        const group = groups[subtag.category] ?? (groups[subtag.category] = [])
        group.push(subtag)
      }

      return Object.entries(groups)
        .sort((a, b) => a[0] - b[0])
        .map(([category, subtags]) => [
          this.categories[category] ?? category,
          subtags
        ])
        .map(([category, subtags]) => ({
          name: `${category.name} Subtags`,
          description: category.desc,
          items: subtags.map(subtag => ({
            name: subtag.name,
            value: subtag,
            tags: [subtag.name, category.name, ...subtag.aliases]
          }))
        }))
    }
  },
  methods: {
    copyUrl(item, event) {
      event.stopPropagation()
      this.$router.push(`#${item.name}`)
      window.navigator.clipboard.writeText(window.location.href)
    },
    renderMarkup(...args) {
      return render(...args)
    },
    getSignatures(item) {
      return item.signatures.filter(s => !s.hidden)
    },
    renderFlags(item) {
      const out = []
      for (const flag of item.flags) {
        out.push(`\`-${flag.flag}\`/\`--${flag.word}\`: ${flag.description}`)
      }

      return out.join('  \n')
    },
    renderParameters(item, signature) {
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
    stringifyParameter(parameter) {
      if ('nested' in parameter) {
        if (parameter.nested.length === 1) {
          return this.stringifyParameter(parameter.nested[0]) + '...'
        }
        return `(${parameter.nested.map(this.stringifyParameter).join(';')})...`
      }
      return parameter.required ? `<${parameter.name}>` : `[${parameter.name}]`
    },
    renderParameterAttributes(parameters) {
      return parameters
        .map(p => p.nested || [p])
        .flat()
        .map(param => this.getPrarameterModifiers(param))
        .filter(modifiers => modifiers !== undefined)
        .join('  \n')
    },
    getPrarameterModifiers(parameter) {
      const modifiers = []
      if (parameter.maxLength !== 1000000) {
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
    smartJoin(values, separator, lastSeparator) {
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
    renderParameterAttribute(parameter) {
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
.subtag-signature {
  margin: 1em 0;
}
.deprecated-message {
  margin-top: 1em;
}
</style>
