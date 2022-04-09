import twemoji from 'twemoji'
import Vue from 'vue'

Vue.directive('twemoji', {
  inserted: (el) => {
    twemoji.parse(el)
  }
})
