<template>
  <transition name="subject-body">
    <div
      v-show="(subject.expanded || subject.expandedKeep) && !isOpenedSubject"
      class="subject-body card"
      ref="subjectBody"
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
                  @click="expandSubject(!subject.expandedKeep)"
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
              <td>
                {{ row.name }}
              </td>
              <td
                v-for="(grades, j) in row.grades"
                :key="j"
                contenteditable="true"
                @input="
                  gradeInputted(
                    $event,
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
                <td v-tooltip="'Zadnja bilješka'" style="text-align: center">
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
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ExtendedSubjectCache } from "@/views/class/subjects/Subjects.vue";
import { formatGradeText, setEndOfContenteditable } from "@/scripts/utils";

export default defineComponent({
  name: "SubjectCardBody",
  props: {
    subject: {
      type: Object as PropType<ExtendedSubjectCache>,
      required: true,
    },
    savedOptions: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    isOpenedSubject: Boolean,
    expandTables: Number,
    updateTablesMargin: Number,
  },
  /* emits: [
    "expandSubject",
    "updateSubjectMargin",
    "updateGradesAvgEdited",
    "updateSubjectGradesAvg",
  ], */
  methods: {
    expandSubject(expand: boolean, doNotSave?: boolean) {
      if (!doNotSave) this.$emit("expandSubject", expand);
      this.$nextTick(() => {
        const subjectBody = this.$refs["subjectBody"] as HTMLElement;
        const margin = expand ? subjectBody.offsetHeight + "px" : "0px";
        this.$emit("updateSubjectMargin", margin);
      });
    },
    gradeInputted(e: InputEvent, originalGrades: number[], grades: number[]) {
      const target = e.target as HTMLElement;
      const clone = target.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[contenteditable]").forEach((el) => el.remove());
      const _grades = (clone.textContent as string).match(/[1-5]/g) || [];
      target.innerHTML = this.getCellGrades(originalGrades, grades.slice());
      grades.length = 0;
      grades.push(..._grades.map(Number));
      this.$emit("updateGradesAvgEdited");
      this.$emit("updateSubjectGradesAvg", this.subject.gradesByCategory);
      this.$nextTick(() => setEndOfContenteditable(target));
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
            "<span class='line-through' " +
            ("contenteditable='false'>" + grade + "</span>"),
        ),
        ...sharedGrades,
        ...grades.map((grade) => "<span class='red'>" + grade + "</span>"),
      ].join(", ");
    },
    formatGradeText: (num: number): string => formatGradeText(num),
  },
  watch: {
    expandTables(enabled) {
      this.expandSubject(!!enabled); // true if positive num
    },
    isOpenedSubject(isSomeSubjectOpened) {
      this.expandSubject(!isSomeSubjectOpened, true);
    },
    updateTablesMargin() {
      this.expandSubject(this.subject.expandedKeep, true);
    },
    "subject.gradesByCategory": {
      handler() {
        this.expandSubject(this.subject.expandedKeep, true);
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss">
.red {
  color: $soft-red !important;
}

.line-through {
  color: gray !important;
  text-decoration: line-through;
}

.theme--dark .column-colors + table {
  [contenteditable] {
    color: white;
    text-shadow: 0 0 3px black;
  }

  .red {
    text-shadow: 0 0 3px white !important;
  }

  .line-through {
    text-shadow: 0 0 1px white !important;
  }
}
</style>

<style lang="scss" scoped>
$first-col-width: 150px;

.subject-body {
  position: absolute;
  left: -4px;
  right: -4px;
  padding-top: 10px;
  top: 40px;
  font-size: 14px;
  transition: opacity $subject-peek-duration, transform $subject-peek-duration,
    z-index 0ms $subject-peek-duration;
  transform-origin: top;
  overflow: hidden;
  z-index: 1;

  @include themed() {
    background: t("white-background");
  }
}

.pin-subject {
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  transition: color 150ms;

  &.pinned {
    @include themed() {
      color: t("strong-blue");
    }
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

  @include themed() {
    background: t("white-background");
  }
}

tbody tr {
  transition: background-color 150ms;
  position: relative;

  &:last-child {
    @include themed() {
      background: t("white-background");
    }
  }

  &:not(:last-child) td:first-child:hover {
    position: absolute;
    overflow: visible;
    min-width: $first-col-width;
    width: auto;
    white-space: unset;
    min-height: 100%;
    z-index: 1;

    @include themed() {
      background: t("white-background");
    }
  }
}

td {
  border-radius: 4px;
  text-align: center;
  padding: 3px 5px;
  overflow: hidden;
  outline: none;
  transition: color 150ms, text-shadow 150ms;

  &:first-child {
    width: $first-col-width;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: background-color 150ms;
  }

  @include themed() {
    border: 1px solid t("light-light-border-color");
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
  opacity: 0.6;
  transform-origin: top;
  z-index: -1;
}

/* transitions */

.subject-body-enter-from {
  opacity: 0;
  transform: scaleY(0.5) translateY(-10px);
}

.subject-body-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
