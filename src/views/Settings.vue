<template>
  <div id="settings">
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
    </div>
    <div>
      <div class="title">Stranice</div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GlobalSettings } from "@/store/state";
import { MutationTypes } from "@/store/mutations";

export default defineComponent({
  name: "Settings",
  methods: {
    updateGlobalSetting(name: keyof GlobalSettings, value: boolean) {
      const commit = { name, value };
      this.$store.commit(MutationTypes.UPDATE_GLOBAL_SETTING, commit);
    },
  },
  computed: {
    globalSettings(): GlobalSettings {
      return this.$store.state.settings;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/switch.scss";

.title {
  margin: 10px 0;
  font-size: 35px;
}

#settings {
  display: grid;
  place-content: center;
  grid-auto-flow: column;
  gap: 40px;
  min-height: 100%;
}

.setting {
  padding: 10px 30px;
}

.switch.default {
  opacity: 0.5;
}
</style>
