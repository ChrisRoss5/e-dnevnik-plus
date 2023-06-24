<template>
  <Wrapper></Wrapper>
  <Previews v-if="$route.path == '/'"></Previews>
  <div id="background">
    <div
      v-for="(rect, i) in rectangles"
      :key="i"
      class="rect"
      :style="rect"
    ></div>
  </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent } from "vue";
import Wrapper from "./components/Wrapper.vue";
import Previews from "./components/Previews.vue";

export default defineComponent({
  name: "App",
  components: { Wrapper, Previews },
  data() {
    return {
      scrolling: false,
      rectangles: [] as CSSProperties[],
      speed: 20000,
    };
  },
  mounted() {
    for (let i = 0; i < 10; i++) this.updateRect(i, true);
    const path = localStorage.getItem("path");
    if (path) {
      localStorage.removeItem("path");
      this.$router.replace(path);
    }
  },
  methods: {
    updateRect(i: number, init?: boolean) {
      const size = this.rand(30, 150);
      const bottomPerc = this.rand(0, 100);
      const bottom = init ? bottomPerc + "%" : -size + "px";
      const transition =
        this.rand(this.speed, this.speed * 2) *
        (init ? 1 - bottomPerc / 100 : 1);
      this.rectangles[i] = { bottom, opacity: "1" };
      setTimeout(() => {
        this.rectangles[i] = {
          bottom: "100%",
          opacity: "0",
          left: this.rand(-10, 100) + "%",
          width: size + "px",
          height: size + "px",
          borderRadius: this.rand(size / 10, size / 3) + "px",
          animation: "rotate " + size * 100 + "ms linear infinite",
          transition: `bottom ${transition}ms ease-out, opacity ${
            transition * 0.2
          }ms ${transition * 0.5}ms`,
        };
        setTimeout(() => this.updateRect(i), transition);
      }, 100);
    },
    rand(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
  },
});
</script>

<style lang="scss">
#app {
  & > div {
    min-height: 100vh;
  }
}

#background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0;
  transform: scale(0) rotate(45deg);
  animation: show-background 3s forwards;

  .rect {
    background: rgba($plus-color, 0.5);
    opacity: 0;
    filter: opacity(0.4);
    position: absolute;
    will-change: bottom, opacity;
  }
}

@keyframes show-background {
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

/* transitions */

.previews-enter-active,
.previews-leave-active {
  transition: opacity 250ms;
}

.previews-enter-from,
.previews-leave-to {
  opacity: 0;
  width: 0;
}
</style>
