<template>
  <div class="mask flex-center">
    <div class="container">
      <div class="close flex-center" @click="$emit('close')">
        <img src="@/assets/img/close.svg" />
      </div>
      <a :href="ad.url" target="_blank">
        <img class="ad" :src="ad.images.popup" alt="Oglas" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Ad } from "@/store/state";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "PopupAd",
  props: {
    ad: {
      type: Object as PropType<Ad>,
      required: true,
    },
  },
  emits: ["close"],
  mounted() {
    document.addEventListener(
      "keydown",
      (e) => e.key == "Escape" && this.$emit("close"),
    );
  },
});
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999999;
}
.container {
  position: relative;
  width: 900px;
  height: 600px;
  max-height: 100vh;
}
.close {
  position: absolute;
  right: 0;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  img {
    height: 20px;
    transition: transform 150ms;
  }
  &:hover {
    cursor: pointer;
    img {
      transform: scale(0.75);
    }
  }
}
.ad {
  width: 100%;
}
</style>
