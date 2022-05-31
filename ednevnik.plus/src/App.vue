<template>
  <Wrapper></Wrapper>
  <Previews v-if="$route.path == '/'"></Previews>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Wrapper from "./components/Wrapper.vue";
import Previews from "./components/Previews.vue";

export default defineComponent({
  name: "App",
  components: { Wrapper, Previews },
  data() {
    return {
      scrolling: false
    };
  },
  mounted() {
    const path = localStorage.getItem("path");
    if (path) {
      localStorage.removeItem("path");
      this.$router.replace(path);
    }
    document.body.addEventListener("wheel", (e) => {
      if (this.$route.path != "/" || this.scrolling) return;
      if (document.body.scrollTop == 0 && e.deltaY > 0) {
        this.scroll(
          document.querySelector("#tour")!.getBoundingClientRect().top,
          250,
        );
      } else if (e.deltaY < 0) {
        this.scroll(-document.body.scrollTop, 250);
      }
    });
  },
  methods: {
    /* https://stackoverflow.com/a/44484186/10264782 */
    scroll(distance: number, duration: number) {
      var initialY = document.body.scrollTop;
      var y = initialY + distance;
      var baseY = (initialY + y) * 0.5;
      var difference = initialY - baseY;
      var startTime = performance.now();
      this.scrolling = true;
      const stop = () => this.scrolling = false;

      function step() {
        var normalizedTime = (performance.now() - startTime) / duration;
        if (normalizedTime > 1) normalizedTime = 1;
        document.body.scrollTo(
          0,
          baseY + difference * Math.cos(normalizedTime * Math.PI),
        );
        if (normalizedTime < 1) window.requestAnimationFrame(step);
        else stop();
      }
      window.requestAnimationFrame(step);
    },
  },
});
</script>

<style lang="scss">
#app {
  & > div {
    min-height: 100vh;
  }
}

/* transitions */

.previews-enter-active,
.previews-leave-active {
  transition: opacity 250ms;
}

.previews-enter-from,
.previews-leave-to {
  opacity: 0;
  width: 0;
}
</style>
