<template>
  <div>
    <div id="total-points">
      Tvoj broj bodova:
      {{ totalPoints == -1 ? "Izravan upis!" : formatNum(totalPoints) }}
    </div>
    <transition name="points">
      <div
        v-if="settings.selectedProgram"
        id="points-line"
        :style="{ background: linearBackground }"
      >
        <div
          v-for="{ type, tooltip } in boxes"
          :key="type"
          :style="getBoxStyle(type)"
          v-tooltip.bottom="tooltip"
        >
          {{ formatNum(points[type]) }}
        </div>
        <transition name="points">
          <span
            v-if="totalPoints != -1"
            id="pointer"
            :style="getBoxStyle('user')"
          ></span>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { formatNum, getSum } from "@/scripts/utils";
import { CalculatorSettings } from "@/store/state";
import highSchoolPoints from "@/assets/high-school-points/2020-2021.js";

interface Percentages {
  min: string;
  max: string;
  average: string;
  user: string;
}

export default defineComponent({
  name: "Result",
  props: {
    settings: {
      type: Object as PropType<CalculatorSettings>,
      required: true,
    },
    rows: { type: Number, required: true },
  },
  data() {
    return {
      boxes: [
        {
          type: "min",
          tooltip: "Najmanji broj bodova upisanog u program",
        },
        {
          type: "max",
          tooltip: "Najveći broj bodova upisanog u program",
        },
        {
          type: "average",
          tooltip: "Prosječan broj bodova upisanih u program",
        },
      ],
    };
  },
  methods: {
    getBoxStyle(type: keyof Percentages) {
      const left = this.percentages[type];
      const style: { left: string; transform?: string } = { left };
      let transform = "";
      if (type == "min") transform = left == "0%" ? "0%" : "-50%";
      else if (type == "max") transform = left == "100%" ? "-100%" : "-50%";
      if (transform) style.transform = "translate(" + transform + ", -50%)";
      return style;
    },
    formatNum: (num: number) => formatNum(num),
  },
  computed: {
    totalPoints(): number {
      const { selectedExtraPoints, userValues } = this.settings;
      let points = getSum(userValues.slice(0, this.rows).flat());
      if (selectedExtraPoints) {
        const extraPoints = selectedExtraPoints.match(/\d/);
        if (!extraPoints) return -1;
        points += parseInt(extraPoints[0]);
      }
      return points;
    },
    points(): { min: number; max: number; average: number } {
      const { selectedSchool, selectedProgram } = this.settings;
      if (!(selectedSchool && selectedProgram))
        return { min: 0, max: 0, average: 0 };
      const [min, max, average] =
        highSchoolPoints[selectedSchool][selectedProgram];
      return { min, max, average };
    },
    percentages(): Percentages {
      const { min, max, average } = this.points;
      if (!average) return { min: "", max: "", average: "", user: "" };
      const [_min, _max] =
        this.totalPoints <= 0
          ? [min, max]
          : [Math.min(this.totalPoints, min), Math.max(this.totalPoints, max)];
      const calc = (n: number) =>
        +(((n - _min) * 100) / (_max - _min)).toFixed(2) + "%";
      return {
        min: calc(min),
        max: calc(max),
        average: calc(average),
        user: this.totalPoints <= 0 ? "" : calc(this.totalPoints),
      };
    },
    linearBackground(): string {
      const { min, max, average, user } = this.percentages;
      let background =
        "#84FF33 " + min + "," + "green " + average + ",#84FF33 " + max;
      if (this.totalPoints > 0) {
        const [_user, _min] = [user, min].map(parseFloat);
        if (_user < _min) background = "#FF3924 0% " + min + "," + background;
        else if (_user > _min) background += ",#2296da " + max + " 100%";
      }
      return "linear-gradient(90deg," + background + ")";
    },
  },
});
</script>

<style lang="scss" scoped>
#total-points {
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 30px 0 40px;
}

#points-line {
  position: relative;
  height: 44px;
  border-radius: 8px;
  transition: opacity 350ms, height 350ms;

  & > div {
    position: absolute;
    top: 50%;
    color: $body-color-dark;
    background: $tooltip-background;
    padding: 2px 5px;
    border-radius: 8px;
    transform: translate(-50%, -50%);
  }
}

#pointer {
  position: absolute;
  top: -12px;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-radius: 8px;
  transition: left 300ms;
  transform: translateX(-50%);

  @include themed() {
    border-top: 20px solid t("body-color");
  }
}

/* transitions */

.points-enter-from,
.points-leave-to {
  opacity: 0;
  height: 0 !important;
}
</style>
