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
import Main from "@/components/Main.vue";
import Navbar from "@/components/Navbar.vue";
import User from "@/components/User.vue";
import { ActionTypes } from "@/store/actions";
import { defineComponent } from "vue";

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
      this.toggleDarkTheme(this.$store.state.settings.darkTheme);
      this.toggleTransitions(this.$store.state.settings.transitions);
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
    toggleDarkTheme(enabled: boolean) {
      document.body.classList[enabled ? "add" : "remove"]("theme--dark");
      document.body.classList[enabled ? "remove" : "add"]("theme--default");
    },
    toggleTransitions(enabled: boolean) {
      document.body.classList[enabled ? "remove" : "add"]("no-transitions");
    },
  },
  watch: {
    "$store.getters.user"(user) {
      if (!user) this.$router.replace("/");
    },
    "$store.state.settings.darkTheme"(enabled) {
      this.toggleDarkTheme(enabled);
    },
    "$store.state.settings.transitions"(enabled) {
      this.toggleTransitions(enabled);
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
