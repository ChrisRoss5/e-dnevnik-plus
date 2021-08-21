<template>
  <transition :name="customClass">
    <div v-if="visible" class="dropdown" :class="customClass" ref="dropdown">
      <component
        v-for="(row, i) in list"
        :key="i"
        :is="row.link ? 'router-link' : 'a'"
        :to="row.link"
        :class="{ active: row.active }"
        @click="close(row.name)"
        v-tooltip.right="{
          content: row.tooltip,
          disabled: !row.tooltip,
          html: true,
        }"
        v-wave
      >
        <span v-if="row.icon" class="material-icons"> {{ row.icon }} </span>
        {{ row.name }}
        <div v-if="row.alignRight" class="align-right">
          {{ row.alignRight }}
        </div>
      </component>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export interface DropdownItem {
  name: string;
  alignRight?: string;
  icon?: string;
  link?: string | { params: Record<string, string> };
  tooltip?: string;
  active?: boolean;
}

export default defineComponent({
  name: "Dropdown",
  props: {
    list: {
      type: Array as PropType<Array<DropdownItem>>,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    sourceElementId: {
      type: String,
      required: true,
    },
    customClass: {
      type: String,
      required: false,
      default: "dropdown",
    },
  },
  emits: ["close"],
  mounted() {
    this.$emitter.on("main-scrolled", this.close);
    this.$emitter.on("window-clicked", this.windowClicked);
  },
  beforeUnmount() {
    this.$emitter.off("main-scrolled", this.close);
    this.$emitter.off("window-clicked", this.windowClicked);
  },
  methods: {
    windowClicked(path?: HTMLElement[]) {
      if (
        !path ||
        (!path.includes(this.$refs.dropdown as HTMLElement) &&
          !path.includes(document.getElementById(this.sourceElementId)!))
      ) {
        this.close();
      }
    },
    close(rowName?: string) {
      this.$emit("close", rowName);
    },
  },
});
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  padding: 8px 0;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 0 8px 8px 8px;
  box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
  cursor: default;
  transform-origin: top left;
  transition: transform 250ms, opacity 250ms;
  z-index: 99;

  & > a {
    display: flex;
    color: $light-gray-text;
    padding: 8px 20px;
    transition: color 150ms;

    & > span {
      padding-right: 20px;
    }

    &.active {
      color: $navbar-selected-text-color;
    }

    &:not(.active):hover {
      cursor: pointer;

      @include themed() {
        color: t("dark-blue") !important;
      }
    }
  }

  @include themed() {
    background: t("white-background");
  }
}

.align-right {
  margin-left: auto;
  padding-left: 25px;
  font-weight: bold;
}

.right {
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  border-radius: 8px 0 0 8px;
}

/* transitions */

.right-enter-from,
.right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.dropdown-enter-from,
.dropdown-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
