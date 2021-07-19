<template>
  <div id="main" ref="main">
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
  data() {
    return {
      transitionName: "login",
    };
  },
  mounted() {
    (this.$refs.main as HTMLElement).onscroll = () => this.$emitter.emit("main-scrolled");
  },
  watch: {
    $route(/* to, from */) {
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
  overflow-y: scroll;
  flex: 1;
}
</style>
