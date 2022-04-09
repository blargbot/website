<template>
  <br>
</template>

<script>
import Vue from 'vue'

import { anyScopeRegex, defaultRules } from 'simple-markdown'

export const brRules = {
  /** @type {import('simple-markdown').ParserRule */
  br: {
    ...defaultRules.br,
    match: anyScopeRegex(/^\n/),
    vue() {
      return {
        component
      }
    }
  }
}

const component = Vue.extend({})
export default component
</script>
