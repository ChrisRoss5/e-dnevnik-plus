<template>
  <div id="about">
    e-Dnevnik Plus v5.0
    <iframe ref="aboutFrame"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAboutPage } from "@/scripts/scrapers";

export default defineComponent({
  name: "About",
  async mounted() {
    const iframe = this.$refs.aboutFrame as HTMLIFrameElement;
    const cw = iframe.contentWindow!;
    var html = await getAboutPage();
    if (!html) return;
    cw.document.open();
    cw.document.write(html);
    cw.document.close();
    iframe.style.opacity = "1";
  },
});
</script>

<style lang="scss" scoped>
#about {
  min-height: 100%;
  display: grid;
  place-items: center;
}

iframe {
  opacity: 0;
  transition: opacity 150ms;
}
</style>
