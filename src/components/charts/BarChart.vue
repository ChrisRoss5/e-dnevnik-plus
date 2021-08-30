<template>
  <div style="height: 100%">
    <canvas id="bar-chart"> </canvas>
    <div
      class="sort1 card material-icons flex-center"
      v-wave
      @click="sortOptionClicked(1)"
    >
      swap_horiz
    </div>
    <div
      class="sort2 card material-icons flex-center"
      v-wave
      @click="sortOptionClicked(2)"
    >
      swap_horiz
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
import { SubjectCache } from "@/store/state";
import { formatNum, numberToColorHsl } from "@/scripts/utils";

let chart: Chart<"bar", number[], string>;

interface ChartBarData {
  name: string;
  gradesCount: number;
  gradesCountEach: number[];
  average: number;
  color: string;
}

export default defineComponent({
  name: "Stats",
  props: {
    chartData: {
      type: Object as PropType<SubjectCache[]>,
      required: true,
    },
    finalAverage: { type: Number, required: true },
    finalGradesCount: { type: Number, required: true },
    gradeCountAverage: { type: Number, required: true },
  },
  mounted() {
    for (const { name, gradesByCategory } of this.chartData) {
      if (!gradesByCategory) continue;
      const gradesCountEach = [0, 0, 0, 0, 0];
      for (const row of gradesByCategory)
        for (const cell of row.grades)
          for (const grade of cell) gradesCountEach[grade - 1] += 1;
      const gradesCount = gradesCountEach.reduce((a, b) => a + b, 0);
      if (!gradesCount) continue;
      const gradesSum = gradesCountEach.reduce((a, b, i) => a + b * (i + 1), 0);
      const average = +(gradesSum / gradesCount).toFixed(2);
      const color = numberToColorHsl(((average - 1) / 4) * 100, 0.4);
      const bar = { name, gradesCount, gradesCountEach, average, color };
      this.chartBarData.push(bar);
    }
    this.createChart();
  },
  data() {
    return {
      chartBarData: [] as ChartBarData[],
      lastSortOption: 0,
    };
  },
  methods: {
    sortOptionClicked(option: number) {
      const sortProperty = option == 1 ? "gradesCount" : "average";
      const isReverse = this.lastSortOption == option;
      this.lastSortOption = isReverse ? 0 : option;
      this.chartBarData.sort((a, b) => {
        const propA = a[sortProperty];
        const propB = b[sortProperty];
        if (propA < propB) return isReverse ? 1 : -1;
        if (propA > propB) return isReverse ? -1 : 1;
        return 0;
      });
      const { data } = chart;
      data.labels = this.chartBarData.map((bar) => bar.name);
      data.datasets[0].data = this.chartBarData.map((bar) => bar.gradesCount);
      data.datasets[1].data = this.chartBarData.map((bar) => bar.average);
      chart.update();
    },
    showBarDetails(items: any) {
      console.log(items);
    },
    createChart() {
      const ctx = document.getElementById("bar-chart") as ChartItem;
      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.chartBarData.map((bar) => bar.name),
          datasets: [
            {
              label: "Broj ocjena",
              backgroundColor: "rgba(35, 86, 148, .65)",
              hoverBackgroundColor: "transparent",
              borderColor: "#2296da",
              borderWidth: 3,
              data: this.chartBarData.map((bar) => bar.gradesCount),
              yAxisID: "yAxis1",
            },
            {
              label: "Prosjek ocjena",
              backgroundColor: this.chartBarData.map((bar) => bar.color),
              hoverBackgroundColor: "transparent",
              borderColor: "#4caf50",
              borderWidth: 3,
              data: this.chartBarData.map((bar) => bar.average),
              yAxisID: "yAxis2",
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
          },
          scales: {
            yAxis1: { position: "left" },
            yAxis2: {
              position: "right",
              ticks: {
                callback: (value) => formatNum(value),
              },
            },
          },
          plugins: {
            tooltip: {
              footerFont: { weight: "normal", size: 16 },
              footerMarginTop: 10,
              footerAlign: "right",
              callbacks: {
                label: (context) => {
                  const label = " " + context.dataset.label + ": ";
                  const value = context.parsed.y;
                  const shouldParse = label.includes("Prosjek");
                  return label + (shouldParse ? formatNum(value) : value);
                },
                footer: (context) => {
                  const { dataIndex } = context[0];
                  return [
                    "Odličnih (5)",
                    "Vrlo dobrih (4)",
                    "Dobrih (3)",
                    "Dovoljnih (2)",
                    "Nedovoljnih (1)",
                  ]
                    .map((title, i) => {
                      const count =
                        this.chartBarData[dataIndex].gradesCountEach[4 - i];
                      return title + ": " + count;
                    })
                    .join("\n");
                },
              },
            },
            annotation: {
              annotations: {
                yAxis1: {
                  type: "line",
                  scaleID: "yAxis1",
                  value: this.gradeCountAverage,
                  borderColor: "#2296da",
                  borderWidth: 2,
                  borderDash: [10, 16],
                  label: {
                    enabled: true,
                    content:
                      +this.gradeCountAverage.toFixed(2) +
                      " — prosječan broj ocjena po predmetu",
                    position: "start",
                    font: { style: "normal" },
                  },
                },
                yAxis2: {
                  type: "line",
                  scaleID: "yAxis2",
                  value: this.finalAverage,
                  borderColor: "red",
                  borderWidth: 2,
                  borderDash: [10, 16],
                  label: {
                    enabled: true,
                    content:
                      "prosjek svih ocjena (" +
                      this.finalGradesCount +
                      ") — " +
                      formatNum(this.finalAverage),
                    position: "end",
                    font: { style: "normal" },
                  },
                },
              },
            },
            legend: {
              labels: { padding: 35 },
              onHover: (e) => {
                (e.native!.target as HTMLElement).style.cursor = "pointer";
              },
              onLeave: (e) => {
                (e.native!.target as HTMLElement).style.cursor = "default";
              },
            },
          },
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.sort {
  &1,
  &2 {
    position: absolute;
    font-size: 22px;
    top: 30px;
    width: 40px;
    cursor: pointer;
  }
  &1 {
    left: calc(50% - 220px);
  }
  &2 {
    right: calc(50% - 220px);
  }
}
</style>
