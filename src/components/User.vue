<template>
  <div id="user" v-if="user">
    {{ user.fullName }}
    <span class="material-icons"> account_circle </span>
  </div>
  <!--     <div id="logout">
      <span class="material-icons"> exit_to_app </span>
    </div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { User } from "@/store/state";

export default defineComponent({
  name: "User",
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
  },
});
</script>

<style lang="scss" scoped>
#user {
  display: flex;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 40px;
  color: #476282;

  .material-icons {
    font-size: 44px;
    padding-left: 20px;
  }
}

#logout {
  flex-basis: 100%;
  text-align: right;
  padding: 10px 12px 0 0;
}
</style>
