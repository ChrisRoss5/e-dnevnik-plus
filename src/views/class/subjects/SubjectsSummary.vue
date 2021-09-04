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
      <div
        v-for="(option, optionName) in options"
        :key="optionName"
        class="material-icons flex-center"
        :class="{
          'option-enabled': option.enabled,
          'option-hidden': option.hideWhenSubjectIsOpen && isOpenedSubject,
        }"
        :style="{ 'font-size': option.fontSize || '' }"
        v-tooltip="option.tooltip"
        v-wave
        @click.self="optionClicked(optionName)"
      >
        {{ option.icon }}
        <Dropdown
          v-if="optionName == 'sortSubjects'"
          :visible="sortDropdownVisible"
          :list="sortDropdownList"
          customClass="right"
          sourceElementId="options"
          @close="sortDropdownClosed"
        ></Dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Dropdown, { DropdownItem } from "@/components/Dropdown.vue";
import { Option } from "./Subjects.vue";
import { formatNum } from "@/scripts/utils";

export default defineComponent({
  name: "SubjectsSummary",
  components: {
    Dropdown,
  },
  props: {
    options: {
      type: Object as PropType<Record<string, Option>>,
      required: true,
    },
    savedOptions: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    finalGradeOriginal: Number,
    finalGrade: Number,
    isOpenedSubject: Boolean,
  },
  emits: ["optionClicked", "sortOptionClicked"],
  data() {
    return {
      sortDropdownVisible: false,
    };
  },
  methods: {
    optionClicked(optionName: string) {
      if (optionName == "sortSubjects") {
        this.sortDropdownVisible = true;
        return;
      }
      this.$emit("optionClicked", optionName);
    },
    sortDropdownClosed(rowName: string | undefined) {
      this.sortDropdownVisible = rowName == "Sortiranje povlačenjem";
      if (rowName) this.$emit("sortOptionClicked", rowName);
    },
    formatNum: (num: number): string => formatNum(num),
  },
  computed: {
    sortDropdownList(): DropdownItem[] {
      return [
        { name: "Prosjek silazno", icon: "arrow_downward" },
        { name: "Prosjek uzlazno", icon: "arrow_upward" },
        { name: "Broj ocjena silazno", icon: "arrow_downward" },
        { name: "Broj ocjena uzlazno", icon: "arrow_upward" },
        {
          name: "Sortiranje povlačenjem",
          icon: "open_with",
          active: this.savedOptions.sortByDragging,
        },
      ];
    },
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
  height: 44px;

  @include themed() {
    background: linear-gradient(
        45deg,
        transparent 55%,
        t("alice-blue-light") 65%,
        t("alice-blue") calc(65% + 10px)
      ),
      linear-gradient(
        -45deg,
        t("white-background") 65%,
        t("alice-blue-light") calc(75% - 10px),
        t("alice-blue") 75%
      );
  }
}

#final-grade-original {
  padding-left: 10px;
}

#final-grade {
  padding-left: 10px;
  margin-left: 10px;
  transition: color 150ms;

  @include themed() {
    border-left: 1px solid t("light-border-color");
  }
}

#options {
  margin-left: auto;

  & > div {
    position: relative;
    width: 24px;
    height: 24px;
    padding: 10px 10px;
    transition: background-color 150ms, opacity 150ms, color 150ms;

    &:hover {
      cursor: pointer;

      @include themed() {
        background: t("light-blue");
      }
    }
  }

  @include themed() {
    color: t("gray-blue");
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
