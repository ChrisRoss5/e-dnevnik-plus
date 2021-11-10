<template>
  <div id="websites" class="flex-center">
    <div
      id="urls"
      class="flex-center card"
      @click.self="showDropdown = !showDropdown"
    >
      <span class="material-icons"> link </span>
      <Dropdown
        :visible="showDropdown"
        :list="dropdownList"
        sourceElementId="urls"
        @close="dropdownClosed"
      ></Dropdown>
    </div>
    <div v-if="activeFrame" id="iframe">
      <iframe
        :class="{ loading }"
        :src="activeFrame.url"
        @load="loading = false"
        @error="loading = false"
        ref="iframe"
      ></iframe>
      <Spinner :visible="loading"></Spinner>
    </div>
    <div v-else>Stranica ne postoji.</div>
  </div>
</template>

<script lang="ts">
import Dropdown, { DropdownItem } from "@/components/Dropdown.vue";
import Spinner from "@/components/Spinner.vue";
import { convertToPath } from "@/scripts/utils";
import { WebsiteInfo, WebsiteSettings } from "@/store/state";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Websites",
  components: {
    Dropdown,
    Spinner,
  },
  data() {
    return {
      loading: true,
      showDropdown: false,
      activeFrame: {} as WebsiteInfo | undefined,
    };
  },
  methods: {
    dropdownClosed(rowName?: string) {
      this.showDropdown = false;
      if (!rowName) return;
      const newFrame = this.activeFrames.find((f) => f.name == rowName)!;
      if (newFrame == this.activeFrame) return;
      this.loading = true;
      this.activeFrame = newFrame;
    },
  },
  computed: {
    activeFrames(): WebsiteInfo[] {
      const path = this.$route.params.website as string | undefined;
      const website = this.settings.find((w) => convertToPath(w.name) == path);
      return website ? website.urls || [] : [];
    },
    dropdownList(): DropdownItem[] {
      return this.activeFrames.map(({ name, tooltip, url }) => ({
        name: name || "Bezimena stranica",
        tooltip,
        active: url == (this.activeFrame ? this.activeFrame.url : ""),
      }));
    },
    settings(): WebsiteSettings[] {
      return this.user ? this.user.settings.websitesSettings : [];
    },
  },
  watch: {
    $route: {
      handler() {
        if (this.activeFrame == this.activeFrames[0]) return;
        this.activeFrame = this.activeFrames[0];
        this.loading = true;
      },
      immediate: true,
    },
  },
});
</script>

<style lang="scss" scoped>
#websites,
#iframe,
iframe {
  width: 100%;
  height: 100%;
}

iframe {
  transition: opacity $views-transition;

  &.loading {
    opacity: 0;
  }
}

#urls {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 44px;
  height: 44px;
  cursor: pointer;

  & > span {
    pointer-events: none;
  }

  @include themed() {
    background: t("white-background");
  }
}
</style>
