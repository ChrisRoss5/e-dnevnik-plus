import { MutationTypes } from "@/store/mutations";
import { Settings, User } from "@/store/state";
import { defineComponent } from "vue";

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
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
  }
});
