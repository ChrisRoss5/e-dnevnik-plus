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
  created() {
    this.$store.dispatch(ActionTypes.INIT, undefined).then((userSignedIn) => {
      const isLoginPage = window.location.hash == "#/";
      if (userSignedIn && isLoginPage) {
        this.$router.replace("/razred");
      } else if (!userSignedIn && !isLoginPage) {
        this.$router.replace("/");
      }
      this.enabledarkTheme(this.$store.state.settings.darkTheme);
    });
  },
  mounted() {
    window.onresize = () => this.$emitter.emit("window-resized");
    window.onclick = (e: MouseEvent) => {
      const path = ((e as any).path || (e.composedPath && e.composedPath())) as
        | HTMLElement[]
        | false;
      path && this.$emitter.emit("window-clicked", path);
    };
  },
  methods: {
    enabledarkTheme(enabled: boolean) {
      document.body.classList[enabled ? "add" : "remove"]("theme--dark");
      document.body.classList[enabled ? "remove" : "add"]("theme--default");
    },
  },
  watch: {
    "$store.getters.user"(user) {
      if (!user) this.$router.replace("/");
    },
    "$store.state.settings.darkTheme"(enabled) {
      this.enabledarkTheme(enabled);
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
