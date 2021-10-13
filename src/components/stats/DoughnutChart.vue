<template>
  <canvas id="doughnut-chart"></canvas>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
import { getGradesColors } from "@/scripts/utils";

let chart: Chart<"doughnut", number[], string>;

export type DoughnutChartData = number[];

export default defineComponent({
  name: "DoughnutChart",
  props: {
    doughnutChartData: {
      type: Array as PropType<DoughnutChartData>,
      required: true,
    },
    finalGradesCount: { type: Number, required: true },
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      const ctx = document.getElementById("doughnut-chart") as ChartItem;
      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [
            "Nedovoljnih",
            "Dovoljnih",
            "Dobrih",
            "Vrlo dobrih",
            "Odličnih",
          ],
          datasets: [
            {
              data: this.doughnutChartData,
              backgroundColor: getGradesColors(0.4),
              borderColor: getGradesColors(),
              hoverBackgroundColor: "transparent",
              borderWidth: 1.2,
            },
          ],
        },
        options: {
          layout: {
            padding: {
              top: 35,
              left: 30,
              bottom: 5,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (data) => {
                  return data[0].label + " (" + (data[0].dataIndex + 1) + "): ";
                },
                label: (dataset) => {
                  const { parsed } = dataset;
                  const perc = Math.round(
                    (parsed / this.finalGradesCount) * 100,
                  );
                  return " " + parsed + " (" + perc + "%)";
                },
              },
            },
            legend: {
              position: "right",
              labels: { padding: 20 },
              reverse: true,
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
  watch: {
    doughnutChartData() {
      chart.data.datasets[0].data = this.doughnutChartData;
      chart.update();
    },
  },
});
</script>