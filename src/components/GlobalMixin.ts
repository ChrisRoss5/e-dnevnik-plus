import { defineComponent } from "vue";
import { Settings } from "@/store/state";
import { MutationTypes } from "@/store/mutations";

export default defineComponent({
  methods: {
    updateUserSettings<T extends keyof Settings>(
      settingsKey: T,
      settingsValue: Settings[T],
    ) {
      const user = this.$store.getters.user;
      if (!user) return;
      const commit = { user, settings: { [settingsKey]: settingsValue } };
      this.$store.commit(MutationTypes.UPDATE_USER_SETTINGS, commit);
    },
  },
});
