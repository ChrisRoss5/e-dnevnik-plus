<template>
  <div id="main">
    <!-- <transition :name="transitionName">
      <router-view></router-view>
    </transition> -->
    <div id="nav">
      <router-link to="/">Home</router-link> |
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Main",
  components: {},
  data() {
    return {
      transitionName: "login",
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path;
      const fromDepth = from.path;
      console.log(to, from);

      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    },
  },
});
</script>

<style lang="scss" scoped>
#main {
  flex: 1;
}
</style>
