<template>
  <router-link
    v-for="(row, i) in list"
    :key="i"
    :to="rootLink + convertToPath(row.name)"
    :class="{
      'router-link-active':
        $route.path.includes('razred') && row.name == 'Razred',
      blinking: row.blinking && blinking,
    }"
    @click="rowClicked"
    v-tooltip.right="navCollapsed ? row.name : ''"
    v-wave
  >
    <span class="material-icons"> {{ row.icon }} </span>
    <div class="text" :style="'--order: ' + (i + order)">{{ row.name }}</div>
  </router-link>
</template>

<script lang="ts">
import { convertToPath } from "@/scripts/utils";
import { defineComponent, PropType } from "vue";
import { NavbarLink } from "./Navbar.vue";

// TODO?: fix v-tooltip empty divs generating in <body>

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
  data() {
    return {
      blinking: true
    }
  },
  methods: {
    rowClicked(e: MouseEvent) {
      if ((e.target as HTMLAnchorElement).classList.contains("blinking"))
        this.blinking = false;
    },
    convertToPath: (name: string) => convertToPath(name),
  },
});
</script>

<style lang="scss" scoped>
.blinking::after {
  content: "";
  position: absolute;
  right: 20px;
  border-radius: 50%;
  background: #ff7b00;
  width: 0.6rem;
  height: 0.6rem;
  animation: blink 3s infinite;
}

@keyframes blink {
  from,
  to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.router-link-active {
  background: $navbar-selected;
  color: $navbar-selected-text-color !important;

  .material-icons {
    text-shadow: 0 0 15px;
  }
}
</style>