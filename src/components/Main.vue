<template>
  <div
    id="main"
    ref="main"
    :class="{
      'no-overflow': $route.path.includes('/stranica/'),
    }"
  >
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
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
      transitionName: "",
    };
  },
  mounted() {
    (this.$refs.main as HTMLElement).onscroll = () =>
      this.$emitter.emit("main-scrolled");
  },
  watch: {
    $route(to, from) {
      if (to.path == "/") this.transitionName = "logged-out";
      else if (from.path == "/") this.transitionName = "logged-in";
      else this.transitionName = "main";
    },
  },
});
</script>

<style lang="scss">
#main {
  position: relative;
  overflow-y: scroll;
  flex: 1;

  &.no-overflow {
    overflow: hidden;
  }

  /* root views */
  & > div {
    transition: opacity $views-transition, transform $views-transition;
  }
}

/* transitions */

.logged-in-leave-to #students,
.logged-out-enter-from #students {
  margin-right: 50px;
}

.logged-in-enter-from,
.logged-out-leave-to,
.main-enter-from,
.main-leave-to {
  transform: scale(0.97);
}

.logged-out-enter-from,
.logged-in-enter-from,
.logged-out-leave-to,
.logged-in-leave-to,
.main-enter-from,
.main-leave-to {
  opacity: 0;
}
</style>