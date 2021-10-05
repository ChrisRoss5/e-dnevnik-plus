<template>
  <canvas id="bar-chart"></canvas>
  <div id="sort-bar-chart" class="card">
    <!-- v-tooltip="'Sortiraj uzlazno/silazno prema broju ocjena/prosjeku'" -->
    <div
      class="material-icons"
      style="color: #2296da"
      @click="sortOptionClicked(1)"
      v-wave
    >
      {{
        sortByCount == true
          ? "north_east"
          : sortByCount == false
          ? "south_east"
          : "swap_horiz"
      }}
    </div>
    <div
      class="material-icons"
      style="color: #0eff00"
      @click="sortOptionClicked(2)"
      v-wave
    >
      {{
        sortByAverage == true
          ? "north_east"
          : sortByAverage == false
          ? "south_east"
          : "swap_horiz"
      }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
import { formatNum, jsonClone } from "@/scripts/utils";

let chart: Chart<"bar", number[], string>;

export interface ChartBarData {
  name: string;
  gradesCount: number;
  gradesCountEach: number[];
  average: number;
  backgroundColor: string;
  borderColor: string;
}

export default defineComponent({
  name: "BarChart",
  props: {
    barChartData: {
      type: Object as PropType<ChartBarData[]>,
      required: true,
    },
    finalAverage: { type: Number, required: true },
    finalGradesCount: { type: Number, required: true },
    gradeCountAveragePerSubject: { type: Number, required: true },
  },
  mounted() {
    this.createChart();
  },
  data() {
    return {
      chartData: jsonClone(this.barChartData),
      sortByCount: undefined as boolean | undefined, // true for ascending
      sortByAverage: undefined as boolean | undefined, // false for descending
    };
  },
  methods: {
    extractBarsData<T extends keyof ChartBarData>(barProperty: T) {
      return this.chartData.map((bar) => bar[barProperty]);
    },
    sortOptionClicked(option: number) {
      if (option == 1) {
        this.sortByCount = !this.sortByCount;
        this.sortByAverage = undefined;
      } else {
        this.sortByAverage = !this.sortByAverage;
        this.sortByCount = undefined;
      }
      this.updateChart();
    },
    sortChart() {
      let sortProperty: "gradesCount" | "average";
      let isReverse: boolean;
      if (this.sortByCount !== undefined) {
        sortProperty = "gradesCount";
        isReverse = !this.sortByCount;
      } else if (this.sortByAverage !== undefined) {
        sortProperty = "average";
        isReverse = !this.sortByAverage;
      } else return;
      this.chartData.sort((a, b) => {
        const [propA, propB] = [a[sortProperty], b[sortProperty]];
        if (propA < propB) return isReverse ? 1 : -1;
        if (propA > propB) return isReverse ? -1 : 1;
        return 0;
      });
    },
    createChart() {
      const ctx = document.getElementById("bar-chart") as ChartItem;
      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.extractBarsData("name"),
          datasets: [
            {
              label: "Broj ocjena",
              backgroundColor: "rgba(35, 86, 148, .65)",
              hoverBackgroundColor: "transparent",
              borderColor: "#2296da",
              borderWidth: 1.2,
              data: this.extractBarsData("gradesCount"),
              yAxisID: "yAxis1",
            },
            {
              label: "Prosjek ocjena",
              backgroundColor: this.extractBarsData("backgroundColor"),
              hoverBackgroundColor: "transparent",
              borderColor: this.extractBarsData("borderColor"),
              borderWidth: 1.2,
              data: this.extractBarsData("average"),
              yAxisID: "yAxis2",
            },
          ],
        },
        options: {
          interaction: {
            intersect: false,
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
                        this.chartData[dataIndex].gradesCountEach[4 - i];
                      if (!count) return false;
                      return title + ": " + count;
                    })
                    .filter(g => g)
                    .join("\n");
                },
              },
            },
            annotation: {
              annotations: {
                yAxis1: {
                  type: "line",
                  scaleID: "yAxis1",
                  value: this.gradeCountAveragePerSubject,
                  borderColor: "#2296da",
                  borderWidth: 2,
                  borderDash: [10, 16],
                  label: {
                    enabled: true,
                    content: this.getGradeCountAveragePerSubject(),
                    position: "start",
                    font: { style: "normal" },
                  },
                },
                yAxis2: {
                  type: "line",
                  scaleID: "yAxis2",
                  value: this.finalAverage,
                  borderColor: "#4caf50",
                  borderWidth: 2,
                  borderDash: [10, 16],
                  label: {
                    enabled: true,
                    content: this.getFinalGradesCount(),
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
    updateChart() {
      this.sortChart();
      const { data, config } = chart;
      const { datasets } = data;
      const { yAxis1, yAxis2 } = config.options!.plugins!.annotation!
        .annotations as any;
      yAxis1.value = this.gradeCountAveragePerSubject;
      yAxis1.label.content = this.getGradeCountAveragePerSubject();
      yAxis2.value = this.finalAverage;
      yAxis2.label.content = this.getFinalGradesCount();
      data.labels = this.extractBarsData("name");
      datasets[0].data = this.extractBarsData("gradesCount");
      datasets[1].data = this.extractBarsData("average");
      datasets[1].backgroundColor = this.extractBarsData("backgroundColor");
      datasets[1].borderColor = this.extractBarsData("borderColor");
      chart.update();
    },
    getGradeCountAveragePerSubject(): string {
      return (
        Math.round(this.gradeCountAveragePerSubject) +
        " — prosječan broj ocjena po predmetu"
      );
    },
    getFinalGradesCount(): string {
      return (
        "prosjek svih ocjena (" +
        this.finalGradesCount +
        ") — " +
        formatNum(this.finalAverage)
      );
    },
  },
  watch: {
    barChartData() {
      this.chartData = jsonClone(this.barChartData);
      this.updateChart();
    },
  },
});
</script>

<style lang="scss" scoped>
#sort-bar-chart {
  position: absolute;
  font-size: 22px;
  top: 10px;
  right: 5px;
  display: flex;
  width: 140px;
  cursor: pointer;

  & > div {
    flex: 1;
    text-align: center;
    border-radius: inherit;
  }
}
</style>
