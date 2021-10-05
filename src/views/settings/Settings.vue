<template>
  <div id="settings">
    <div>
      <div class="title">Stranice</div>
      <Websites></Websites>
    </div>
    <div>
      <div class="title">Postavke</div>
      <div class="setting card">
        Tamni prikaz:
        <div class="switch">
          <input
            :checked="globalSettings.darkTheme"
            @input="updateGlobalSetting('darkTheme', $event.target.checked)"
            type="checkbox"
            id="switch1"
            class="switch__input"
          />
          <label for="switch1" class="switch__label">&nbsp;</label>
        </div>
      </div>
      <div class="title">Podaci</div>
      <div class="text-link" @click="downloadUserData">
        Preuzmi svoje podatke (.json)
      </div>
      <div class="text-link">Vrati sve na izvorne postavke</div>
      <div class="text-link">Obriši sve podatke</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Websites from "./Websites.vue";
import { GlobalSettings, User } from "@/store/state";
import { MutationTypes } from "@/store/mutations";

export default defineComponent({
  name: "Settings",
  components: { Websites },
  methods: {
    updateGlobalSetting(name: keyof GlobalSettings, value: boolean) {
      const commit = { name, value };
      this.$store.commit(MutationTypes.UPDATE_GLOBAL_SETTING, commit);
    },
    downloadUserData() {
      const content = JSON.stringify(this.user, null, 4);
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(content);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.href = dataStr;
      downloadAnchorNode.download = "e-Dnevnik-Plus-korisnik.json";
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
  },
  computed: {
    globalSettings(): GlobalSettings {
      return this.$store.state.settings;
    },
    user(): User | undefined {
      return this.$store.getters.user;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/switch.scss";

.title {
  margin: 35px 0 10px;
  font-size: 35px;
}

#settings {
  display: grid;
  place-content: center;
  grid-auto-flow: column;
  gap: 40px;
  min-height: 100%;
  padding: 20px;
}

.setting {
  padding: 10px 30px;
}
.text-link {
  margin: 15px 0;
  cursor: pointer;
}
</style>
