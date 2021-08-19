<template>
  <div id="summary" class="card">
    <div class="flex-center">
      Završna ocjena:
      <div
        id="final-grade-original"
        v-tooltip.top-start="{
          content:
            'Prosjek svih zaključnih ocjena (završni uspjeh).<br>' +
            'Ako ocjena iz predmeta nije zaključena, zaokružuje se prosjek.' +
            '<br>Ako predmet nema ocjena, ne uračunava se u ovaj prosjek.',
          html: true,
        }"
      >
        {{ formatNum(finalGradeOriginal) }}
      </div>
      <transition name="opacity">
        <div
          v-if="finalGradeOriginal != finalGrade && !isNaN(finalGrade)"
          v-tooltip.top-start="{
            content:
              'Prosjek zaokruženih prosjeka.' +
              '<br>Ako predmet nema ocjena, ne uračunava se u ovaj prosjek.',
            html: true,
          }"
        >
          <div
            id="final-grade"
            :style="{
              color: finalGradeOriginal < finalGrade ? 'green' : 'red',
            }"
          >
            {{ formatNum(finalGrade) }}
          </div>
        </div>
      </transition>
    </div>
    <div id="options" class="flex-center">
      <span
        v-for="(option, optionName) in options"
        :key="optionName"
        class="material-icons flex-center"
        :class="{
          'option-enabled': option.enabled,
          'option-hidden': option.hideWhenSubjectIsOpen && openedSubject,
        }"
        :style="{ 'font-size': option.fontSize || '' }"
        v-tooltip="option.tooltip"
        v-wave
        @click="$emit('optionClicked', optionName, option)"
      >
        {{ option.icon }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { formatNum } from "@/scripts/utils";
import { defineComponent, PropType } from "vue";
import { Option } from "./Subjects.vue";

export default defineComponent({
  name: "SubjectsSummary",
  props: {
    options: {
      type: Object as PropType<Record<string, Option>>,
      required: true,
    },
    finalGradeOriginal: Number,
    finalGrade: Number,
    openedSubject: Boolean,
  },
  emits: ["optionClicked"],
  methods: {
    formatNum: (num: number): string => formatNum(num),
  },
});
</script>

<style lang="scss" scoped>
#summary {
  flex: 1 1 100%;
  display: flex;
  font-size: 24px;
  padding: 0 30px;
  margin: 0 10px 30px;
  color: $main-color;
  background: linear-gradient(
      45deg,
      transparent 55%,
      #e3eaf1 65%,
      aliceblue calc(65% + 10px)
    ),
    linear-gradient(-45deg, white 65%, #e3eaf1 calc(75% - 10px), aliceblue 75%);
}

#final-grade-original {
  padding-left: 10px;
}

#final-grade {
  border-left: 1px solid $light-border-color;
  padding-left: 10px;
  margin-left: 10px;
  transition: color 150ms;
}

#options {
  color: $user-color;
  margin-left: auto;

  & > span {
    width: 24px;
    height: 24px;
    padding: 10px 10px;
    transition: background-color 150ms, opacity 150ms, color 150ms;

    &:hover {
      cursor: pointer;
      background: #dfebf5;
    }
  }
}

.option-enabled {
  color: $navbar-selected-text-color;
}

.option-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
