<template>
  <div id="previews">
    <!-- <video src="@/assets/mp4/sorting.mp4" autoplay loop muted></video> -->
  </div>
</template>

<style lang="scss">
#previews {
  display: none;
  width: 400px;
  background: $plus-color;

  video {
    width: 100%;
  }
}

@media only screen and (max-width: 768px) {
  #previews {
    display: none;
  }
}
</style>