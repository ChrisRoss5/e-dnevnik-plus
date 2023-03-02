<template>
  <a
    v-for="ad in ads"
    :href="ad.url"
    target="_blank"
    class="ad-banner"
    :key="ad.id"
    @click="adClicked(ad)"
  >
    <img :src="ad.images.banner" alt="Oglas" />
    <transition name="opacity">
      <img
        v-if="navCollapsed"
        class="ad-logo abs-cover"
        :src="ad.images.logo"
        alt="Oglas"
      />
    </transition>
  </a>
</template>

<script lang="ts">
import { Ad } from "@/store/state";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "NavbarAds",
  props: {
    ads: {
      type: Array as PropType<Ad[]>,
      required: true,
    },
    navCollapsed: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    adClicked(ad: Ad) {
      window.gtag("event", "ad", {
        event_category: "banner",
        event_label: ad.id,
        value: "clicked",
      });
    },
  },
});
</script>

<style lang="scss">
.ad-banner {
  position: relative;
  padding: 0 !important;
  width: 285px !important;
  height: 100px !important;
  img {
    width: 100%;
    height: 100%;
  }
}
.nav-collapsed .ad-banner {
  width: 100% !important;
}
</style>
