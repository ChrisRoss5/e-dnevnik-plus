<template>
  <div
    class="subject-head card"
    :style="{ 'margin-bottom': subject.marginBottom }"
  >
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

    <div class="subject-info" @wheel="onSubjectInfoWheel">
      <router-link
        :to="getSubjectUrl(subject.url)"
        class="subject-name"
        :class="{ active: subject.isOpened }"
        >{{ subject.name }}</router-link
      >
      <div class="teachers">{{ subject.teachers }}</div>
    </div>
    <div class="grade-count">{{ subject.gradesCount }}</div>
    <div
      class="grade-avg flex-center"
      contenteditable="true"
      @input="avgInputted($event, subject)"
      @focus="avgFocusChanged"
      @blur="avgFocusChanged"
      :style="{ color: getSubjectAvgColor(subject) }"
      :title="subject.gradesAvgOriginal"
    >
      {{
        formatNum(
          subject.gradesAvgEdited === undefined
            ? subject.gradesAvg
            : subject.gradesAvgEdited,
        )
      }}
    </div>
    <transition name="subject-colors">
      <div
        v-if="savedOptions.subjectColors"
        class="line-colors"
        :style="{ background: subject.lineColors }"
      ></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ExtendedSubjectCache } from "@/views/class/subjects/Subjects.vue";
import { GradesByCategory } from "@/store/state";
import { formatNum, setEndOfContenteditable } from "@/scripts/utils";

export default defineComponent({
  name: "SubjectCardHead",
  props: {
    subject: {
      type: Object as PropType<ExtendedSubjectCache>,
    },
    savedOptions: Object,
  },
  methods: {
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
    getSubjectAvgColor(subject: ExtendedSubjectCache): string {
      const avg = subject.gradesAvgEdited || subject.gradesAvg;
      const originalAvg = subject.gradesAvgOriginal;
      if (!avg || avg == originalAvg) return "";
      if (!originalAvg || avg < originalAvg) return "red";
      return "green";
    },
    getSubjectUrl(path: string): string {
      const match = path.match(/\d+/);
      const fullPath = this.$route.path.replace(/\/(\d+)?$/, "");
      return fullPath + "/" + (match ? match[0] : "");
    },
    revertSubject(subject: ExtendedSubjectCache) {
      subject.gradesAvgEdited = undefined;
      subject.gradesByCategory = JSON.parse(
        JSON.stringify(subject.gradesByCategoryOriginal),
      );
      this.$emit("updateSubjectGradesAvg", subject, subject.gradesByCategory);
    },
    formatNum: (num: number): string => formatNum(num),
  },
});
</script>

<style lang="scss" scoped>
/* icons */

.subject-diff {
  position: absolute;
  top: 0;
}

.subject-warning {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  color: #ff7f7f;
  cursor: pointer;
  z-index: 1;
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
</style>
