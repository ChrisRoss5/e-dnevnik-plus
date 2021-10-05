<template>
  <div id="calculator" class="card">
    <div class="title">
      Kalkulator bodova za upis u srednju školu
      <span
        id="urls"
        class="material-icons card"
        @click.self="showUrls = true"
        v-wave
      >
        link
        <Dropdown
          :visible="showUrls"
          :list="urls"
          :customClass="'right'"
          sourceElementId="urls"
          :isHttp="true"
          @close="showUrls = false"
        ></Dropdown>
      </span>
    </div>
    <div class="row">
      <div class="text">Odabrana škola:</div>
      <div id="high-school" class="button-container">
        <div class="button" @click.self="showHighSchools = true" v-wave>
          {{ settings.selectedSchool || "Odaberi" }}
        </div>
        <CustomDropdown
          :visible="showHighSchools"
          :sourceElementId="'high-school'"
          :list="highSchools"
          @close="schoolSelected"
        ></CustomDropdown>
        <span
          v-if="settings.selectedSchool"
          class="material-icons clear"
          @click="schoolSelected('clear')"
        >
          close
        </span>
      </div>
    </div>
    <div class="row">
      <div class="text">Odabrani smjer:</div>
      <div id="school-program" class="button-container">
        <div
          class="button"
          :class="{ 'disabled-button': !settings.selectedSchool }"
          @click.self="showSchoolProgram = true"
          v-wave
        >
          {{ settings.selectedProgram || "Odaberi" }}
        </div>
        <CustomDropdown
          :visible="showSchoolProgram"
          :sourceElementId="'school-program'"
          :list="schoolPrograms"
          @close="programSelected"
        ></CustomDropdown>
        <span
          v-if="settings.selectedProgram"
          class="material-icons clear"
          @click="programSelected('clear')"
        >
          close
        </span>
      </div>
    </div>
    <div class="row durations">
      <div class="text">Trajanje smjera:</div>
      <div
        v-for="(duration, key) in durations"
        :key="key"
        class="button choice-button"
        :class="{
          active: parseInt(key) == (lockedDuration ? lockedDuration : selectedDuration),
          'disabled-button': parseInt(key) != lockedDuration && settings.selectedProgram,
        }"
        @click="selectedDuration = parseInt(key)"
      >
        {{ duration }}
      </div>
    </div>
    <transition-group name="table">
      <table :key="0">
        <thead>
          <tr>
            <td>Elementi vrednovanja:</td>
            <td v-for="i in 4" :key="i">{{ i + 4 }}. razred</td>
          </tr>
        </thead>
        <tbody>
          <transition-group name="table">
            <tr v-for="(title, i) in selectedTableTitles" :key="i">
              <td>{{ title }}:</td>
              <td v-for="j in 4" :key="j">
                <div
                  v-if="!i || j > 2"
                  contenteditable="true"
                  @input="numberInputted($event, i, j - (i ? 3 : 1))"
                  @blur="editingInput = -1"
                >
                  {{ getInputNumber(i, j - (i ? 3 : 1)) }}
                </div>
                <div v-else class="disabled-button"></div>
              </td>
            </tr>
            <tr :key="0">
              <td>Dodatni bodovi:</td>
              <td id="extra-points" colspan="4">
                <div
                  class="button"
                  style="display: flex"
                  @click.self="showExtraPoints = true"
                  v-wave
                >
                  <span style="margin: 0 auto; pointer-events: none">
                    {{ settings.selectedExtraPoints || "Odaberi" }}
                  </span>
                  <span
                    v-if="settings.selectedExtraPoints"
                    class="material-icons clear"
                    @click="extraPointsSelected('clear')"
                  >
                    close
                  </span>
                </div>
                <CustomDropdown
                  :visible="showExtraPoints"
                  :sourceElementId="'extra-points'"
                  :list="extraPoints"
                  @close="extraPointsSelected"
                ></CustomDropdown>
              </td>
            </tr>
          </transition-group>
        </tbody>
      </table>
      <Result
        :key="1"
        :settings="settings"
        :rows="selectedTableTitles.length"
      ></Result>
    </transition-group>
    <Spinner :visible="loading" :size="'125px'"></Spinner>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown, { DropdownItem } from "@/components/Dropdown.vue";
import CustomDropdown from "./CustomDropdown.vue";
import Result from "./Result.vue";
import Spinner from "@/components/Spinner.vue";
import highSchoolPoints from "@/assets/high-school-points/2020-2021.js";
import { jsonClone, parseNum, setEndOfContenteditable } from "@/scripts/utils";
import { MutationTypes } from "@/store/mutations";
import { CalculatorSettings, User } from "@/store/state";
import { updateSubjects } from "@/scripts/scrapers";

export default defineComponent({
  name: "Calculator",
  components: { Dropdown, CustomDropdown, Result, Spinner },
  created() {
    this.loadUserPoints();
  },
  data() {
    return {
      loading: false,
      highSchools: Object.keys(highSchoolPoints),
      showHighSchools: false,
      showSchoolProgram: false,
      selectedDuration: 4,
      durations: {
        2: "2 godine ili manje",
        3: "3 godine ili više",
        4: "4 godine ili više",
      },
      tableTitles: [
        "Prosjek ocjena",
        "Hrvatski jezik",
        "Matematika",
        "Prvi strani jezik",
        "Prvi propisani predmet",
        "Drugi propisani predmet",
        "Treći predmet (određuje škola)",
      ],
      extraPoints: [
        "Prvo, drugo ili treće osvojeno mjesto u znanju kao pojedinac",
        "Prvo osvojeno mjesto u znanju kao član skupine (+4)",
        "Drugo osvojeno mjesto u znanju kao član skupine (+3)",
        "Treće osvojeno mjesto u znanju kao član skupine (+2)",
        "Sudjelovanje na natjecanju iz znanja kao pojedinac ili član skupine (+1)",
        "Prvo osvojeno mjesto u sportu kao član skupine (+3)",
        "Drugo osvojeno mjesto u sportu kao član skupine (+2)",
        "Treće osvojeno mjesto u sportu kao član skupine (+1)",
        "Kandidat sa zdravstvenim teškoćama (+1)",
        "Kandidat živi u otežanim uvjetima (+1)",
        "Kandidat je pripadnik romske nacionalne manjine (+2)",
      ],
      showExtraPoints: false,
      editingInput: -1,
      urls: [
        {
          name: "Upisi.hr",
          icon: "home",
          link: "https://www.upisi.hr/",
        },
        {
          name: "Upute",
          icon: "picture_as_pdf",
          link: "https://www.upisi.hr/docs/Publikacija_redoviti.pdf",
        },
        {
          name: "Tablica bodova",
          icon: "table_rows",
          link: "https://www.upisi.hr/docs/Broj_bodova_potrebnih_za_upis.pdf",
        },
      ] as DropdownItem[],
      showUrls: false,
    };
  },
  methods: {
    async loadUserPoints() {
      this.loading = true;
      const settings = jsonClone(this.settings);
      const { userValues } = settings;
      const subjects = ["hrvatski jezik", "matematika", "engleski jezik"];
      const re = /(^| ).(( ).)*( |$)/g; // Removes single characters from subject name
      for (const classInfo of this.user ? this.user.classesList : []) {
        const match = classInfo.name.match(/\d/);
        if (!match) continue;
        const studentYear = parseInt(match[0]);
        if (!(4 < studentYear && studentYear < 9)) continue;
        await updateSubjects(classInfo);
        if (classInfo.finalGrade && !userValues[0][studentYear - 5])
          userValues[0][studentYear - 5] = parseNum(classInfo.finalGrade);
        if (!(6 < studentYear && studentYear < 9)) continue;
        for (const { name, finalGrade } of classInfo.cachedSubjects!) {
          const i = subjects.indexOf(name.toLowerCase().replace(re, ""));
          if (finalGrade && i > -1 && !userValues[i + 1][studentYear - 7])
            userValues[i + 1][studentYear - 7] = finalGrade;
        }
      }
      this.updateSettings({ ...settings, userValues });
      this.loading = false;
    },
    schoolSelected(schoolName?: string) {
      this.showHighSchools = false;
      if (!schoolName) return;
      const settings = jsonClone(this.settings);
      if (schoolName == "clear")
        settings.selectedSchool = settings.selectedProgram = "";
      else {
        settings.selectedSchool = schoolName;
        if (this.schoolPrograms.length == 1) {
          this.programSelected(this.schoolPrograms[0]);
        } else {
          settings.selectedProgram = "";
          setTimeout(() => (this.showSchoolProgram = true), 150);
        }
      }
      this.updateSettings(settings);
    },
    programSelected(programName?: string) {
      this.showSchoolProgram = false;
      if (!programName) return;
      const settings = jsonClone(this.settings);
      settings.selectedProgram = programName == "clear" ? "" : programName;
      this.updateSettings(settings);
    },
    extraPointsSelected(pointsName?: string) {
      this.showExtraPoints = false;
      if (!pointsName) return;
      const settings = jsonClone(this.settings);
      settings.selectedExtraPoints = pointsName == "clear" ? "" : pointsName;
      this.updateSettings(settings);
    },
    numberInputted(e: InputEvent, i: number, j: number) {
      this.editingInput = i ? -1 : j;
      const target = e.target as HTMLElement;
      const settings = jsonClone(this.settings);
      const text = target.textContent!.slice(0, 4);
      const noData = ((text.length == 1 && !i) || i) && !e.data;
      const data = i ? e.data! : text.replace(",", ".");
      const value = noData ? 0 : parseFloat(data);
      if (2 <= value && value <= 5) settings.userValues[i][j] = value;
      else {
        settings.userValues[i][j] = 0;
        target.textContent = "";
      }
      this.updateSettings(settings);
      this.$nextTick(() => {
        if (target.textContent) {
          if (i) target.textContent = value.toString();
          else if (text.length == 1) target.textContent += ",";
          else target.textContent = text;
        }
        setEndOfContenteditable(target);
      });
    },
    getInputNumber(i: number, j: number) {
      const value = this.settings.userValues[i][j];
      if (!value) return "";
      if (i || this.editingInput == j) return value;
      const str = value.toString().slice(0, 4).replace(".", ",");
      if (str.length == 4) return str;
      return str + (str.length == 1 ? ",00" : "0");
    },
    updateSettings(newSettings: CalculatorSettings) {
      if (!this.user) return;
      this.$store.commit(MutationTypes.UPDATE_USER_SETTINGS, {
        user: this.user,
        settings: { calculatorSettings: newSettings },
      });
    },
  },
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
    schoolPrograms(): string[] {
      const { selectedSchool } = this.settings;
      if (!selectedSchool) return [];
      return Object.keys(highSchoolPoints[selectedSchool]);
    },
    lockedDuration(): number {
      const { selectedProgram } = this.settings;
      if (!selectedProgram) return 0;
      const years = parseInt(selectedProgram.match(/\d g\./)![0][0]);
      return Math.max(2, Math.min(years, 4));
    },
    selectedTableTitles(): string[] {
      const duration = this.lockedDuration || this.selectedDuration;
      if (duration == 4) return this.tableTitles;
      return this.tableTitles.slice(0, duration == 2 ? 1 : 4);
    },
    settings(): CalculatorSettings {
      return this.user
        ? this.user.settings.calculatorSettings
        : {
            selectedSchool: "",
            selectedProgram: "",
            selectedExtraPoints: "",
            userValues: [[], [], [], [], [], [], []],
          };
    },
  },
});
</script>

<style lang="scss" scoped>
#calculator {
  margin: 80px auto;
  padding: 30px;
  width: 954px;
}

#urls {
  position: relative;
  float: right;
  margin: 10px 0;
  padding: 5px 10px;
  cursor: pointer;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.row {
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.text {
  width: 150px;
  flex-shrink: 0;
  margin-right: 15px;
}

.button-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.button {
  min-height: 35px;
  height: auto;
}

.choice-button {
  color: inherit;
  margin-right: 10px;
  background: transparent !important;
  transition: color 150ms, opacity 150ms;

  @include themed() {
    border: 1px solid t("light-border-color");

    &.active {
      color: t("strong-blue");
    }
  }
}

table {
  width: 100%;
  border-radius: 8px;
  padding: 0 10px;

  @include themed() {
    border: 1px solid t("light-light-border-color");
  }

  div {
    text-align: center;
    border-radius: 8px;
    height: 35px;
    min-width: 130px;
    padding: 5px 20px;
    margin: 0 5px;
    outline: none;

    @include themed() {
      border: 1px solid t("light-border-color");
    }
  }
}

thead td:not(:first-of-type) {
  text-align: center;
}

tr {
  height: 44px;
}

tr,
.durations ~ * {
  transition: opacity 350ms, transform 350ms;
  transition-timing-function: cubic-bezier(0.47, 0.93, 0.66, 1.23);
}

.grades {
  display: flex;

  & > div {
    flex: 1;
    border: 1px solid;
    margin: 0 2px;
  }
}

#extra-points {
  position: relative;

  .button {
    background: transparent !important;

    @include themed() {
      color: t("body-color") !important;
    }
  }

  .dropdown {
    height: 200px;
  }
}

.clear {
  cursor: pointer;
}

/* transitions */

.table-enter-from,
.table-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.table-leave-active {
  position: absolute;
}
</style>
