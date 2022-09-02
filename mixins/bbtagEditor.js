function sentenceCase(text) {
  return text.split(/(?<=(^|[.?!])[\s\n]+)(?=\w)/g) // Split by start of a sentence
    .map(str => `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`)
    .join('')
}

export default {
  data() {
    return {
      loading: false,
      lastLoad: null
    }
  },
  mounted() {
    this.lastLoad = null
  },
  methods: {
    checkLastLoad(action) {
      return this.lastLoad === this.name || confirm(
        `You are trying to ${action} the ${this.name} before you loaded it, are you sure?`
      )
    },
    async load() {
      await this.updateContent({
        action: {
          do: 'load',
          doing: 'loading',
          done: 'loaded'
        },
        isLoading: true,
        async request() {
          const tag = await this.$axios[this.loadMethod](this.endpoint)
          return tag.content ?? ''
        }
      })
    },
    async remove() {
      await this.updateContent({
        action: {
          do: 'delete',
          doing: 'saving',
          done: 'saved'
        },
        fallback: '',
        async request() {
          await this.$axios[this.deleteMethod](this.endpoint)
          return ''
        }
      })
    },
    async save() {
      await this.updateContent({
        action: {
          do: 'save',
          doing: 'saving',
          done: 'saved'
        },
        async request() {
          await this.$axios[this.saveMethod](this.endpoint, {
            content: this.value
          })
        }
      })
    },
    async updateContent(options) {
      if (this.loading) {
        return
      }
      if (!options.isLoading && !this.checkLastLoad(options.action.do)) {
        return
      }
      this.loading = true
      const loading = this.$toast.info(
        sentenceCase(`${options.action.doing} ${this.name}`),
        {
          icon: 'hourglass_empty'
        }
      )
      try {
        const content = await options.request.call(this)
        this.lastLoad = this.name
        this.$toast.success(
          sentenceCase(`${options.action.done} ${this.name}`),
          {
            icon: 'check'
          }
        )
        this.$emit('input', content ?? this.value)
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err
        }
        switch (err.response?.status) {
          case 404:
            this.$toast.error(
              sentenceCase(`${options.action.doing} ${this.name} failed because it does not exist`),
              {
                icon: 'error'
              }
            )
            this.$emit('input', options.fallback ?? this.value)
            break
          case 401:
            window.location.reload()
            break
          case 403:
            this.$toast.error(`You don't own ${this.name}`, {
              icon: 'error'
            })
            break
          default:
            this.$toast.error(`Unexpected error: ${err.message}`)
            break
        }
      } finally {
        if (!options.isLoading) {
          this.$emit('reload')
        }
        loading.goAway(0)
        this.loading = false
      }
    }
  }
}
