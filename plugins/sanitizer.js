import Vue from 'vue'

const sanitizeMap = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  ';': '&semi;'
}
const sanitizeRegex = new RegExp(`[${Object.keys(sanitizeMap).join('')}]`, 'g')

Vue.prototype.$sanitize = (message) => {
  return message.replace(sanitizeRegex, m => sanitizeMap[m])
}
