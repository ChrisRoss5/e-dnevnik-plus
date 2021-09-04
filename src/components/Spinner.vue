<template>
  <transition name="opacity">
    <div
      v-if="visible"
      id="spinner"
      class="flex-center abs-cover"
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
      default: "150px",
    },
  },
});
</script>

<style lang="scss" scoped>
#spinner {
  top: -3px;
  transform: translate3d(0, 0, 0);
  will-change: opacity, transform;
  transition: background-color 500ms, backdrop-filter 500ms;
  z-index: 2;
}
</style>
