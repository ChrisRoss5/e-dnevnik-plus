<template>
  <div id="about">
    <iframe :class="{ loading }" ref="aboutFrame"></iframe>
    <Spinner :visible="loading"></Spinner>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAboutPage } from "@/scripts/scrapers";
import Spinner from "@/components/Spinner.vue";

export default defineComponent({
  name: "About",
  components: {
    Spinner,
  },
  async mounted() {
    const iframe = this.$refs.aboutFrame as HTMLIFrameElement;
    const cw = iframe.contentWindow!;
    var html = await getAboutPage();
    if (!html) return;
    cw.document.open();
    cw.document.write(html);
    cw.document.close();
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
#about,
iframe {
  width: 100%;
  height: 100%;
}

iframe {
  opacity: 1;
  transition: opacity $views-transition;
  width: $original-page-width;

  &.loading {
    opacity: 0;
  }
}
</style>
