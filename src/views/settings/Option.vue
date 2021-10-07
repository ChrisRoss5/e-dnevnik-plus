<template>
  <div class="setting card">
    {{ text }}:
    <div v-if="info" class="material-icons" v-tooltip="info">info</div>
    <div style="width: 30px"></div>
    <div class="switch">
      <input
        :checked="isChecked"
        @input="updateSetting(setting, $event.target.checked)"
        type="checkbox"
        :id="text"
        class="switch__input"
      />
      <label :for="text" class="switch__label"></label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { MutationTypes } from "@/store/mutations";
import { GlobalSettings, Settings, User } from "@/store/state";
import { defaultUserSettings } from "@/scripts/new-user";

export default defineComponent({
  name: "Option",
  props: {
    text: {
      type: String,
      required: true,
    },
    setting: {
      type: String as PropType<keyof GlobalSettings | keyof Settings>,
      required: true,
    },
    info: String,
  },
  methods: {
    updateSetting(name: keyof GlobalSettings | keyof Settings, value: boolean) {
      let commit;
      if (this.isGlobalSetting) {
        commit = { name: name as keyof GlobalSettings, value };
        this.$store.commit(MutationTypes.UPDATE_GLOBAL_SETTING, commit);
        return;
      }
      if (!this.user) return;
      commit = { user: this.user, settings: { [name]: value } };
      this.$store.commit(MutationTypes.UPDATE_USER_SETTINGS, commit);
    },
  },
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
    globalSettings(): GlobalSettings {
      return this.$store.state.settings;
    },
    userSettings(): Settings {
      return this.user ? this.user.settings : defaultUserSettings;
    },
    isGlobalSetting(): boolean {
      return this.setting in this.globalSettings;
    },
    isChecked(): boolean {
      if (this.isGlobalSetting)
        return this.globalSettings[this.setting as keyof GlobalSettings];
      return !!this.userSettings[this.setting as keyof Settings];
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/switch.scss";

.setting {
  display: flex;
  padding: 10px 30px;
  margin-bottom: 15px;
}

.material-icons {
  padding-left: 5px;

  @include themed() {
    color: t("light-gray");
  }
}

.switch {
  margin-left: auto;
}
</style>
