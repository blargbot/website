<template>
  <div>
    <div>This is the Tag editor</div>
    <div>Current content is: {{ tagContent }}</div>
  </div>
</template>

<script>
export default {
  props: {
    tagContent: {
      type: String,
      default: null
    }
  }
}
</script>
