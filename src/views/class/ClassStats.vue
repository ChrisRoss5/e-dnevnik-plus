<template>
  <div class="abs-cover" style="top: -25px">
    <Stats
      :classId="classId"
      @sectionLoading="$emit('sectionLoading')"
      @sectionLoaded="$emit('sectionLoaded')"
    ></Stats>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Stats from "@/components/stats/Stats.vue";

export default defineComponent({
  name: "ClassStats",
  components: { Stats },
  props: { classId: String },
  emits: ["sectionLoading", "sectionLoaded"],
});
</script>