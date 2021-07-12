<template>
  <div id="main">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition">
        <component :is="Component" />
      </transition>
    </router-view>
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
      /* const toDepth = to.path;
      const fromDepth = from.path;
      console.log(to, from);
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left"; */
    },
  },
});
</script>

<style lang="scss" scoped>
#main {
  position: relative;
  flex: 1;
  overflow-y: auto;
}
</style>
