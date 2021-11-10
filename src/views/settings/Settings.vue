<template>
  <div id="settings">
    <div>
      <div class="title">Stranice</div>
      <Websites :key="websitesKey"></Websites>
    </div>
    <div>
      <div class="title">Opcije</div>
      <Option :text="'Tamni prikaz'" :setting="'darkTheme'"></Option>
      <Option
        :text="'Animacije'"
        :setting="'transitions'"
        :info="'Za brži rad aplikacije onemogući ovu opciju'"
      ></Option>
      <Option :text="'Automatska prijava'" :setting="'autoSignIn'"></Option>
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
import { defaultUserSettings } from "@/scripts/new-user";
import { jsonClone } from "@/scripts/utils";
import { MutationTypes } from "@/store/mutations";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";
import Option from "./Option.vue";
import Websites from "./Websites.vue";

const toast = useToast();

export default defineComponent({
  name: "Settings",
  components: { Websites, Option },
  data() {
    return {
      websitesKey: 0, // Used to rerender changes
    };
  },
  methods: {
    downloadUserData() {
      const download = document.body.appendChild(document.createElement("a"));
      const userData = jsonClone(this.user) as any;
      delete userData.password;
      download.href =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(userData, null, 4));
      download.download = "e-Dnevnik-Plus-korisnik.json";
      download.click();
      download.remove();
      this.sendAnalyticsButtonClick("downloadUserData");
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
      this.sendAnalyticsButtonClick("resetSettings");
    },
    deleteUserData() {
      const msg = "Svi korisnički podaci bit će trajno obrisani.";
      if (!confirm(msg)) return;
      const state = jsonClone(this.$store.state);
      const thisUser = state.users.findIndex((u) => u == this.user);
      state.users.splice(thisUser, 1);
      this.$store.commit(MutationTypes.INIT, state);
      toast.success("Korisnički račun sada je trajno obrisan.");
      this.sendAnalyticsButtonClick("deleteUserData");
    },
    sendAnalyticsButtonClick(optionName: string) {
      window.gtag("event", "button click", {
        event_category: "settings option",
        event_label: optionName,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
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

.text-link {
  margin: 15px 0;
  cursor: pointer;
}
</style>
