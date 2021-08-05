<template>
  <router-link
    v-for="({ name, icon }, i) in list"
    :key="i"
    :to="rootLink + name.replaceAll(' ', '-').toLowerCase()"
    :class="{
      'router-link-active':
        $route.href && $route.href.includes('razred') && name == 'Razred',
    }"
    v-tooltip.right="navCollapsed ? name : ''"
    v-wave
  >
    <span class="material-icons"> {{ icon }} </span>
    <div class="text" :style="'--order: ' + (i + order)">{{ name }}</div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// TODO: fix v-tooltip empty divs in <body>

export default defineComponent({
  name: "NavbarList",
  props: {
    list: {
      type: Array as PropType<Array<{ name: string; icon: string }>>,
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
});
</script>

<style lang="scss" scoped>
.router-link-active {
  background: $navbar-selected;
  color: $navbar-selected-text-color !important;
}
</style>