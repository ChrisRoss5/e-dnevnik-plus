<template>
  <div id="subjects">
    <div id="summary" class="card">
      <div class="flex-center">
        Završna ocjena:
        <div
          id="final-grade"
          v-tooltip.top-start="{
            content:
              'Prosjek svih zaključnih ocjena (završni uspjeh).<br>Ako ocjena iz nekog predmeta nije zaključena, zaokružuje se aritmetička sredina.',
            html: true,
          }"
        >
          {{ finalGrade }}
        </div>
        <transition name="opacity">
          <div
            v-if="finalGrade != finalGradeReal"
            id="final-grade-real"
            v-tooltip.top-start="{
              content:
                'Prosjek kakav bi bio da su sve zaključne ocjene proizašle iz zaokružene aritmetičke sredine.',
              html: true,
            }"
            :style="{ color: finalGrade < finalGradeReal ? 'green' : 'red' }"
          >
            <transition :name="finalGradeTransition" mode="out-in">
              <div :key="finalGradeReal">
                {{ finalGradeReal }}
              </div>
            </transition>
          </div>
        </transition>
      </div>
      <div id="options" class="flex-center">
        <span
          v-for="(option, i) in options"
          :key="i"
          class="material-icons flex-center"
          :class="{ 'option-enabled': option.enabled }"
          :style="{ 'font-size': option.fontSize || '24px' }"
          v-tooltip="option.tooltip"
          v-wave
          @click="optionClicked(option)"
          >{{ option.icon }}</span
        >
      </div>
    </div>
    <SlickList
      id="subjects-list"
      v-model:list="subjects"
      axis="xy"
      :lockOffset="0"
      :lockToContainerEdges="true"
      :distance="5"
    >
      <SlickItem
        v-for="(subject, i) in subjects"
        :key="i"
        :index="i"
        class="subject card"
      >
        <div class="subject-head">
          <div class="subject-info" @wheel="onSubjectInfoWheel">
            <div class="subject-name">{{ subject.name }}</div>
            <div class="teacher">{{ subject.teacher }}</div>
          </div>
          <div class="grade-count">
            {{ getGradesCount(subject.gradeCount) }}
          </div>
          <div class="grade-avg flex-center" contenteditable="true">
            {{ subject.gradeAvg }}
          </div>
        </div>
        <transition name="subject-colors">
          <div v-if="savedOptions.subjectColors" class="subject-colors"></div>
        </transition>
      </SlickItem>
    </SlickList>

    <!-- SUBJECT -->
    <router-view v-slot="{ Component }">
      <transition name="opacity">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SlickList, SlickItem } from "vue-slicksort";
import { updateSubjects } from "@/scripts/scrapers";
import { User, ClassInfo } from "@/store/state";

/* import Spinner from "@/components/Spinner.vue";
 */

export default defineComponent({
  name: "Subjects",
  components: { SlickList, SlickItem /* Spinner */ },
  props: { classURL: String },
  emits: ["sectionLoaded"],
  created() {
    this.updateSubjects();
  },
  data() {
    return {
      savedOptions: {
        subjectColors: false,
      },
      options: [
        {
          icon: "unfold_more",
          tooltip: "Otvori sve tablice",
        },
        {
          icon: "zoom_in",
          tooltip: "Povećaj prikaz",
        },
        {
          icon: "zoom_out",
          tooltip: "Smanji prikaz",
        },
        {
          icon: "border_color",
          tooltip: "Prikaži boje ocjena",
          fontSize: "19px",
          name: "subjectColors",
        },
        {
          icon: "functions",
          tooltip: "Zbroji zaključne ocjene",
        },
        {
          icon: "import_export",
          tooltip: "Sortiraj predmete",
        },
        {
          icon: "sync",
          tooltip: "Ažuriraj sve ocjene",
        },
      ],
      subjects: [
        {
          name: "Matematika",
          teacher: "Jelena Kovre",
          gradeCount: 5,
          gradeAvg: 4.18,
        },
        {
          name: "Matematika",
          teacher: "Jelena Kovre",
          gradeCount: 5,
          gradeAvg: 4.18,
        },
        {
          name: "Matematika",
          teacher: "Jelena Kovre",
          gradeCount: 5,
          gradeAvg: 4.18,
        },
        {
          name: "Matematika",
          teacher: "Jelena Kovreeeeeeeeeeeee",
          gradeCount: 5,
          gradeAvg: 4.18,
        },
        {
          name: "Matematikaeeeeeee",
          teacher: "Jelena Kovre",
          gradeCount: 5,
          gradeAvg: 4.18,
        },
      ],
      finalGradeTransition: "",
    };
  },
  methods: {
    async updateSubjects() {
      if (!this.classURL) return;
      //getSubjects(this.openedClassInfo);
    },
    optionClicked(option: Record<string, any>) {
      switch (option.tooltip) {
        case "Prikaži boje ocjena":
          this.savedOptions.subjectColors = option.enabled = !option.enabled;
          break;
      }
    },
    getGradesCount(count: number): string {
      const lastDig = parseInt(count.toString().slice(-1));
      const isPlural = (count < 5 || 20 < count) && 1 < lastDig && lastDig < 5;
      return count + " " + (isPlural ? "ocjene" : "ocjena");
    },
    onSubjectInfoWheel(e: WheelEvent) {
      const path = ((e as any).path ||
        (e.composedPath && e.composedPath()) ||
        []) as HTMLElement[];
      const target = path.find((el) => el.className == "subject-info");
      if (!target) return;
      const toLeft = e.deltaY < 0 && target.scrollLeft > 0;
      const toRight =
        e.deltaY > 0 &&
        target.scrollLeft < target.scrollWidth - target.clientWidth;
      if (toLeft || toRight) {
        e.preventDefault();
        target.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    },
  },
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
    openedClassInfo(): ClassInfo | undefined {
      return this.$store.getters.classInfo(this.classURL || "");
    },
    finalGrade(): string {
      return "5,00";
    },
    finalGradeReal(): string {
      return "5,00";
    },
  },
  watch: {
    classURL() {
      this.updateSubjects();
    },
  },
});
</script>

<style lang="scss" scoped>
#subjects {
  display: flex;
  flex-wrap: wrap;
}

#summary {
  flex: 1 1 100%;
  display: flex;
  font-size: 24px;
  padding: 0 30px;
  margin-bottom: 40px;
  color: $main-color;
  background: linear-gradient(
      45deg,
      transparent 55%,
      #e3eaf1 65%,
      aliceblue calc(65% + 10px)
    ),
    linear-gradient(-45deg, white 65%, #e3eaf1 calc(75% - 10px), aliceblue 75%);
}

#final-grade {
  padding-left: 10px;
}

#final-grade-real {
  border-left: 1px solid darkgray;
  padding-left: 10px;
  margin-left: 10px;
}

#options {
  color: $user-color;
  margin-left: auto;

  & > span {
    width: 24px;
    height: 24px;
    padding: 10px 10px;
    transition: background-color 150ms;

    &:hover {
      cursor: pointer;
      background: #dfebf5;
    }
  }
}

.option-enabled {
  color: $navbar-selected-text-color;
}

#subjects-list {
  flex: 1 1 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  /* gap: 10px 20px; replaced by margin because of sorting flicker */
}

.subject {
  display: flex;
  flex-direction: column;
  min-height: 44px;
  max-height: 44px;
  background: white;
  margin: 5px 10px;
  white-space: nowrap;
  overflow: hidden;
}

.subject-head {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.subject-info {
  display: flex;
  max-width: 50%;
  overflow-x: auto;
  margin-left: 30px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.subject-name {
  color: $main-color;
  font-weight: bold;
}

.teacher,
.grade-count {
  color: $light-gray-text;
  border-left: 1px solid #c3cfdd;
  padding-left: 15px;
  margin-left: 15px;
}

.grade-count {
  padding-right: 15px;
}

.grade-avg {
  height: 100%;
  width: 75px;
  border-left: 1px solid #c3cfdd;
  border-radius: 8px;
  margin-left: auto;
  text-align: center;
  box-shadow: 0 0 5px #cacccc;
  clip-path: inset(1px 1px 1px -5px);
  outline: none;
}

.subject-colors {
  height: 4px;
  background: red;
  transition: opacity 500ms, transform 500ms;
  transform-origin: left;
}

/* transitions */

.subject-colors-enter-from,
.subject-colors-leave-to {
  opacity: 0;
  transform: scaleX(0);
}
</style>
