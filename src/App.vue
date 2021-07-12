<template>
  <!-- <iframe sr="chttps://www.youtube.com"></iframe> -->
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
    this.$router.push('/razred/4.c');
  },
});
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100vh;
}
</style>
