<template>
  <div class="body-wrapper">
    <Header />
    <Sidebar />
    <main class="fill">
      <div class="body-wrapper">
        <nuxt class="fill" />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
export default {}
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
