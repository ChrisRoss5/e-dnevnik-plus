<template>
  <!--     /* chrome.runtime.sendMessage({greeting: "hello"}, function(response: string) {
      console.log(response);
    }); */ -->
  <Navbar></Navbar>
  <Main></Main>
  <User></User>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
import Main from "@/components/Main.vue";
import User from "@/components/User.vue";

export default defineComponent({
  name: "App",
  components: {
    Navbar,
    Main,
    User,
  },
  mounted() {
    window.onresize = () => this.$emitter.emit("window-resized");
    window.onclick = (e: MouseEvent) => {
      const path = ((e as any).path || (e.composedPath && e.composedPath())) as
        | HTMLElement[]
        | false;
      path && this.$emitter.emit("window-clicked", path);
    };
    /* this.$router.push("/razred/4.c"); */
  },
});
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
}

@media screen and (max-width: 1600px) {
  #app {
    zoom: 0.8;
  }
}
</style>
