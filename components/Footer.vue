<template>
  <footer>
    <div class="footer-content">
      <nuxt-link to="/privacy">
        Privacy Policy
      </nuxt-link>
      &copy; 2016-2022 | stupid cat
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  z-index: 9999;
  padding: 20px;
  text-align: center;

  .footer-content {
    max-width: 780px;
    margin: 0 auto;
  }
}
</style>
