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
  mounted() {
    const path = localStorage.getItem("path");
    if (path) {
      localStorage.removeItem("path");
      this.$router.replace(path);
    }
    let prevent = false;
    let scrollTop = document.body.scrollTop;
    document.body.addEventListener("scroll", (e) => {
      if (prevent) e.preventDefault();
      if (this.$route.path != "/") return;
      if (scrollTop == 0) {
        this.scroll(
          document.body.scrollTop +
            document.querySelector("#tour")!.getBoundingClientRect().top,
          500,
        );
      }
      scrollTop = document.body.scrollTop;
    });
  },
  methods: {
    scroll(elementY: number, duration: number) {
      var startingY = document.body.scrollTop;
      var diff = elementY - startingY;
      var start = 0;
      window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        var time = timestamp - start;
        var percent = Math.min(time / duration, 1);
        document.body.scrollTo(0, startingY + diff * percent);
        if (time < duration) {
          window.requestAnimationFrame(step);
        }
      });
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
