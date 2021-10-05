<template>
  <canvas id="line-chart"></canvas>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
import { formatNum, jsonClone } from "@/scripts/utils";

let chart: Chart<"bar" | "line", number[], string>;

export interface ChartMonthData {
  gradesCount: number;
  gradesCountEach: number[];
  average: number;
}

export default defineComponent({
  name: "LineChart",
  props: {
    lineChartData: {
      type: Object as PropType<ChartMonthData[]>,
      required: true,
    },
    finalAverage: { type: Number, required: true },
    gradeCountAveragePerMonth: { type: Number, required: true },
  },
  mounted() {
    this.createChart();
  },
  data() {
    return {
      chartData: jsonClone(this.lineChartData),
    };
  },
  methods: {
    extractMonthsData<T extends keyof ChartMonthData>(barProperty: T) {
      return this.chartData.map((bar) => bar[barProperty]);
    },
    createChart() {
      const ctx = document.getElementById("line-chart") as ChartItem;
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.getSlicedMonths(),
          datasets: [
            {
              type: "bar",
              order: 2,
              label: "Broj ocjena",
              backgroundColor: "rgba(35, 86, 148, .65)",
              hoverBackgroundColor: "transparent",
              borderColor: "#2296da",
              borderWidth: 1.2,
              data: this.extractMonthsData("gradesCount"),
              yAxisID: "yAxis1",
            },
            {
              type: "line",
              order: 1,
              label: "Prosjek ocjena",
              backgroundColor: "green",
              hoverBackgroundColor: "transparent",
              borderColor: "#4caf50",
              borderWidth: 3,
              data: this.extractMonthsData("average"),
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
          elements: {
            line: { tension: 0.25 },
            point: { radius: 5 },
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
                    .filter((g) => g)
                    .join("\n");
                },
              },
            },
            annotation: {
              annotations: {
                yAxis1: {
                  type: "line",
                  scaleID: "yAxis1",
                  value: this.gradeCountAveragePerMonth,
                  borderColor: "#2296da",
                  borderWidth: 2,
                  borderDash: [10, 16],
                  label: {
                    enabled: true,
                    content: this.getGradeCountAveragePerMonth(),
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
                },
                xAxis: {
                  drawTime: "beforeDatasetsDraw",
                  display: this.chartData.length > 4,
                  type: "line",
                  xMin: 3.5,
                  xMax: 3.5,
                },
              },
            },
            legend: {
              reverse: true,
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
      const { data, config } = chart;
      const { datasets } = data;
      const { yAxis1, yAxis2, xAxis } = config.options!.plugins!.annotation!
        .annotations as any;
      yAxis1.value = this.gradeCountAveragePerMonth;
      yAxis1.label.content = this.getGradeCountAveragePerMonth();
      yAxis2.value = this.finalAverage;
      xAxis.display = this.chartData.length > 4;
      data.labels = this.getSlicedMonths();
      datasets[0].data = this.extractMonthsData("gradesCount");
      datasets[1].data = this.extractMonthsData("average");
      chart.update();
    },
    getGradeCountAveragePerMonth(): string {
      return (
        Math.round(this.gradeCountAveragePerMonth) +
        " — prosječan broj ocjena mjesečno"
      );
    },
    getSlicedMonths(): string[] {
      return [
        "Rujan",
        "Listopad",
        "Studeni",
        "Prosinac",
        "Siječanj",
        "Veljača",
        "Ožujak",
        "Travanj",
        "Svibanj",
        "Lipanj",
      ].slice(0, this.chartData.length);
    },
  },
  watch: {
    lineChartData() {
      this.chartData = jsonClone(this.lineChartData);
      this.updateChart();
    },
  },
});
</script>