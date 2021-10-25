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
import Stats from "@/components/stats/Stats.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ClassStats",
  components: { Stats },
  props: { classId: String },
  emits: ["sectionLoading", "sectionLoaded"],
});
</script>