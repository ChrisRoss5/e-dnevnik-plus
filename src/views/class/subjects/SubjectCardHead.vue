<template>
  <div
    class="subject-head card"
    :style="{ 'margin-bottom': subject.marginBottom }"
  >
    <transition name="opacity">
      <div
        v-if="
          subject.finalGrade && subject.finalGrade != gradesAvgOriginalRounded
        "
        class="material-icons subject-diff"
        v-tooltip.top-start="
          subject.finalGrade > gradesAvgOriginalRounded
            ? 'Zaključena ocjena je veća od zaokruženog prosjeka.'
            : 'Zaključena ocjena je manja od zaokruženog prosjeka.'
        "
        :style="{
          color:
            subject.finalGrade > gradesAvgOriginalRounded
              ? '#2ab62a'
              : '#ff3924',
        }"
      >
        {{
          subject.finalGrade > gradesAvgOriginalRounded
            ? "arrow_upward"
            : "arrow_downward"
        }}
      </div>
    </transition>
    <transition name="opacity">
      <span
        v-if="isSubjectEdited()"
        class="material-icons subject-warning"
        v-tooltip="'Klikni za poništavanje promjena'"
        @click="$emit('revertSubject')"
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
      @input="avgInputted"
      @focus="avgFocusChanged"
      @blur="avgFocusChanged"
      :style="{ color: getSubjectAvgColor() }"
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
import { formatNum, setEndOfContenteditable } from "@/scripts/utils";
import { GradesByCategory } from "@/store/state";
import { ExtendedSubjectCache } from "@/views/class/subjects/Subjects.vue";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "SubjectCardHead",
  props: {
    subject: {
      type: Object as PropType<ExtendedSubjectCache>,
      required: true,
    },
    savedOptions: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  // emits: ["revertSubject", "updateGradesAvgEdited"],
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
    isSubjectEdited() {
      const current = this.mapSubjectGrades(
        this.subject.gradesByCategory || [],
      );
      const original = this.mapSubjectGrades(
        this.subject.gradesByCategoryOriginal || [],
      );
      return (
        this.subject.gradesAvgEdited !== undefined ||
        JSON.stringify(current) != JSON.stringify(original)
      );
    },
    mapSubjectGrades(grades: GradesByCategory[]) {
      return grades.map((row) => row.grades.map((cell) => [...cell].sort())); // nosonar
    },
    avgInputted(e: InputEvent) {
      const target = e.target as HTMLElement;
      const validInput = e.data && /[1-5]/.test(e.data);
      if (!validInput) target.textContent = "";
      this.$emit("updateGradesAvgEdited", validInput ? parseInt(e.data!) : NaN);
      target.textContent = target.textContent!.slice(0, 4);
      this.$nextTick(() => setEndOfContenteditable(target));
    },
    avgFocusChanged(e: FocusEvent) {
      const target = e.target as HTMLElement;
      if (e.type == "focus" && target.textContent == "—")
        target.textContent = "";
      else if (e.type == "blur" && !target.textContent)
        target.textContent = "—";
    },
    getSubjectAvgColor() {
      const avg = this.subject.gradesAvgEdited || this.subject.gradesAvg;
      const originalAvg = this.subject.gradesAvgOriginal;
      if (!avg || avg == originalAvg) return "";
      if (!originalAvg || avg < originalAvg) return "#ff3924";
      return "green";
    },
    getSubjectUrl(path: string) {
      const match = path.match(/\d+/);
      const fullPath = this.$route.path.replace(/\/(\d+)?$/, "");
      return fullPath + "/" + (match ? match[0] : "");
    },
    formatNum: (num: number) => formatNum(num),
  },
  computed: {
    gradesAvgOriginalRounded(): number {
      return Math.round(this.subject.gradesAvgOriginal || 0);
    },
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
  transform: translateZ(0);
  will-change: margin, margin-bottom;
  z-index: 2;

  &.transitions-ready {
    transition: background-color $subject-peek-duration, margin-bottom 500ms,
      z-index 0ms $subject-peek-duration;
  }
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
  transition: box-shadow $subject-peek-duration;
  clip-path: inset(0 0 0 -40px);

  @include themed() {
    box-shadow: -30px 0px 20px 5px t("text-disappearing");
  }
}

.grade-avg {
  flex-shrink: 0;
  height: 100%;
  line-height: 44px;
  width: 75px;
  border-radius: 8px;
  text-align: center;
  clip-path: inset(1px 1px 1px -5px);
  outline: none;
  transition: color 150ms;

  @include themed() {
    border-left: 1px solid t("light-border-color");
    box-shadow: t("gray-shadow");
  }
}

.line-colors {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 4px;
  transform-origin: bottom;
}
</style>
