<template>
  <crud-editor route="tags" type="tag" />
</template>

<script>
import CrudEditor from './base/NamedEditor.vue'

export default {
  components: { CrudEditor },
  props: {
    value: {
      type: String,
      default: null
    }
  }
}
</script>
