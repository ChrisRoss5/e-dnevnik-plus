<template>
  <transition :name="transitionName" mode="out-in">
    <div v-if="!loaded"></div>
    <div v-else-if="noDataPresent" class="flex-center" style="height: 100%">
      Nema podataka za prikaz.
    </div>
    <div v-else id="stats">
      <div id="chart1">
        <LineChart
          :lineChartData="lineChartData"
          :finalAverage="finalAverage"
          :gradeCountAveragePerMonth="gradeCountAveragePerMonth"
        ></LineChart>
      </div>
      <div id="chart2">
        <DoughnutChart
          :doughnutChartData="doughnutChartData"
          :finalGradesCount="finalGradesCount"
        ></DoughnutChart>
      </div>
      <div id="chart3">
        <BarChart
          :barChartData="barChartData"
          :finalAverage="finalAverage"
          :finalGradesCount="finalGradesCount"
          :gradeCountAveragePerSubject="gradeCountAveragePerSubject"
        ></BarChart>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { updateSubjects } from "@/scripts/scrapers/scrapers";
import {
  getAverage,
  getSum,
  numberToColorHsl,
  removeAllparentheses
} from "@/scripts/utils";
import { ClassInfo, SubjectCache } from "@/store/state";
import { defineComponent, PropType } from "vue";
import BarChart, { ChartBarData } from "./BarChart.vue";
import DoughnutChart, { DoughnutChartData } from "./DoughnutChart.vue";
import LineChart, { ChartMonthData } from "./LineChart.vue";

export default defineComponent({
  name: "Stats",
  components: { LineChart, DoughnutChart, BarChart },
  props: {
    classId: String,
    selectedClassesId: Array as PropType<string[]>,
  },
  emits: ["sectionLoading", "sectionLoaded"],
  created() {
    this.updateSelectedClasses();
  },
  data() {
    return {
      noDataPresent: true,
      loaded: false,

      barChartData: [] as ChartBarData[],
      lineChartData: [] as ChartMonthData[],
      doughnutChartData: [] as DoughnutChartData,

      finalGradesCount: 0,
      finalAverage: 0,
      gradeCountAveragePerSubject: 0,
      gradeCountAveragePerMonth: 0,

      transitionName: "",
    };
  },
  methods: {
    async updateSelectedClasses() {
      this.$emit("sectionLoading");
      const subjects: SubjectCache[][] = [];
      const openedClass = this.classId ? [this.classId] : [];
      for (const classId of this.selectedClassesId || openedClass) {
        const classInfo = this.getClassInfo(classId);
        if (!classInfo) continue;
        await updateSubjects(classInfo); // Must go class by class
        subjects.push(classInfo.cachedSubjects!);
      }
      this.$emit("sectionLoaded");
      this.noDataPresent = !subjects.length;
      if (!this.noDataPresent) this.calculateStats(subjects);
      this.loaded = true;
      setTimeout(() => (this.transitionName = "opacity"), 500);
    },
    calculateStats(subjects: SubjectCache[][]) {
      const totalGradesCountEach = [0, 0, 0, 0, 0];
      const gradeCountPerSubject: number[] = [];
      const gradeCountMonthlyAveragePerYear: number[] = [];
      const gradeCountEachPerMonth = [...Array(10)].map(() => [0, 0, 0, 0, 0]);

      this.barChartData = [];
      for (const year of subjects.filter((y) => y)) {
        const gradeCountPerMonth = Array(10).fill(0);
        for (const { name, gradesByCategory } of year) {
          if (!gradesByCategory) continue;
          let gradesCountEach = [0, 0, 0, 0, 0];
          for (const { grades } of gradesByCategory)
            for (let i = 0; i < grades.length; i++)
              for (const grade of grades[i]) {
                totalGradesCountEach[grade - 1] += 1;
                gradesCountEach[grade - 1] += 1;
                gradeCountEachPerMonth[i][grade - 1] += 1;
                gradeCountPerMonth[i] += 1;
              }
          let gradesCount = getSum(gradesCountEach);
          if (!gradesCount) continue;
          gradeCountPerSubject.push(gradesCount);

          const sameSubject = this.barChartData.find(
            (s) => removeAllparentheses(s.name) == removeAllparentheses(name),
          );
          if (sameSubject) {
            gradesCountEach = gradesCountEach.map(
              (count, i) => count + sameSubject.gradesCountEach[i],
            );
            gradesCount = getSum(gradesCountEach);
          }
          const gradesSum = getSum(gradesCountEach, true);
          const average = +(gradesSum / gradesCount).toFixed(2);
          const bar: ChartBarData = {
            name,
            gradesCount,
            gradesCountEach,
            average,
            backgroundColor: numberToColorHsl(((average - 1) / 4) * 100, 0.4),
            borderColor: numberToColorHsl(((average - 1) / 4) * 100),
          };
          if (!sameSubject) this.barChartData.push(bar);
          else this.barChartData[this.barChartData.indexOf(sameSubject)] = bar;
        }
        gradeCountMonthlyAveragePerYear.push(
          getAverage(this.removeTrailingZeros(gradeCountPerMonth)),
        );
      }

      this.lineChartData = this.removeTrailingZeros(gradeCountEachPerMonth).map(
        (gradesCountEach) => {
          const gradesCount = getSum(gradesCountEach);
          const gradesSum = getSum(gradesCountEach, true);
          const average = +(gradesSum / gradesCount).toFixed(2);
          return { gradesCount, gradesCountEach, average };
        },
      );

      const finalGradesSum = getSum(totalGradesCountEach, true);
      this.doughnutChartData = totalGradesCountEach;
      this.finalGradesCount = getSum(totalGradesCountEach);
      this.finalAverage = finalGradesSum / this.finalGradesCount;
      this.gradeCountAveragePerSubject = getAverage(gradeCountPerSubject);
      this.gradeCountAveragePerMonth = getAverage(
        gradeCountMonthlyAveragePerYear,
      );
    },
    removeTrailingZeros<T extends number[] | number[][]>(arr: T) {
      for (let i = arr.length - 1; i > -1; i--) {
        if (typeof arr[i] == "number" ? arr[i] : getSum(arr[i] as number[]))
          return arr;
        arr.pop();
      }
      return arr;
    },
    getClassInfo(classId: string): ClassInfo | undefined {
      return this.$store.getters.classInfo(classId);
    },
  },
  watch: {
    classId() {
      this.updateSelectedClasses();
    },
    selectedClassesId() {
      this.updateSelectedClasses();
    },
  },
});
</script>

<style lang="scss" scoped>
#stats {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
  height: 100%;

  & > div {
    position: relative;
    overflow: hidden;
  }
}

#chart1 {
  height: 40%; // Required to trigger initial chart animation
  flex: 0 1 60%;
}

#chart2 {
  height: 40%;
  flex: 1 0;
}

#chart3 {
  height: 60%;
  flex: 1 1 100%;
}
</style>
