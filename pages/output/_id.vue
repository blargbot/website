<template>
  <section class="full">
    <div class="card min">
      <div class="output-content" v-html="content"/>
    </div>
  </section>
</template>

<script>
import xss from 'xss'

const whiteList = xss.whiteList
whiteList.marquee = ['behavior', 'direction', 'hspace', 'loop', 'scrollamount', 'scrolldelay', 'truespeed', 'vspace'] // Allow marquees
whiteList.style = [] // Allow style without attributes
whiteList.link = ['rel', 'href'] // Allow link tags for external CSS.

const customWhitelistedAttribs = ['class', 'id', 'style', 'title', 'data-tooltip']
// add custom attributes to all elements
for (const key in whiteList) {
  whiteList[key].push(...customWhitelistedAttribs)
}

export default {
  async asyncData ({ params, $axios }) {
    const dump = await $axios.$get('/outputs/' + params.id)

    console.log(dump)

    return {
      dump,
      content: xss(dump.content, { whiteList })
    }
  },
  data () {
    return {
      typeMap: ['create', 'update', 'delete']
    }
  }
}
</script>

<style lang="scss" scoped>
.log-legend {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.5rem;

  .key {
    text-align: right;
  }
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.card.edgeless {
  padding-left: 0;
  padding-right: 0;
}

.card.min {
  margin-bottom: 0.5rem;

}

.message:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
