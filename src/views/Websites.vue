<template>
  <div id="websites">
    <div
      v-if="activeFrames.length > 1"
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
    <div id="iframe">
      <iframe
        :class="{ loading }"
        :src="activeFrame.url"
        @load="loading = false"
        @error="loading = false"
        ref="iframe"
      ></iframe>
      <Spinner :visible="loading"></Spinner>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown, { DropdownItem } from "@/components/Dropdown.vue";
import Spinner from "@/components/Spinner.vue";
import { User, WebsiteInfo, WebsiteSettings } from "@/store/state";
import { MutationTypes } from "@/store/mutations";
import { convertToPath } from "@/scripts/utils";

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
      this.loading = true;
      this.showDropdown = false;
      if (!rowName) return;
      this.activeFrame = this.activeFrames.find((f) => f.name == rowName)!;
    },
    updateSettings(newSettings: WebsiteSettings[]) {
      if (!this.user) return;
      this.$store.commit(MutationTypes.UPDATE_USER_SETTINGS, {
        user: this.user,
        settings: { websitesSettings: newSettings },
      });
    },
  },
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
    activeFrames(): WebsiteInfo[] {
      const path = this.$route.params.website as string | undefined;
      const website = this.settings.find((w) => convertToPath(w.name) == path);
      if (!website) return [];
      let urls: WebsiteInfo[] | undefined;
      if (!website.urls.length) {
        urls = this.user!.classesList.flatMap(({ schoolUrl, school }) =>
          schoolUrl && schoolUrl != "/"
            ? [
                {
                  url: schoolUrl,
                  name: school,
                },
              ]
            : [],
        );
      }
      return urls || [];
    },
    dropdownList(): DropdownItem[] {
      return this.activeFrames.map(({ name, tooltip, url }) => ({
        name: name || "Stranica",
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
        this.loading = true;
        this.activeFrame = this.activeFrames[0];
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
