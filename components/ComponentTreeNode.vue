<template>
  <component :is="component" v-bind="props">
    <template v-for="[name, nodes] in Object.entries(slots)" :slot="name">
      <template v-for="(node, i) in nodes">
        <component-tree-node :key="`${name}_${i}`" :component="node.component" :slots="node.slots" :props="node.props" />
      </template>
    </template>
  </component>
</template>

<script>
export default {
  name: 'ComponentTreeNode',
  props: {
    component: {
      type: Function,
      required: true
    },
    slots: {
      type: Object,
      default: () => ({})
    },
    props: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
