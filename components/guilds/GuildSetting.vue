<template>
  <div class="card">
    <h3>
      <div class="v-aligned">
        <emoji content="ℹ️ " />{{ setting.name }} (<code>{{ setting.key }}</code>)
      </div>
    </h3>
    <p>{{ setting.desc }}</p>
    <p>
      <template v-for="example in examplesFor(setting.type)">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <pre :key="example" class="example"><code>b!settings set {{ setting.key }} <span v-html="example" /></code></pre>
      </template>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    setting: {
      type: Object,
      required: true
    }
  },
  methods: {
    examplesFor(type) {
      switch (type) {
        case 'bool':
          return ['true', 'false']
        case 'string':
          return ['This can be any text!']
        case 'channel':
          return [
            '<span class="mention">#my-channel</span>',
            'my-channel',
            '89309487534573345'
          ]
        case 'role':
          return [
            '<span class="mention colored" style="--red: 255; --green: 0; --blue: 0;">@Some Role</span>',
            '"Some Role"',
            '49387539584735734'
          ]
        case 'permission':
          return ['3297482349', '0', '8250']
        case 'float':
          return ['12.3', '0', '99']
        case 'int':
          return ['96', '0', '793']
        default:
          return [type]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.example {
  margin-top: 5px;
}
</style>
