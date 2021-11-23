<template>
  <div id="about">
    <!-- @/assets/about-app/about-app.html -->
    <div :class="{ loading }" class="flex-center" v-html="content"></div>
    <Spinner :visible="loading"></Spinner>
  </div>
</template>

<script lang="ts">
import Spinner from "@/components/Spinner.vue";
import { getAboutPage } from "@/scripts/scrapers/scrapers";
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  components: {
    Spinner,
  },
  async mounted() {
    const html = await getAboutPage();
    if (!html) return;
    this.content = html;
    this.loading = false;
    if (!chrome.storage) return;
    chrome.storage.sync.remove("newUpdates");
  },
  data() {
    return {
      loading: true,
      content: "",
    };
  },
});
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  height: 100%;
}

div {
  opacity: 1;
  transition: opacity $views-transition;

  &.loading {
    opacity: 0;
  }
}
</style>
