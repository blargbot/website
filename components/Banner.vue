<template>
  <div class="parallax-container">
    <div class="parallax">
      <div class="image" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.parallax-container {
  height: 350px;
  // background: rgba(0, 0, 0, 0.4);
  width: 1500px;
  margin: 0 auto;
  overflow: hidden;
  background: #324149;
  border: 15px solid #324149;
  border-top: none;

  .parallax {
    height: 330px;
    border: 10px solid #232d33;
    border-top: none;
    overflow: hidden;

    .image {
      height: 426px;
      width: 1600px;
      background-image: url("~/assets/img/banner.png");
      background-attachment: fixed;
      background-position: top center;
      background-repeat: no-repeat;
    }
  }
}

@media screen and (max-width: 1550px) {
  .parallax-container {
    border-left: none;
    border-right: none;
    width: 100%;

    .parallax {
      border-left: none;
      border-right: none;
    }
  }
}
</style>
