<template>
  <div id="settings">
    <div>
      <div class="title">Stranice</div>
      <Websites :key="websitesKey"></Websites>
    </div>
    <div>
      <div class="title">Postavke</div>
      <div class="setting card">
        <div class="text">Tamni prikaz:</div>
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
      <div class="setting card">
        <div class="text">Automatska prijava:</div>
        <div class="switch">
          <input
            :checked="userSettings.autoSignIn"
            @input="updateUserSetting('autoSignIn', $event.target.checked)"
            type="checkbox"
            id="switch2"
            class="switch__input"
          />
          <label for="switch2" class="switch__label">&nbsp;</label>
        </div>
      </div>
      <div class="title">Podaci</div>
      <div class="text-link" @click="downloadUserData">
        Preuzmi svoje podatke (.json)
      </div>
      <div class="text-link" @click="resetSettings">
        Vrati sve na izvorne postavke
      </div>
      <div class="text-link" @click="deleteUserData">Obriši sve podatke</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";
import Websites from "./Websites.vue";
import { GlobalSettings, Settings, User } from "@/store/state";
import { MutationTypes } from "@/store/mutations";
import { defaultUserSettings } from "@/scripts/new-user";
import { jsonClone } from "@/scripts/utils";

const toast = useToast();

export default defineComponent({
  name: "Settings",
  components: { Websites },
  data() {
    return {
      websitesKey: 0, // Used to rerender changes
    };
  },
  methods: {
    updateGlobalSetting(name: keyof GlobalSettings, value: boolean) {
      const commit = { name, value };
      this.$store.commit(MutationTypes.UPDATE_GLOBAL_SETTING, commit);
    },
    updateUserSetting(name: keyof Settings, value: boolean) {
      if (!this.user) return;
      const commit = { user: this.user, settings: { [name]: value } };
      this.$store.commit(MutationTypes.UPDATE_USER_SETTINGS, commit);
    },
    downloadUserData() {
      const download = document.body.appendChild(document.createElement("a"));
      download.href =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.user, null, 4));
      download.download = "e-Dnevnik-Plus-korisnik.json";
      download.click();
      download.remove();
    },
    resetSettings() {
      if (!this.user) return;
      const settings = jsonClone(defaultUserSettings);
      settings.websitesSettings[0].urls = this.user.classesList.flatMap(
        ({ school, schoolUrl }) =>
          school && schoolUrl && schoolUrl != "/"
            ? [{ url: schoolUrl, name: school }]
            : [],
      );
      const commit = { user: this.user, settings };
      this.$store.commit(MutationTypes.UPDATE_USER_SETTINGS, commit);
      this.websitesKey += 1;
      toast.success("Postavke računa sada su resetirane.");
    },
    deleteUserData() {
      const msg = "Svi korisnički podaci bit će trajno obrisani.";
      if (!confirm(msg)) return;
      const state = jsonClone(this.$store.state);
      const thisUser = state.users.findIndex((u) => u == this.user);
      state.users.splice(thisUser, 1);
      this.$store.commit(MutationTypes.INIT, state);
      toast.success("Korisnički račun sada je trajno obrisan.");
    },
  },
  computed: {
    globalSettings(): GlobalSettings {
      return this.$store.state.settings;
    },
    userSettings(): Settings {
      return this.user ? this.user.settings : defaultUserSettings;
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
  display: flex;
  padding: 10px 30px;
  margin-bottom: 15px;

  .text {
    margin-right: auto;
  }
}

.text-link {
  margin: 15px 0;
  cursor: pointer;
}
</style>
