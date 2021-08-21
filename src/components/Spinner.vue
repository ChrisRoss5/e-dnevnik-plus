<template>
  <transition name="opacity">
    <div
      v-if="visible"
      id="spinner"
      class="flex-center"
      :class="{ blur }"
    >
      <img
        src="@/assets/img/spinner.svg"
        :style="{ width: size, height: size }"
      />
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Spinner",
  props: {
    visible: Boolean,
    blur: Boolean,
    size: {
      type: String,
      default: "200px",
    },
  },
});
</script>

<style lang="scss" scoped>
#spinner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translate3d(0, 0, 0);
  will-change: opacity, transform;
  transition: background-color 500ms, backdrop-filter 500ms;
  z-index: 2;
}
</style>
