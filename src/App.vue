<template>
  <template v-if="isAppInitiated">
    <Navbar></Navbar>
    <Main></Main>
  </template>
  <transition name="opacity">
    <User></User>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
import Main from "@/components/Main.vue";
import User from "@/components/User.vue";
import { ActionTypes } from "@/store/actions";

export default defineComponent({
  name: "App",
  components: {
    Navbar,
    Main,
    User,
  },
  data() {
    return {
      isAppInitiated: false,
    };
  },
  created() {
    this.$store.dispatch(ActionTypes.INIT, undefined).then((userSignedIn) => {
      const isLoginPage = window.location.hash == "#/";
      if (userSignedIn && isLoginPage) {
        this.$router.replace("/razred");
      } else if (!userSignedIn && !isLoginPage) {
        this.$router.replace("/");
      }
      this.enableDarkTheme(this.$store.state.settings.darkTheme);
      this.isAppInitiated = window.isAppInitiated = true;
      document.body.style.opacity = "1";
    });
  },
  mounted() {
    window.onresize = () => this.$emitter.emit("window-resized");
    window.onclick = (e: MouseEvent) => {
      const path = ((e as any).path || (e.composedPath && e.composedPath())) as
        | HTMLElement[]
        | false;
      if (path) this.$emitter.emit("window-clicked", path);
    };
  },
  methods: {
    enableDarkTheme(enabled: boolean) {
      document.body.classList[enabled ? "add" : "remove"]("theme--dark");
      document.body.classList[enabled ? "remove" : "add"]("theme--default");
    },
  },
  watch: {
    "$store.getters.user"(user) {
      if (!user) this.$router.replace("/");
    },
    "$store.state.settings.darkTheme"(enabled) {
      this.enableDarkTheme(enabled);
    },
  },
});
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
}
</style>
