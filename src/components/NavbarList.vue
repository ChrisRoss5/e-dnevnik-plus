<template>
  <router-link
    v-for="({ name, icon }, i) in list"
    :key="i"
    :to="rootLink + name.replaceAll(' ', '-').toLowerCase()"
    v-tooltip.right="navCollapsed ? name : ''"
    v-wave
  >
    <span class="material-icons"> {{ icon }} </span>
    <div class="text" :style="'--order: ' + (i + order)">{{ name }}</div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// TODO: fix v-tooltip empty divs

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
  },
  computed: {
    navCollapsed(): boolean {
      return (this.$parent as any).$data.navCollapsed;
    }
  }
});
</script>