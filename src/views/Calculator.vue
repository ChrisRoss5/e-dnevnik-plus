<template>
  <div id="calculator" class="card">
    <div class="title">Kalkulator bodova za upis u srednju školu</div>
    <div class="row">
      <div class="text">Odabrana škola:</div>
      <div
        id="high-school"
        class="button"
        @click="showHighSchools = true"
      >
        Odaberi
        <Dropdown
          :visible="showHighSchools"
          sourceElementId="high-school"
          @close="showHighSchools = false"
        >
          <div v-for="(school, i) in highSchools" :key="i">{{ school }}</div>
        </Dropdown>
      </div>
    </div>
    <div class="row">
      <div class="text">Odabrani smjer:</div>
      <div
        class="button disabled-button"
        @click="showSchoolProgram = true"
      >
        Odaberi
      </div>
      <Dropdown
        :visible="showSchoolProgram"
        :list="dropdown"
        customClass="user-dropdown"
        sourceElementId="user"
        @close="dropdownClosed"
      ></Dropdown>
    </div>
    <div class="row durations">
      <div class="text">Trajanje smjera:</div>
      <div
        v-for="(duration, i) in durations"
        :key="i"
        class="button duration"
        :class="{ active: duration == selectedDuration }"
        @click="selectedDuration = duration"
      >
        {{ duration }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown from "@/components/Dropdown.vue";
import highSchoolPoints from "@/assets/high-school-points/2019.json";

export default defineComponent({
  name: "Calculator",
  components: { Dropdown },
  data() {
    return {
      durations: [
        "4 godine ili više",
        "3 godine ili više",
        "2 godine ili manje",
      ],
      selectedDuration: "4 godine ili više",
      highSchools: Object.keys(highSchoolPoints),
      showHighSchools: false,
      showSchoolProgram: false,
      selectedSchool: "",
      selectedProgram: "",
    };
  },
});
</script>

<style lang="scss" scoped>
#calculator {
  margin: 80px auto;
  padding: 30px;
  width: 954px;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.text {
  width: 150px;
  margin-right: 15px;
}

.dropdown {
  left: 150px;
  right: 0;
  min-width: unset;
  max-height: 400px;
  overflow: auto;
}

.duration {
  color: inherit;
  margin-right: 10px;
  background: transparent !important;
  transition: border 150ms, color 150ms;

  @include themed() {
    border: 1px solid t("light-border-color");

    &:not(.active):hover {
      border: 1px solid t("light-blue");
    }

    &.active {
      color: t("strong-blue");
    }
  }
}
</style>
