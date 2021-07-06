<template>
  <!-- <iframe sr="chttps://www.youtube.com"></iframe> -->
  <Navbar></Navbar>
  <Main></Main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
import Main from "@/components/Main.vue";

export default defineComponent({
  name: "App",
  components: {
    Navbar,
    Main,
  },
  mounted() {
    this.$router.push('login');
  }
});
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100vh;
}
</style>
