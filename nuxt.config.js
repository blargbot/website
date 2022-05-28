import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import * as config from './config.json'

export default {
  server: {
    port: 8085
  },

  telemetry: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'blargbot',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
    ],
    script: [
      { src: 'https://twemoji.maxcdn.com/v/latest/twemoji.min.js', crossorigin: 'anonymous' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [{ src: '@/assets/scss/base.scss', type: 'scss' }],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/tokenStore',
    '~/plugins/sanitizer',
    '~/plugins/twemoji'
  ],

  router: {
    middleware: ['global']
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    prefix: '/api/',
    proxy: true
  },

  proxy: {
    '/api/': {
      target: config.apiOrigin || 'http://localhost:8086',
      pathRewrite: { '^/api/': '' }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: 'raw-loader'
        }
      )
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    },
    plugins: [
      new MonacoWebpackPlugin()
    ]
  },

  publicRuntimeConfig: {
    id: config.id,
    callback: config.callback
  },

  serverMiddleware: [
    '~/server-middleware/output-text',
    '~/server-middleware/json-chatlogs',
    '~/server-middleware/color-route'
  ]
}
