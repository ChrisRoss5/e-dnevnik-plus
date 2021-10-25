<template>
  <router-link
    v-for="({ name, icon }, i) in list"
    :key="i"
    :to="rootLink + convertToPath(name)"
    :class="{
      'router-link-active': $route.path.includes('razred') && name == 'Razred',
    }"
    v-tooltip.right="navCollapsed ? name : ''"
    v-wave
  >
    <span class="material-icons"> {{ icon }} </span>
    <div class="text" :style="'--order: ' + (i + order)">{{ name }}</div>
  </router-link>
</template>

<script lang="ts">
import { convertToPath } from "@/scripts/utils";
import { defineComponent, PropType } from "vue";
import { NavbarLink } from "./Navbar.vue";

// TODO: fix v-tooltip empty divs generating in <body>

export default defineComponent({
  name: "NavbarList",
  props: {
    list: {
      type: Array as PropType<NavbarLink[]>,
      required: true,
    },
    rootLink: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    navCollapsed: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    convertToPath: (name: string) => convertToPath(name),
  },
});
</script>

<style lang="scss" scoped>
.router-link-active {
  background: $navbar-selected;
  color: $navbar-selected-text-color !important;

  .material-icons {
    text-shadow: 0 0 15px;
  }
}
</style>