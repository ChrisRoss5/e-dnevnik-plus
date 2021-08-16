<template>
  <div id="subjects">
    <div id="summary" class="card">
      <div class="flex-center">
        Završna ocjena:
        <div
          id="final-grade-original"
          v-tooltip.top-start="{
            content:
              'Prosjek svih zaključnih ocjena (završni uspjeh).<br>' +
              'Ako ocjena iz predmeta nije zaključena, zaokružuje se aritmetička sredina.' +
              '<br>Ako predmet nema ocjena, ne uračunava se u prosjek.',
            html: true,
          }"
        >
          {{ formatNum(finalGradeOriginal) }}
        </div>
        <transition name="opacity">
          <div
            v-if="finalGradeOriginal != finalGrade && !isNaN(finalGrade)"
            v-tooltip.top-start="{
              content: 'Prosjek zaokruženih aritmetičkih sredina.',
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
      :class="{ sorting: subjectsSorting }"
      :style="{
        'grid-template-columns':
          'repeat(' +
          (openedSubject ? 1 : savedOptions.zoom) +
          ',minmax(0, 1fr))',
      }"
      v-model:list="subjects"
      axis="xy"
      helperClass="dragged-subject"
      :lockOffset="15"
      :lockToContainerEdges="true"
      :distance="5"
      @sort-start="subjectsSortingEvent(true)"
      @sort-end="subjectsSortingEvent(false)"
      @sort-cancel="subjectsSortingEvent(false)"
      @update:list="subjectsOrderChanged"
    >
      <SlickItem
        v-for="(subject, i) in subjects"
        :key="i"
        :index="i"
        class="subject"
        :class="{
          'expanded-keep': subject.expandedKeep && !subject.isOpened,
          'is-opened': subject.isOpened,
        }"
        @mouseenter="subjectMouseEnter($event, subject)"
        @mouseleave="subjectMouseLeave(subject)"
      >
        <div
          class="subject-head card"
          :style="{ 'margin-bottom': subject.marginBottom }"
        >
          <transition name="opacity">
            <span
              v-if="isSubjectEdited(subject)"
              class="material-icons subject-warning"
              v-tooltip="'Klikni za poništavanje promjena'"
              @click="revertSubject(subject)"
            >
              priority_high
            </span>
          </transition>
          <transition name="opacity">
            <div
              v-if="
                subject.finalGrade &&
                subject.finalGrade != Math.round(subject.gradesAvgOriginal)
              "
              class="material-icons subject-diff"
              v-tooltip.top-start="
                subject.finalGrade > Math.round(subject.gradesAvgOriginal)
                  ? 'Zaključena je ocjena veća od zaokruženog prosjeka.'
                  : 'Zaključena je ocjena manja od zaokruženog prosjeka.'
              "
              :style="{
                color:
                  subject.finalGrade > Math.round(subject.gradesAvgOriginal)
                    ? 'green'
                    : 'red',
              }"
            >
              {{
                subject.finalGrade > Math.round(subject.gradesAvgOriginal)
                  ? "arrow_upward"
                  : "arrow_downward"
              }}
            </div>
          </transition>
          <div class="subject-info" @wheel="onSubjectInfoWheel">
            <router-link
              :to="getSubjectUrl(subject.url)"
              class="subject-name"
              :class="{ active: subject.isOpened }"
              >{{ subject.name }}</router-link
            >
            <div class="teachers">{{ subject.teachers }}</div>
          </div>
          <div class="grade-count">
            {{
              subject.gradesCount ||
              getSubjectGradesCount(subject, subject.gradesByCategory)
            }}
          </div>
          <div
            class="grade-avg flex-center"
            contenteditable="true"
            @input="avgInputted($event, subject)"
            @focus="avgFocusChanged"
            @blur="avgFocusChanged"
            :style="{ color: getSubjectAvgColor(subject) }"
            :title="subject.gradesAvgOriginal"
          >
            {{ formatNum(getSubjectAvgText(subject)) }}
          </div>
          <transition name="subject-colors">
            <div
              v-if="savedOptions.subjectColors"
              class="line-colors"
              :style="{ background: subject.lineColors }"
            ></div>
          </transition>
        </div>
        <transition name="subject-body">
          <div
            v-show="subject.expanded || subject.expandedKeep"
            class="subject-body card"
            :ref="subject.url + 'body'"
          >
            <template
              v-if="subject.gradesByCategory && subject.gradesByCategory.length"
            >
              <transition name="subject-colors">
                <div
                  v-if="savedOptions.subjectColors"
                  class="column-colors"
                  :style="{ background: subject.columnColors }"
                ></div>
              </transition>
              <table>
                <thead>
                  <tr>
                    <td>
                      <div
                        class="pin-subject"
                        :class="{ pinned: subject.expandedKeep }"
                        @click="expandSubject(subject, !subject.expandedKeep)"
                      >
                        <span class="material-icons"> keyboard_capslock </span>
                        Zadrži
                      </div>
                    </td>
                    <td>IX</td>
                    <td>X</td>
                    <td>XI</td>
                    <td>XII</td>
                    <td>I</td>
                    <td>II</td>
                    <td>III</td>
                    <td>IV</td>
                    <td>V</td>
                    <td>VI</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in subject.gradesByCategory" :key="i">
                    <td v-tooltip="row.name" :key="tooltipKey">
                      {{ row.name }}
                    </td>
                    <td
                      v-for="(grades, j) in row.grades"
                      :key="j"
                      contenteditable="true"
                      @input="
                        gradeInputted(
                          $event,
                          subject,
                          subject.gradesByCategoryOriginal[i].grades[j].slice(),
                          grades,
                        )
                      "
                      v-html="
                        getCellGrades(
                          subject.gradesByCategoryOriginal[i].grades[j].slice(),
                          grades.slice(),
                        )
                      "
                    ></td>
                  </tr>
                  <tr>
                    <template v-if="subject.finalGrade">
                      <td>Zaključena ocjena</td>
                      <td colspan="10" style="font-weight: bold">
                        {{ formatGradeText(subject.finalGrade) }}
                      </td>
                    </template>
                    <template v-else-if="subject.lastNote">
                      <td
                        v-tooltip="'Zadnja bilješka'"
                        style="text-align: center"
                      >
                        {{ subject.lastNote.date }}
                      </td>
                      <td
                        :colspan="subject.lastNote.grade ? 9 : 10"
                        class="last-note"
                      >
                        {{ subject.lastNote.note }}
                      </td>
                      <td v-if="subject.lastNote.grade">
                        {{ subject.lastNote.grade }}
                      </td>
                    </template>
                    <td v-else colspan="11">Predmet nema bilješke.</td>
                  </tr>
                </tbody>
              </table>
            </template>
            <div v-else class="no-grades" style="text-align: center">
              Predmet nema ocjena.
            </div>
          </div>
        </transition>
      </SlickItem>
    </SlickList>

    <!-- SUBJECT -->
    <router-view v-slot="{ Component }" :subject="openedSubject">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SlickList, SlickItem } from "vue-slicksort";
import { updateSubjects } from "@/scripts/scrapers";
import { User, ClassInfo, SubjectCache, GradesByCategory } from "@/store/state";
import {
  formatGradeText,
  formatNum,
  getSubjectColors,
  setEndOfContenteditable,
} from "@/scripts/utils";

export interface ExtendedSubjectCache extends SubjectCache {
  expanded: boolean;
  expandedKeep: boolean;
  marginBottom: string;
  gradesByCategoryOriginal: GradesByCategory[];
  gradesCount?: number;
  gradesAvg?: number;
  gradesAvgEdited?: number;
  gradesAvgOriginal: number;
  lineColors?: string;
  columnColors?: string;
  isOpened?: boolean;
}

interface Option {
  icon: string;
  tooltip: string;
  name: string;
  fontSize?: string;
  enabled?: boolean;
}

export default defineComponent({
  name: "Subjects",
  components: { SlickList, SlickItem /* Spinner */ },
  props: { classId: String },
  /* emits: ["sectionLoading", "sectionLoaded"], */ // todo: FIX TS ERROR ???
  created() {
    this.updateSubjects();
  },
  mounted() {
    this.$nextTick(this.checkActiveSubject);
  },
  data() {
    return {
      tooltipKey: 1,
      savedOptions: {
        zoom: 2,
        subjectColors: true,
      },
      options: [
        {
          icon: "unfold_more",
          tooltip: "Otvori sve tablice",
          enabled: false,
          name: "expandTables",
        },
        {
          icon: "zoom_in",
          tooltip: "Povećaj prikaz",
          name: "zoomIn",
        },
        {
          icon: "zoom_out",
          tooltip: "Smanji prikaz",
          name: "zoomOut",
        },
        {
          icon: "border_color",
          tooltip: "Prikaži boje ocjena",
          fontSize: "19px",
          name: "subjectColors",
          enabled: false,
        },
        {
          icon: "functions",
          tooltip: "Zbroji zaključne ocjene",
          name: "countAvgs",
        },
        {
          icon: "swap_vert",
          tooltip: "Sortiraj predmete",
          name: "sortSubjects",
        },
        {
          icon: "sync",
          tooltip: "Ažuriraj sve ocjene",
          name: "updateSubjects",
        },
      ] as Option[],
      subjects: [] as ExtendedSubjectCache[],
      subjectsLoading: false,
      subjectsSorting: false,
      openedSubject: false as ExtendedSubjectCache | false,
      finalGradeOriginal: 0,
    };
  },
  methods: {
    async updateSubjects(forceUpdate?: true) {
      if (!this.openedClassInfo || this.subjectsLoading) return;
      this.$emit("sectionLoading");
      this.subjectsLoading = true;
      //if (!(await updateSubjects(this.openedClassInfo, forceUpdate))) return;
      this.subjectsLoading = false;
      this.$emit("sectionLoaded");
      this.resetSubjects();
    },
    resetSubjects() {
      const cached =
        this.openedClassInfo && this.openedClassInfo.cachedSubjects;
      if (!cached || !cached.length) return;
      this.subjects = cached.map((subject) => ({
        ...subject,
        gradesByCategoryOriginal: JSON.parse(
          JSON.stringify(subject.gradesByCategory || []),
        ),
      })) as ExtendedSubjectCache[];
      this.finalGradeOriginal = this.getFinalGradeOriginal();
    },
    subjectMouseEnter(e: MouseEvent, subject: ExtendedSubjectCache) {
      if (this.openedSubject) return;
      const target = e.target as HTMLElement;
      setTimeout(() => (subject.expanded = target.matches(":hover")), 150);
    },
    subjectMouseLeave(subject: ExtendedSubjectCache) {
      subject.expanded = false;
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
    subjectsSortingEvent(started: boolean) {
      this.subjectsSorting = started;
    },
    subjectsOrderChanged() {
      this.tooltipKey += 1; // todo: fix tooltip reactivity bug (temp. fixed)
    },
    expandSubject(subject: ExtendedSubjectCache, expand: boolean) {
      subject.expandedKeep = expand;
      this.$nextTick(() => {
        const subjectBody = this.$refs[subject.url + "body"] as HTMLElement;
        const margin = expand ? subjectBody.offsetHeight + "px" : "0px";
        subject.marginBottom = margin;
      });
    },
    optionClicked(option: Option) {
      if (option.enabled !== undefined) option.enabled = !option.enabled;
      const enabled = option.enabled || false;
      switch (option.name) {
        case "expandTables":
          this.subjects.forEach((s) => this.expandSubject(s, enabled));
          break;
        case "zoomIn":
          this.savedOptions.zoom -= 1;
          break;
        case "zoomOut":
          this.savedOptions.zoom += 1;
          break;
        case "subjectColors":
          this.savedOptions.subjectColors = enabled;
          break;
      }
      this.savedOptions.zoom = Math.min(
        Math.max(this.savedOptions.zoom, 1),
        this.subjects.length,
      );
    },
    gradeInputted(
      e: InputEvent,
      subject: ExtendedSubjectCache,
      originalGrades: number[],
      grades: number[],
    ) {
      const target = e.target as HTMLElement;
      const clone = target.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[contenteditable]").forEach((el) => el.remove());
      const _grades = (clone.textContent as string).match(/[1-5]/g) || [];
      target.innerHTML = this.getCellGrades(originalGrades, grades.slice());
      grades.length = 0;
      grades.push(..._grades.map(Number));
      subject.gradesAvgEdited = undefined;
      this.getSubjectGradesAvg(subject, subject.gradesByCategory);
      this.$nextTick(() => target && setEndOfContenteditable(target));
    },
    getCellGrades(originalGrades: number[], grades: number[]): string {
      const sharedGrades: string[] = [];
      for (let i = 0; i < originalGrades.length; i++) {
        const idx = grades.indexOf(originalGrades[i]);
        if (idx == -1) continue;
        sharedGrades.push("<span>" + originalGrades[i] + "</span>");
        grades.splice(idx, 1);
        originalGrades.splice(i, 1);
        i -= 1; // nosonar
      }
      return [
        ...originalGrades.map(
          (grade) =>
            "<span style='color: gray; text-decoration: line-through' " +
            ("contenteditable='false'>" + grade + "</span>"),
        ),
        ...sharedGrades,
        ...grades.map(
          (grade) => "<span style='color: red'>" + grade + "</span>",
        ),
      ].join(", ");
    },
    avgInputted(e: InputEvent, subject: ExtendedSubjectCache) {
      const target = e.target as HTMLElement;
      if (e.data && /[1-5]/.test(e.data)) {
        subject.gradesAvgEdited = parseInt(e.data);
      } else {
        subject.gradesAvgEdited = NaN;
        target.textContent = "";
      }
      target.textContent = target.textContent!.slice(0, 4);
      this.$nextTick(() => target && setEndOfContenteditable(target));
    },
    avgFocusChanged(e: FocusEvent) {
      const target = e.target as HTMLElement;
      if (e.type == "focus" && target.textContent == "—")
        target.textContent = "";
      else if (e.type == "blur" && !target.textContent)
        target.textContent = "—";
    },
    getSubjectGradesCount(
      subject: ExtendedSubjectCache,
      gradesByCategory?: GradesByCategory[],
      original?: boolean,
    ): number {
      const gradesCount = (gradesByCategory || []).reduce((a, row) => {
        return a + row.grades.flat().length;
      }, 0);
      if (this.savedOptions.subjectColors)
        this.updateSubjectColors(subject, gradesCount);
      if (!original) subject.gradesCount = gradesCount;
      return gradesCount;
    },
    getSubjectGradesAvg(
      subject: ExtendedSubjectCache,
      gradesByCategory?: GradesByCategory[],
      original?: boolean,
    ): number {
      const gradesAvg =
        (gradesByCategory || []).reduce((a, row) => {
          return a + row.grades.flat().reduce((b, grade) => b + grade, 0);
        }, 0) / this.getSubjectGradesCount(subject, gradesByCategory, original);
      if (!original) subject.gradesAvg = gradesAvg;
      else subject.gradesAvgOriginal = gradesAvg;
      return gradesAvg;
    },
    getSubjectAvgText(subject: ExtendedSubjectCache): number {
      return subject.gradesAvgEdited === undefined
        ? subject.gradesAvg ||
            this.getSubjectGradesAvg(subject, subject.gradesByCategory)
        : subject.gradesAvgEdited;
    },
    getFinalGradeOriginal(): number {
      const subjectsWithGrades = this.subjects.filter((subject) => {
        const params = [subject, subject.gradesByCategoryOriginal, true];
        return (this.getSubjectGradesCount as any)(...params);
      });
      return (
        subjectsWithGrades.reduce((a, subject) => {
          const params = [subject, subject.gradesByCategoryOriginal, true];
          const avg = (this.getSubjectGradesAvg as any)(...params);
          return a + (subject.finalGrade || Math.round(avg));
        }, 0) / subjectsWithGrades.length
      );
    },
    isSubjectEdited(subject: ExtendedSubjectCache): boolean {
      const current = this.mapSubjectGrades(subject.gradesByCategory || []);
      const original = this.mapSubjectGrades(
        subject.gradesByCategoryOriginal || [],
      );
      return (
        subject.gradesAvgEdited !== undefined ||
        JSON.stringify(current) != JSON.stringify(original)
      );
    },
    mapSubjectGrades(grades: GradesByCategory[]): number[][][] {
      return grades.map((row) => row.grades.map((cell) => [...cell].sort())); // nosonar
    },
    revertSubject(subject: ExtendedSubjectCache) {
      subject.gradesAvgEdited = undefined;
      subject.gradesByCategory = JSON.parse(
        JSON.stringify(subject.gradesByCategoryOriginal),
      );
      this.getSubjectGradesAvg(subject, subject.gradesByCategory);
    },
    getSubjectAvgColor(subject: ExtendedSubjectCache): string {
      const avg = subject.gradesAvgEdited || subject.gradesAvg;
      if (!avg || avg == subject.gradesAvgOriginal) return "";
      if (avg < subject.gradesAvgOriginal) return "red";
      return "green";
    },
    updateSubjectColors(subject: ExtendedSubjectCache, totalCount: number) {
      const counts = [0, 0, 0, 0, 0];
      const cols = [[], [], [], [], [], [], [], [], [], []] as number[][];
      for (let i = 0; i < (subject.gradesByCategory || []).length; i++) {
        const row = subject.gradesByCategory![i].grades;
        for (let j = 0; j < row.length; j++) {
          for (const grade of row[j]) {
            cols[j].push(grade);
            counts[grade - 1] += 1;
          }
        }
      }
      subject.lineColors = getSubjectColors(counts, totalCount);
      subject.columnColors = getSubjectColors(cols);
    },
    getSubjectUrl(path: string): string {
      const match = path.match(/\d+/);
      const fullPath = this.$route.path.replace(/\/(\d+)?$/, "");
      return fullPath + "/" + (match ? match[0] : "");
    },
    checkActiveSubject() {
      const subjectId = this.$route.params.subjectId as string;
      for (const subject of this.subjects) {
        this.subjectMouseLeave(subject);
        const isOpened = !!subjectId && subject.url.includes(subjectId);
        subject.isOpened = isOpened;
      }
      this.openedSubject = this.subjects.find((s) => s.isOpened) || false;
    },
    formatNum: (num: number): string => formatNum(num),
    formatGradeText: (num: number): string => formatGradeText(num),
  },
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
    openedClassInfo(): ClassInfo | undefined {
      return this.$store.getters.classInfo(this.classId || "");
    },
    allSubjectsExpanded(): boolean {
      return this.subjects.every((subject) => subject.expandedKeep);
    },
    finalGrade(): number {
      const subjectsWithGrades = this.subjects.filter((subject) => {
        return (
          (subject.gradesAvgEdited && !isNaN(subject.gradesAvgEdited)) ||
          (subject.gradesAvg && !isNaN(subject.gradesAvg))
        );
      });
      return (
        subjectsWithGrades.reduce((a, subj) => {
          return a + Math.round((subj.gradesAvgEdited || subj.gradesAvg)!);
        }, 0) / subjectsWithGrades.length
      );
    },
  },
  watch: {
    $route() {
      this.checkActiveSubject();
    },
    classId(to, from) {
      from && this.updateSubjects();
    },
    allSubjectsExpanded(newVal) {
      this.options[0].enabled = newVal;
    },
  },
});
</script>

<style lang="scss" scoped>
$subject-peek-duration: 150ms;
$subject-peek-delay: 150ms;
$first-col-width: 150px;

#subjects {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

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

/* subjects */

#subjects-list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  &.sorting > .subject {
    pointer-events: none;
    user-select: none;
  }
}

.subject {
  position: relative;
  margin: 5px 10px;
  white-space: nowrap;

  &.is-opened > .subject-head {
    z-index: 4;
    background: aliceblue;
  }

  &.expanded-keep > div {
    background: white;
    transition-delay: unset !important;
  }

  &:hover {
    & > .subject-head {
      z-index: 4;
      background: aliceblue;
      transition: background-color $subject-peek-duration $subject-peek-delay,
        margin-bottom 500ms;
    }

    & > .subject-body {
      z-index: 3;
      transition: opacity $subject-peek-duration,
        transform $subject-peek-duration;
    }
  }
}

.dragged-subject > .subject-head {
  background: white;
  transition: none;
}

/* icons */

.subject-warning {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  color: #ff7f7f;
  cursor: pointer;
  z-index: 1;
}

.subject-diff {
  position: absolute;
  top: 0;
}

/* subject head */

.subject-head {
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: transparent;
  overflow: hidden;
  margin-bottom: 0;
  transition: background-color $subject-peek-duration $subject-peek-delay,
    margin-bottom 500ms, z-index 0ms $subject-peek-duration;
  z-index: 2;
  transform: translateZ(0);
  will-change: margin, margin-bottom;
}

.subject-info {
  display: flex;
  overflow-x: auto;
  margin: 0 auto 0 30px;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.subject-name) {
  color: $hovered-text-button;
  font-weight: bold;
  transition: color 150ms;

  &.active {
    color: $button-color;
  }
}

:deep(.teachers),
.grade-count {
  color: $light-gray-text;
  border-left: 1px solid $light-border-color;
  margin-left: 15px;
}

:deep(.teachers) {
  padding-right: 30px;
  padding-left: 15px;
}

.grade-count {
  position: relative;
  flex-shrink: 0;
  width: 50px;
  text-align: center;

  &::after {
    content: "";
    position: absolute;
    left: -45px;
    height: 100%;
    width: 30px;
    background: linear-gradient(to right, transparent, white);
  }
}

.grade-avg {
  flex-shrink: 0;
  height: 100%;
  line-height: 44px;
  width: 75px;
  border-left: 1px solid $light-border-color;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 5px #cacccc;
  clip-path: inset(1px 1px 1px -5px);
  outline: none;
  transition: color 150ms;
}

.line-colors {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 4px;
  transform-origin: bottom;
}

/* subject body */

.subject-body {
  position: absolute;
  left: -4px;
  right: -4px;
  padding-top: 10px;
  top: 40px;
  font-size: 14px;
  background: white;
  transition: opacity $subject-peek-duration, transform $subject-peek-duration,
    z-index 0ms $subject-peek-duration;
  transform-origin: top;
  overflow: hidden;
  z-index: 1;
}

.pin-subject {
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  transition: color 150ms;

  &.pinned {
    color: $button-color;
  }

  span {
    padding: 0 10px 0 24px;
  }
}

table {
  table-layout: fixed;
  white-space: pre-line;
  width: 100%;
  border-spacing: 0;
}

thead {
  font-weight: bold;
  background: white;
}

tbody tr {
  transition: background-color 150ms;

  &:last-child {
    background: white;
  }
}

td {
  border: 1px solid #eeeeee;
  border-radius: 4px;
  text-align: center;
  padding: 3px 5px;
  overflow: hidden;
  outline: none;

  &:first-child {
    width: $first-col-width;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.last-note {
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    white-space: normal;
  }
}

.no-grades {
  text-align: center;
  padding: 10px;
}

.column-colors {
  position: absolute;
  left: $first-col-width;
  top: 30px;
  right: 0;
  bottom: 0;
  opacity: 0.8;
  box-shadow: inset 0 0 20px 0px white;
  transform-origin: top;
  z-index: -1;
}

/* transitions */

.subject-colors-enter-active,
.subject-colors-leave-active {
  transition: opacity 500ms, transform 500ms;
}

.subject-colors-enter-from,
.subject-colors-leave-to {
  opacity: 0;
  transform: scaleY(0);
}

.subject-body-enter-from {
  opacity: 0;
  transform: scaleY(0.5) translateY(-10px);
}
.subject-body-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
