<template>
  <div
    v-if="user"
    id="user"
    class="hovered-text-button"
    @click.self="showDropdown = !showDropdown"
  >
    {{ user.fullName }}
    <span class="material-icons"> account_circle </span>
    <Dropdown
      :visible="showDropdown"
      :list="dropdown"
      customClass="right"
      sourceElementId="user"
      @close="dropdownClosed"
    ></Dropdown>
  </div>
</template>

<script lang="ts">
import { MutationTypes } from "@/store/mutations";
import { defineComponent } from "vue";
import { User } from "@/store/state";
import Dropdown from "./Dropdown.vue";

export default defineComponent({
  name: "User",
  components: {
    Dropdown,
  },
  data() {
    return {
      showDropdown: false,
      dropdown: [
        {
          name: "Osobni podaci",
          icon: "fingerprint",
          link: "/osobni-podaci",
        },
        {
          name: "Odjava",
          icon: "exit_to_app",
        },
      ],
    };
  },
  methods: {
    dropdownClosed(rowName: string) {
      this.showDropdown = false;
      if (rowName == "Odjava" && this.user) {
        this.$store.commit(MutationTypes.UPDATE_USER_STATUS, {
          user: this.user,
          status: false,
        });
      }
    },
  },
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
  },
});
</script>

<style lang="scss" scoped>
#user {
  position: relative;
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 0;
  padding: 0 40px 0 20px;
  border-radius: 8px 0 0 8px;
  color: $user-color;
  user-select: none;
  transition: box-shadow 150ms, color 150ms;

  & > .material-icons {
    pointer-events: none;
    font-size: 44px;
    padding-left: 20px;
  }

  &.card {
    background: #fff;
  }
}
</style>
