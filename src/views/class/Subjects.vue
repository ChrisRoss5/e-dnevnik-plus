<template>
  <div id="subjects">
    <div id="summary" class="card">
      <div id="final-grade-wrap">
        Završna ocjena: <span id="final-grade">{{ finalGrade }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getSubjects } from "@/scripts/scrapers";

export default defineComponent({
  name: "Subjects",
  mounted() {
    /* console.log(getSubjects()); */
  },
  computed: {
    finalGrade(): string {
      return "5,00";
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
