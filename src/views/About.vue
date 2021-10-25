<template>
  <div id="about">
    <div :class="{ loading }" class="flex-center" ref="about">
      <!-- @/assets/about-app/about-app.html -->
    </div>
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
    const container = this.$refs.about as HTMLElement;
    var html = await getAboutPage();
    if (!html) return;
    container.innerHTML = html;
    this.loading = false;
  },
  data() {
    return {
      loading: true,
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
