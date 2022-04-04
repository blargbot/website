<template>
  <div class="body-wrapper">
    <Header :built-in-sidebar="true" />
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
.fill {
  flex: 1;
}

main {
  display: flex;
  align-items: stretch;
}
</style>
