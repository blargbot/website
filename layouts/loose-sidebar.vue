<template>
  <div class="body-wrapper">
    <Header />
    <main class="fill">
      <div class="body-wrapper">
        <nuxt class="fill" />
      </div>
    </main>
    <Footer />
    <Sidebar />
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
.body-wrapper > .fill {
  flex: 1;
}
</style>
