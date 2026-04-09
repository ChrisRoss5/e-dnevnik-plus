<template>
  <div id="subjects" ref="subjects">
    <SubjectsSummary
      :finalGradeOriginal="finalGradeOriginal"
      :finalGrade="finalGrade"
      :options="options"
      :savedOptions="savedOptions"
      :isOpenedSubject="!!openedSubject"
      @optionClicked="optionClicked"
      @sortOptionClicked="sortOptionClicked"
    ></SubjectsSummary>
    <transition name="opacity">
      <SubjectsCounter
        v-if="options.countAvgs.enabled"
        :subjects="subjects"
        @close="optionClicked('countAvgs')"
      ></SubjectsCounter>
    </transition>
    <transition name="opacity">
      <SlickList
        v-if="subjects.length"
        id="subjects-list"
        :class="{ sorting: subjectsSorting || subjectsResizing }"
        :style="{
          'grid-template-columns':
            'repeat(' +
            (openedSubject ? 1 : savedOptions.zoom) +
            ',minmax(0, 1fr))',
          margin: '0 ' + (openedSubject ? 0 : subjectsMargin) + 'px',
          transition: 'margin ' + (subjectsResizing ? 0 : 350) + 'ms',
        }"
        v-model:list="subjects"
        axis="xy"
        helperClass="dragged-subject"
        :lockOffset="15"
        :lockToContainerEdges="true"
        :distance="5"
        :cancelKey="'no'"
        @sort-start="subjectsSorting = true"
        @update:list="subjectsOrderChanged"
      >
        <transition-group :name="subjectsSorting ? '' : 'subjects-list'">
          <SlickItem
            v-for="(subject, i) in subjects"
            :key="subject.url"
            :index="i"
            class="subject"
            :class="{
              'expanded-keep': subject.expandedKeep && !openedSubject,
              'is-opened': subject.isOpened,
            }"
            :disabled="!savedOptions.sortByDragging || subjectsResizing"
            @mouseenter="subjectMouseEnter($event, subject)"
            @mouseleave="subjectMouseLeave(subject)"
          >
            <SubjectCardHead
              :class="{ 'transitions-ready': transitionsReady }"
              :subject="subject"
              :savedOptions="savedOptions"
              @updateGradesAvgEdited="(v) => updateGradesAvgEdited(subject, v)"
              @revertSubject="revertSubject(subject)"
            ></SubjectCardHead>
            <SubjectCardBody
              :subject="subject"
              :savedOptions="savedOptions"
              :isOpenedSubject="!!openedSubject"
              :expandTables="expandTables"
              :updateTablesMargin="updateTablesMargin"
              @expandSubject="(v) => expandSubject(subject, v)"
              @updateSubjectMargin="(v) => updateSubjectMargin(subject, v)"
              @updateGradesAvgEdited="updateGradesAvgEdited(subject, undefined)"
              @updateSubjectGradesAvg="(v) => getSubjectGradesAvg(subject, v)"
            ></SubjectCardBody>
          </SlickItem>
        </transition-group>
        <div
          id="subjects-resizer"
          class="abs-cover card flex-center material-icons"
          :class="{ 'disabled-button': !!openedSubject }"
          @mousedown="startResizing"
          v-wave
        >
          drag_indicator
        </div>
      </SlickList>
    </transition>

    <!-- SUBJECT.VUE -->
    <router-view v-slot="{ Component }" :subject="openedSubject">
      <transition :name="'subject'">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defaultUserSettings } from "@/scripts/new-user";
import { updateSubjects } from "@/scripts/scrapers/scrapers";
import { getSubjectColors, jsonClone } from "@/scripts/utils";
import {
  ClassInfo,
  GradesByCategory,
  SubjectCache,
  SubjectsSettings,
} from "@/store/state";
import { defineComponent } from "vue";
import { SlickItem, SlickList } from "vue-slicksort";
import SubjectCardBody from "./SubjectCardBody.vue";
import SubjectCardHead from "./SubjectCardHead.vue";
import SubjectsCounter from "./SubjectsCounter.vue";
import SubjectsSummary from "./SubjectsSummary.vue";

export interface ExtendedSubjectCache extends SubjectCache {
  expanded: boolean;
  expandedKeep: boolean;
  marginBottom: string;
  gradesByCategoryOriginal: GradesByCategory[];
  gradesCount: number;
  gradesAvg: number;
  gradesAvgEdited?: number;
  gradesAvgOriginal?: number;
  lineColors?: string;
  columnColors?: string;
  isOpened?: boolean;
}

export interface Option {
  icon: string;
  tooltip: string;
  hideWhenSubjectIsOpen?: boolean;
  fontSize?: string;
  enabled?: boolean;
}

export default defineComponent({
  name: "Subjects",
  components: {
    SubjectsSummary,
    SubjectsCounter,
    SlickList,
    SlickItem,
    SubjectCardHead,
    SubjectCardBody,
  },
  props: { classId: { type: String, required: true } }, // TODO?: FIX TS ERROR
  /* emits: ["sectionLoading", "sectionLoaded"], */ created() {
    this.updateSubjects();
  },
  data() {
    return {
      expandTables: 1,
      updateTablesMargin: 1,
      subjects: [] as ExtendedSubjectCache[],
      subjectsLoading: false,
      subjectsSorting: false,
      openedSubject: false as ExtendedSubjectCache | false,
      finalGradeOriginal: 0,
      originalMouseX: 0,
      subjectsMargin: 0,
      subjectsResizing: false,
      transitionsReady: false,
    };
  },
  methods: {
    async updateSubjects(forceUpdate?: boolean) {
      if (!this.openedClassInfo || this.subjectsLoading) return;
      this.subjectsMargin = this.savedOptions.margin;
      this.$emit("sectionLoading");
      this.subjectsLoading = true;
      if (!(await updateSubjects(this.openedClassInfo, forceUpdate))) return;
      this.subjectsLoading = false;
      this.$emit("sectionLoaded");
      this.subjects = [];
      setTimeout(this.resetSubjects, 0); // Because large amount of HTML causes flicker
    },
    resetSubjects() {
      const cached =
        this.openedClassInfo && this.openedClassInfo.cachedSubjects;
      if (!cached || !cached.length) return;
      const clone = jsonClone(cached) as ExtendedSubjectCache[];
      const { subjectsOrder, expandedSubjects } = this.savedOptions;
      const sorted = subjectsOrder[this.classId] || [];
      this.subjects = clone
        .map((subject) => {
          const gradesByCategoryOriginal = jsonClone(
            subject.gradesByCategory || [],
          );
          const gradesAvg = this.getSubjectGradesAvg(
            subject,
            subject.gradesByCategory,
          );
          const gradesCount = this.getSubjectGradesCount(
            subject,
            subject.gradesByCategory,
          );
          const expandedKeep = expandedSubjects.includes(subject.url);
          return {
            ...subject,
            gradesByCategoryOriginal,
            gradesAvg,
            gradesCount,
            expandedKeep,
          };
        })
        .sort((a, b) => sorted.indexOf(a.url) - sorted.indexOf(b.url));
      this.finalGradeOriginal = this.getFinalGradeOriginal();
      this.checkActiveSubject();
      setTimeout(() => (this.updateTablesMargin += 1), 100);
    },
    subjectMouseEnter(e: MouseEvent, subject: ExtendedSubjectCache) {
      if (!this.savedOptions.expandTablesOnHover || this.openedSubject) return;
      const target = e.target as HTMLElement;
      setTimeout(() => (subject.expanded = target.matches(":hover")), 150);
    },
    subjectMouseLeave(subject: ExtendedSubjectCache) {
      subject.expanded = false;
    },
    subjectsOrderChanged() {
      const savedOptions = jsonClone(this.savedOptions);
      const order = this.subjects.map((subject) => subject.url);
      savedOptions.subjectsOrder[this.classId] = order;
      this.updateUserSettings("subjectsSettings", savedOptions);
      this.$nextTick(() => (this.subjectsSorting = false));
    },
    optionClicked(optionName: string) {
      const option = this.options[optionName];
      const savedOptions = jsonClone(this.savedOptions);
      const zoomChanged = optionName.includes("zoom");
      switch (optionName) {
        case "expandTablesOnHover":
        case "countAvgs":
          savedOptions[optionName] = !savedOptions[optionName];
          break;
        case "expandTables":
          this.expandTables = option.enabled ? 0 : this.expandTables + 1;
          return this.sendAnalyticsButtonClick(optionName, !option.enabled);
        case "zoomIn":
        case "zoomOut":
          savedOptions.zoom = Math.min(
            Math.max(savedOptions.zoom + (optionName == "zoomIn" ? -1 : 1), 1),
            this.subjects.length,
          );
          break;
        case "subjectLineColors":
        case "subjectColumnColors":
          savedOptions[optionName] = !savedOptions[optionName];
          this.subjects.forEach(this.updateSubjectColors);
          break;
        case "updateSubjects":
          this.updateSubjects(true);
          return this.sendAnalyticsButtonClick(optionName);
      }
      this.sendAnalyticsButtonClick(
        optionName,
        zoomChanged ? savedOptions.zoom : !option.enabled,
      );
      this.updateUserSettings("subjectsSettings", savedOptions);
      this.updateTablesMargin += zoomChanged ? 1 : 0;
    },
    sendAnalyticsButtonClick(
      optionName: string,
      value?: boolean | number | string,
    ) {
      chrome.runtime.sendMessage({
        name: "SEND_ANALYTICS_EVENT",
        params: {
          name: "click_button",
          id: "subjects",
          [optionName]: value == undefined ? "--" : value,
        },
      });
    },
    sortOptionClicked(optionName: string) {
      const savedOptions = jsonClone(this.savedOptions);
      if (optionName.includes("Sortiranje")) {
        savedOptions.sortByDragging = !savedOptions.sortByDragging;
        this.updateUserSettings("subjectsSettings", savedOptions);
        this.sendAnalyticsButtonClick("sort", savedOptions.sortByDragging);
        return;
      }
      const isReverse = optionName.includes("silazno");
      const sortByAvg = optionName.includes("Prosjek");
      const sortProperty = sortByAvg ? "gradesAvgEdited" : "gradesCount";
      this.subjects.sort((a, b) => {
        if (!a.gradesCount && b.gradesCount) return 1; // empty subject
        if (a.gradesCount && !b.gradesCount) return -1; // empty subject
        const propA = a[sortProperty] || a.gradesAvg;
        const propB = b[sortProperty] || b.gradesAvg;
        if (propA < propB) return isReverse ? 1 : -1;
        if (propA > propB) return isReverse ? -1 : 1;
        return 0;
      });
      this.subjectsOrderChanged();
      this.sendAnalyticsButtonClick("sort", sortProperty);
    },
    getSubjectGradesCount(
      subject: ExtendedSubjectCache,
      gradesByCategory?: GradesByCategory[],
      original?: boolean,
    ): number {
      const gradesCount = (gradesByCategory || []).reduce((a, row) => {
        return a + row.grades.flat().length;
      }, 0);
      if (
        this.savedOptions.subjectLineColors ||
        this.savedOptions.subjectColumnColors
      )
        this.updateSubjectColors(subject);
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
    updateSubjectColors(subject: ExtendedSubjectCache) {
      const counts = [0, 0, 0, 0, 0];
      const cols: number[][] = [...Array(10)].map(() => []);
      for (let i = 0; i < (subject.gradesByCategory || []).length; i++) {
        const row = subject.gradesByCategory![i].grades;
        for (let j = 0; j < row.length; j++)
          for (const grade of row[j]) {
            cols[j].push(grade);
            counts[grade - 1] += 1;
          }
      }
      const totalCount = counts.reduce((a, b) => a + b, 0);
      subject.lineColors = getSubjectColors(counts, totalCount);
      subject.columnColors = getSubjectColors(cols);
    },
    checkActiveSubject() {
      const subjectId = this.$route.params.subjectId as string;
      for (const subject of this.subjects) {
        this.subjectMouseLeave(subject);
        const isOpened = !!subjectId && subject.url.includes(subjectId);
        subject.isOpened = isOpened;
      }
      this.openedSubject = this.subjects.find((s) => s.isOpened) || false;
      setTimeout(
        () => (this.transitionsReady = !this.openedSubject),
        this.openedSubject ? 600 : 300,
      );
    },
    updateGradesAvgEdited(
      subject: ExtendedSubjectCache,
      newValue: number | undefined,
    ) {
      subject.gradesAvgEdited = newValue;
    },
    expandSubject(subject: ExtendedSubjectCache, expand: boolean) {
      subject.expandedKeep = expand;
      const savedOptions = jsonClone(this.savedOptions);
      const arr = savedOptions.expandedSubjects;
      const idx = arr.indexOf(subject.url);
      expand ? idx == -1 && arr.push(subject.url) : arr.splice(idx, 1);
      this.updateUserSettings("subjectsSettings", savedOptions);
    },
    updateSubjectMargin(subject: ExtendedSubjectCache, margin: string) {
      subject.marginBottom = margin;
    },
    revertSubject(subject: ExtendedSubjectCache) {
      subject.gradesAvgEdited = undefined;
      subject.gradesByCategory = jsonClone(subject.gradesByCategoryOriginal);
      this.getSubjectGradesAvg(subject, subject.gradesByCategory);
    },
    startResizing(e: MouseEvent) {
      this.subjectsResizing = true;
      this.originalMouseX = e.pageX;
      window.addEventListener("mousemove", this.resizeSubjects);
      window.addEventListener("mouseup", this.stopResizing);
    },
    stopResizing() {
      this.subjectsResizing = false;
      window.removeEventListener("mousemove", this.resizeSubjects);
      window.removeEventListener("mouseup", this.stopResizing);
      const savedOptions = jsonClone(this.savedOptions);
      savedOptions.margin = this.subjectsMargin;
      this.updateUserSettings("subjectsSettings", savedOptions);
      this.updateTablesMargin += 1;
    },
    resizeSubjects(e: MouseEvent) {
      const movement = this.originalMouseX - e.pageX;
      this.subjectsMargin = Math.min(
        Math.max(0, this.savedOptions.margin + movement),
        (this.$refs.subjects as HTMLElement).offsetWidth / 2 - 30,
      );
    },
  },
  computed: {
    openedClassInfo(): ClassInfo | undefined {
      return this.$store.getters.classInfo(this.classId);
    },
    allSubjectsExpanded(): boolean {
      return this.subjects.every((subject) => subject.expandedKeep);
    },
    finalGrade(): number {
      const subjectsWithGrades = this.subjects.filter((subj) => {
        if (subj.gradesAvgEdited === undefined) return subj.gradesAvg;
        return !isNaN(subj.gradesAvgEdited);
      });
      return (
        subjectsWithGrades.reduce((a, subj) => {
          return a + Math.round((subj.gradesAvgEdited || subj.gradesAvg)!);
        }, 0) / subjectsWithGrades.length
      );
    },
    savedOptions(): SubjectsSettings {
      return this.user
        ? this.user.settings.subjectsSettings
        : defaultUserSettings.subjectsSettings;
    },
    options(): Record<string, Option> {
      return {
        expandTablesOnHover: {
          icon: "menu_open",
          tooltip: "Otvori tablice prelaskom miša",
          hideWhenSubjectIsOpen: true,
          enabled: this.savedOptions.expandTablesOnHover,
        },
        expandTables: {
          icon: "unfold_more",
          tooltip: "Otvori sve tablice",
          hideWhenSubjectIsOpen: true,
          enabled: this.allSubjectsExpanded,
        },
        zoomIn: {
          icon: "zoom_in",
          tooltip: "Povećaj prikaz",
          hideWhenSubjectIsOpen: true,
        },
        zoomOut: {
          icon: "zoom_out",
          tooltip: "Smanji prikaz",
          hideWhenSubjectIsOpen: true,
        },
        subjectLineColors: {
          icon: "border_color",
          tooltip: "Prikaži boje ocjena po ukupnom broju",
          fontSize: "1rem",
          enabled: this.savedOptions.subjectLineColors,
        },
        subjectColumnColors: {
          icon: "format_paint",
          tooltip: "Prikaži boje ocjena po mjesecima",
          fontSize: "1.15rem",
          enabled: this.savedOptions.subjectColumnColors,
        },
        countAvgs: {
          icon: "functions",
          tooltip: "Zbroji zaključne ocjene",
          enabled: this.savedOptions.countAvgs,
        },
        sortSubjects: {
          icon: "swap_vert",
          tooltip: "Sortiraj predmete",
        },
        updateSubjects: {
          icon: "sync",
          tooltip: "Ažuriraj sve ocjene",
        },
      };
    },
  },
  watch: {
    $route() {
      this.checkActiveSubject();
    },
    classId(to, from) {
      if (from) this.updateSubjects();
    },
    allSubjectsExpanded(newVal) {
      this.options.expandTables.enabled = newVal;
    },
  },
});
</script>

<style lang="scss" scoped>
#subjects {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

#subjects-list {
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding-right: 30px;

  &.sorting > .subject {
    pointer-events: none;
    user-select: none;
  }
}

@mixin expanded-head($background) {
  @include themed() {
    :deep(.grade-count) {
      box-shadow: -30px 0px 20px 5px t($background);
    }
    background: t($background);
  }
}

.subject {
  position: relative;
  margin: 5px 10px;
  white-space: nowrap;

  &.is-opened > .subject-head {
    z-index: 4;
    @include expanded-head("alice-blue");
  }

  &.expanded-keep > div {
    transition-delay: unset !important;
    @include expanded-head("white-background");
  }

  &:hover {
    & > .subject-head {
      z-index: 4;
      transition: background-color $subject-peek-duration $subject-peek-delay,
        margin-bottom 500ms;
      @include expanded-head("alice-blue");
    }

    &:not(.expanded-keep):deep(.grade-count) {
      transition: box-shadow $subject-peek-duration $subject-peek-delay;
    }

    & > .subject-body {
      z-index: 3;
      transition: opacity $subject-peek-duration,
        transform $subject-peek-duration;
    }
  }
}

.dragged-subject > .subject-head {
  transition: none;

  @include themed() {
    background: t("white-background");
  }
}

#subjects-resizer {
  left: auto;
  margin: 5px 10px;
  width: 10px;
  cursor: col-resize;
  transition: color 150ms;

  @include themed() {
    background: t("alice-blue");
    color: t("gray-blue");
  }

  &:active {
    color: $navbar-selected-text-color;
  }
}

/* transitions */

:deep(.subject-colors-enter-active),
:deep(.subject-colors-leave-active) {
  transition: opacity 500ms, transform 500ms;
}

:deep(.subject-colors-enter-from),
:deep(.subject-colors-leave-to) {
  opacity: 0;
  transform: scaleY(0);
}

.subjects-list-move {
  transition: transform 1s;
}

.subject-enter-active,
.subject-leave-active {
  transition: opacity 150ms, transform 150ms;
}

.subject-leave-active {
  position: absolute !important;
  right: 0;
  top: 75px;
}

.subject-enter-from,
.subject-leave-to {
  opacity: 0;
  transform: scaleY(0.97);
}
</style>
