<template>
  <div
    v-show="user"
    id="user"
    class="hovered-text-button card"
    @click.self="showDropdown = !showDropdown"
    ref="user"
  >
    {{ user ? user.fullName : "" }}
    <span class="material-icons"> account_circle </span>
    <Dropdown
      :visible="showDropdown"
      :list="dropdown"
      customClass="user-dropdown"
      sourceElementId="user"
      @close="dropdownClosed"
    ></Dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown, { DropdownItem } from "./Dropdown.vue";
import { MutationTypes } from "@/store/mutations";
import { User } from "@/store/state";
import { logout } from "@/scripts/scrapers";

export default defineComponent({
  name: "User",
  components: {
    Dropdown,
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  mounted() {
    const userEl = this.$refs.user as HTMLElement;
    new ResizeObserver(() => {
      this.$reactive.userOffsetWidth = userEl.offsetWidth + "px";
    }).observe(userEl);
  },
  methods: {
    async dropdownClosed(rowName: string | undefined) {
      this.showDropdown = false;
      if (rowName == "Odjava" && this.user && (await logout())) {
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
    dropdown(): DropdownItem[] {
      return [
        {
          name: "Osobni podaci",
          icon: "fingerprint",
          link:
            "/razred/" + (this.$route.params.classId || "-") + "/osobni-podaci",
        },
        {
          name: "Odjava",
          icon: "exit_to_app",
        },
      ];
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
  user-select: none;
  transition: box-shadow 150ms, color 150ms;
  z-index: 99;

  & > .material-icons {
    pointer-events: none;
    font-size: 44px;
    padding-left: 20px;
  }

  @include themed() {
    color: t("gray-blue");

    &.card {
      background: t("white-background");
    }
  }
}
</style>
