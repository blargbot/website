import Vue from 'vue'
import twemoji from 'twemoji'

Vue.prototype.$sanitize = (message) => {
  const cleansed = message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/;/g, '&semi;')

  const emojified = twemoji.parse(cleansed)

  return emojified
}
