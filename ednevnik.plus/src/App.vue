<template>
  <Wrapper></Wrapper>
  <transition name="previews">
    <Previews v-if="showPreviews"></Previews>
  </transition>
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
      showPreviews: false,
    };
  },
  mounted() {
    const path = localStorage.getItem("path");
    if (path) {
      localStorage.removeItem("path");
      this.$router.replace(path);
    }
  },
  watch: {
    $route(to) {
      this.showPreviews = to.path == "/";
    },
  },
});
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
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
