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
    document.body.addEventListener("scroll", () => {
      if (this.$route.path != "/") return;
      if (document.body.scrollTop == 0)
        document
          .querySelector("#previews")!
          .scrollIntoView({ behavior: "smooth" });
    });
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
