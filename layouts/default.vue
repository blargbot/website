<template>
  <div class="body-wrapper">
    <Header :builtInSidebar="true" />
    <main class="fill">
      <Sidebar :built-in="true" />
      <div class="body-wrapper fill">
        <nuxt class="fill" />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Sidebar from '~/components/Sidebar.vue'
export default {
  components: { Header, Footer, Sidebar }
}
</script>

<style lang="scss" scoped>
.body-wrapper {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  min-height: 100%;
}
.fill {
  flex: 1;
}

main {
  display: flex;
  align-items: stretch;
}
</style>
