<template>
  <div>
    <div v-if="noDataPresent === true" id="stats-empty">
      Nema podataka za prikaz.
    </div>
    <div v-if="chartData.length" id="stats" class="abs-cover">
      <div id="chart1"></div>
      <div id="chart2"></div>
      <div id="chart3">
        <BarChart
          :chartData="chartData"
          :finalAverage="finalAverage"
          :finalGradesCount="finalGradesCount"
          :gradeCountAverage="gradeCountAverage"
        ></BarChart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BarChart from "@/components/charts/BarChart.vue";
import { updateSubjects } from "@/scripts/scrapers";
import { ClassInfo, SubjectCache } from "@/store/state";

export default defineComponent({
  name: "Stats",
  components: { BarChart },
  props: { classId: String },
  mounted() {
    if (!this.openedClassInfo) return;
    this.$emit("sectionLoading");
    //if (!(await updateSubjects(this.openedClassInfo, forceUpdate))) return;  // todo: uncomment
    this.$emit("sectionLoaded");
    this.chartData = this.openedClassInfo.cachedSubjects || [];
    this.noDataPresent = !this.chartData.length;
    if (this.noDataPresent) return;

    let totalSum = 0;
    let totalCount = 0;
    const gradeCountsPerSubject: number[] = [];
    for (const subject of this.chartData) {
      let count = 0;
      if (subject.gradesByCategory)
        for (const row of subject.gradesByCategory)
          for (const cell of row.grades)
            for (const grade of cell) {
              totalSum += grade;
              count += 1;
            }
      totalCount += count;
      if (count) gradeCountsPerSubject.push(count);
    }
    this.finalGradesCount = totalCount;
    this.finalAverage = totalSum / totalCount;
    this.gradeCountAverage =
      gradeCountsPerSubject.reduce((a, b) => a + b, 0) /
      gradeCountsPerSubject.length;
    console.log(this.finalGradesCount, this.finalAverage);
  },
  data() {
    return {
      chartData: [] as SubjectCache[],
      finalGradesCount: 0,
      finalAverage: 0,
      gradeCountAverage: 0,
      noDataPresent: false,
    };
  },
  computed: {
    openedClassInfo(): ClassInfo | undefined {
      return this.$store.getters.classInfo(this.classId || "");
    },
  },
});
</script>

<style lang="scss" scoped>
#stats {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;

  & > div {
    position: relative;
    overflow: hidden;
  }
}

#chart1 {
  height: 40%;
  flex: 0 1 60%;
}

#chart2 {
  flex: 1 0;
}

#chart3 {
  flex: 1 1 100%;
}
</style>
