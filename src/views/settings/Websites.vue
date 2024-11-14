<template>
  <SlickList
    id="sections"
    v-model:list="websitesSettingsClone"
    axis="y"
    lockAxis="y"
    :lockOffset="10"
    :lockToContainerEdges="true"
    :distance="5"
  >
    <SlickItem
      v-for="(website, i) in websitesSettingsClone"
      :key="website.name"
      :index="i"
      class="card website"
    >
      <div class="website-title flex-center">
        {{ website.name }}
        <span class="material-icons add-url" @click="addUrl(i)"> add </span>
      </div>
      <SlickList
        v-model:list="website.urls"
        axis="y"
        lockAxis="y"
        :lockOffset="10"
        :lockToContainerEdges="true"
        :distance="5"
        :useDragHandle="true"
      >
        <SlickItem
          v-for="(websiteInfo, j) of website.urls"
          :key="j"
          :index="j"
          class="website-info card flex-center"
        >
          <div>
            <input
              type="text"
              v-model="websiteInfo.name"
              spellcheck="false"
              placeholder="Unesi naziv..."
            />
            <input
              type="text"
              v-model="websiteInfo.url"
              spellcheck="false"
              placeholder="Unesi link..."
            />
          </div>
          <div class="flex-center">
            <div class="remove-url material-icons" @click="deleteUrl(i, j)">
              delete
            </div>
            <div class="drag-handle material-icons" v-handle>drag_handle</div>
          </div>
        </SlickItem>
      </SlickList>
    </SlickItem>
    <div id="add-website" class="flex-center card">
      <input
        v-model="newWebsiteName"
        type="text"
        placeholder="Unesi naziv stranice..."
        spellcheck="false"
      />
      <div class="button" @click="addWebsite">Dodaj</div>
    </div>
  </SlickList>
</template>

<script lang="ts">
import { jsonClone } from "@/scripts/utils";
import { WebsiteSettings } from "@/store/state";
import { defineComponent } from "vue";
import { HandleDirective, SlickItem, SlickList } from "vue-slicksort";

export default defineComponent({
  name: "Websites",
  components: { SlickList, SlickItem },
  directives: { handle: HandleDirective },
  mounted() {
    this.websitesSettingsClone = jsonClone(
      this.user ? this.user.settings.websitesSettings : [],
    );
  },
  data() {
    return {
      newWebsiteName: "",
      websitesSettingsClone: [] as WebsiteSettings[],
    };
  },
  methods: {
    addWebsite() {
      if (!this.newWebsiteName) return;
      this.websitesSettingsClone.push({
        name: this.newWebsiteName,
        urls: [{ name: "", url: "" }],
      });
      chrome.runtime.sendMessage({
        name: "SEND_ANALYTICS_EVENT",
        params: {
          name: "click_button",
          id: "websites",
          website: this.newWebsiteName,
        },
      });
      this.newWebsiteName = "";
    },
    addUrl(i: number) {
      this.websitesSettingsClone[i].urls.push({ name: "", url: "" });
    },
    deleteUrl(i: number, j: number) {
      this.websitesSettingsClone[i].urls.splice(j, 1);
      if (!this.websitesSettingsClone[i].urls.length)
        this.websitesSettingsClone.splice(i, 1);
    },
  },

  watch: {
    websitesSettingsClone: {
      handler(newVal, oldVal) {
        if (!oldVal.length) return;
        this.updateUserSettings("websitesSettings", this.websitesSettingsClone);
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
input {
  margin: 0;
}

.website {
  padding: 10px 20px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;

  input {
    box-shadow: none;

    &:last-of-type {
      @include themed() {
        border-top: 1px solid t("light-border-color");
      }
    }
  }
}

.website-title > .add-url {
  margin-left: auto;
  padding-left: 20px;
  cursor: pointer;

  @include themed() {
    color: t("light-gray");
  }
}

.website-info {
  margin: 15px 0;
  overflow: hidden;

  @include themed() {
    background: t("white-background");
  }
}

.remove-url,
.drag-handle {
  padding: 0 15px;
  transition: color 150ms;

  @include themed() {
    color: t("light-gray");
    border-left: 1px solid t("light-border-color");
  }
}

.remove-url:hover {
  color: $soft-red;
  cursor: pointer;
}

.drag-handle:hover {
  color: $navbar-selected-text-color;
  cursor: row-resize;
}

#add-website {
  overflow: hidden;

  input {
    box-shadow: none;
  }
}
</style>
