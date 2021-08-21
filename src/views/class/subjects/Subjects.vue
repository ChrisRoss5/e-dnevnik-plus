<template>
  <div id="subjects">
    <SubjectsSummary
      :finalGradeOriginal="finalGradeOriginal"
      :finalGrade="finalGrade"
      :options="options"
      :openedSubject="!!openedSubject"
      @optionClicked="optionClicked"
    ></SubjectsSummary>
    <transition name="opacity">
      <SubjectsCounter
        v-if="options.countAvgs.enabled"
        :subjects="subjects"
        @close="optionClicked('countAvgs', options.countAvgs)"
      ></SubjectsCounter>
    </transition>
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
          'expanded-keep': subject.expandedKeep && !openedSubject,
          'is-opened': subject.isOpened,
        }"
        @mouseenter="subjectMouseEnter($event, subject)"
        @mouseleave="subjectMouseLeave(subject)"
      >
        <SubjectCardHead
          :subject="subject"
          :savedOptions="savedOptions"
          @updateSubjectGradesAvg="getSubjectGradesAvg"
        ></SubjectCardHead>
        <SubjectCardBody
          :subject="subject"
          :savedOptions="savedOptions"
          :openedSubject="!!openedSubject"
          :expandTables="expandTables"
          :tooltipKey="tooltipKey"
          @updateSubjectGradesAvg="getSubjectGradesAvg"
        ></SubjectCardBody>
      </SlickItem>
    </SlickList>

    <!-- SUBJECT.VUE -->
    <router-view v-slot="{ Component }" :subject="openedSubject">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SlickList, SlickItem } from "vue-slicksort";
import { getSubjectColors } from "@/scripts/utils";
import { updateSubjects } from "@/scripts/scrapers";
import SubjectsSummary from "./SubjectsSummary.vue";
import SubjectsCounter from "./SubjectsCounter.vue";
import SubjectCardHead from "./SubjectCardHead.vue";
import SubjectCardBody from "./SubjectCardBody.vue";
import { User, ClassInfo, SubjectCache, GradesByCategory } from "@/store/state";

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
      expandTables: 0,
      savedOptions: {
        zoom: 2,
        expandTablesOnHover: true,
        subjectColors: true,
      },
      options: {
        expandTablesOnHover: {
          icon: "menu_open",
          tooltip: "Otvori tablice prelaskom miša",
          hideWhenSubjectIsOpen: true,
          enabled: true,
        },
        expandTables: {
          icon: "unfold_more",
          tooltip: "Otvori sve tablice",
          hideWhenSubjectIsOpen: true,
          enabled: false,
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
        subjectColors: {
          icon: "border_color",
          tooltip: "Prikaži boje ocjena",
          fontSize: "18px",
          enabled: true,
        },
        countAvgs: {
          icon: "functions",
          tooltip: "Zbroji zaključne ocjene",
          enabled: false,
        },
        sortSubjects: {
          icon: "swap_vert",
          tooltip: "Sortiraj predmete",
        },
        updateSubjects: {
          icon: "sync",
          tooltip: "Ažuriraj sve ocjene",
        },
      } as Record<string, Option>,
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
      let cached = this.openedClassInfo && this.openedClassInfo.cachedSubjects;
      if (!cached || !cached.length) return;
      cached = JSON.parse(JSON.stringify(cached)) as ExtendedSubjectCache[];
      this.subjects = cached.map((subject: any) => ({
        ...subject,
        gradesByCategoryOriginal: JSON.parse(
          JSON.stringify(subject.gradesByCategory || []),
        ),
        gradesAvg: this.getSubjectGradesAvg(subject, subject.gradesByCategory),
        gradesCount: this.getSubjectGradesCount(
          subject,
          subject.gradesByCategory,
        ),
      }));
      console.log("RESET");

      this.finalGradeOriginal = this.getFinalGradeOriginal();
    },
    subjectMouseEnter(e: MouseEvent, subject: ExtendedSubjectCache) {
      if (!this.savedOptions.expandTablesOnHover || this.openedSubject) return;
      const target = e.target as HTMLElement;
      setTimeout(() => (subject.expanded = target.matches(":hover")), 150);
    },
    subjectMouseLeave(subject: ExtendedSubjectCache) {
      subject.expanded = false;
    },
    subjectsSortingEvent(started: boolean) {
      this.subjectsSorting = started;
    },
    subjectsOrderChanged() {
      this.tooltipKey += 1; // todo: fix tooltip reactivity bug (temp. fixed)
    },
    optionClicked(optionName: string, option: Option) {
      if (option.enabled !== undefined) option.enabled = !option.enabled;
      const enabled = option.enabled || false;
      switch (optionName) {
        case "expandTablesOnHover":
          this.savedOptions.expandTablesOnHover = enabled;
          break;
        case "expandTables":
          this.expandTables = enabled ? this.expandTables + 1 : 0;
          return;
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
    checkActiveSubject() {
      const subjectId = this.$route.params.subjectId as string;
      for (const subject of this.subjects) {
        this.subjectMouseLeave(subject);
        const isOpened = !!subjectId && subject.url.includes(subjectId);
        subject.isOpened = isOpened;
      }
      this.openedSubject = this.subjects.find((s) => s.isOpened) || false;
    },
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
        return subject.gradesAvgEdited || subject.gradesAvg;
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
      this.options.expandTables.enabled = newVal;
    },
  },
});
</script>

<style lang="scss" scoped>
#subjects {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

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

    @include themed() {
      background: t("alice-blue");
    }
  }

  &.expanded-keep > div {
    transition-delay: unset !important;

    @include themed() {
      background: t("white-background");
    }
  }

  &:hover {
    & > .subject-head {
      z-index: 4;
      transition: background-color $subject-peek-duration $subject-peek-delay,
        margin-bottom 500ms;

      @include themed() {
        background: t("alice-blue");
      }
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
</style>
