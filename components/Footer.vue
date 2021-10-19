<template>
  <footer>
    <div class="footer-content">
      &copy; 2016-{{ year }} | stupid cat
    </div>
  </footer>
</template>

<script>

export default {
  computed: {
    year () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  padding: 20px;
  text-align: center;

  .footer-content {
    max-width: 780px;
    margin: 0 auto;
  }
}
</style>
