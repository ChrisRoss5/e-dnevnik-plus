<template>
  <div
    
    id="new-grades"
    class="hovered-text-button flex-center"
    @click.self="newsDropdownVisible = true"
  >
    Novi zapisi: 3
    <div class="material-icons">arrow_drop_down</div>
    <Dropdown
      :visible="newsDropdownVisible"
      sourceElementId="new-grades"
      @close="newsDropdownVisible = false"
    >
    </Dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown from "@/components/Dropdown.vue";
import { User } from "@/store/state";

export default defineComponent({
  name: "News",
  components: {
    Dropdown,
  },
  data() {
    return {
      newsDropdownVisible: false,
    };
  },
  computed: {
    news() {
      return this.user ? this.user.classNews : [];
    },
  },
});
</script>

<style lang="scss" scoped>
#new-grades {
  margin-left: 30px;

  @include themed() {
    color: t("strong-blue");
  }
}
</style>
