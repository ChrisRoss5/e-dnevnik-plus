<template>
  <Navbar></Navbar>
  <Main></Main>
  <User></User>
</template>

<script lang="ts">
import { ActionTypes } from "@/store/actions";
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
    this.$store.dispatch(ActionTypes.INIT, undefined).then((userSignedIn) => {
      const isLoginPage = window.location.hash == "#/";
      if (userSignedIn && isLoginPage) {
        this.$router.replace("/razred");
      } else if (!userSignedIn && !isLoginPage) {
        this.$router.replace("/");
      }
    });
    window.onresize = () => this.$emitter.emit("window-resized");
    window.onclick = (e: MouseEvent) => {
      const path = ((e as any).path || (e.composedPath && e.composedPath())) as
        | HTMLElement[]
        | false;
      path && this.$emitter.emit("window-clicked", path);
    };
  },
});
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
}

/* @media screen and (max-width: 1200px) {
  #app {
    zoom: 0.8;
  }
} */
</style>
