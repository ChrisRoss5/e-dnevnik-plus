<template>
  <div id="counter" class="abs-cover blur" @click.self="$emit('close')">
    <div id="container" class="card">
      <div
        v-for="i in 5"
        :key="i"
        class="card"
        v-tooltip.right="{
          content: gradeCounts[5 - i].subjects.join('<br>'),
          html: true,
        }"
      >
        <div>{{ gradeTitles[i - 1] }}:</div>
        <input
          min="0"
          v-model.number="gradeCounts[5 - i].count"
          type="number"
          class="card"
        />
        <span class="material-icons edit"> edit </span>
      </div>
      <div id="finalGrade">
        {{ finalGrade }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatNum } from "@/scripts/utils";
import { ExtendedSubjectCache } from "@/views/class/subjects/Subjects.vue";
import { defineComponent, PropType } from "vue";

interface Row {
  subjects: string[];
  count: number;
}

export default defineComponent({
  name: "SubjectsCounter",
  props: {
    subjects: {
      type: Object as PropType<ExtendedSubjectCache[]>,
      required: true,
    },
  },
  emits: ["close"],
  created() {
    this.updateData();
  },
  data() {
    return {
      gradeTitles: [
        "Odličnih (5)",
        "Vrlo dobrih (4)",
        "Dobrih (3)",
        "Dovoljnih (2)",
        "Nedovoljnih (1)",
      ],
      gradeCounts: [] as Row[],
    };
  },
  methods: {
    updateData() {
      this.gradeCounts = [
        { subjects: [], count: 0 },
        { subjects: [], count: 0 },
        { subjects: [], count: 0 },
        { subjects: [], count: 0 },
        { subjects: [], count: 0 },
      ];
      for (const subject of this.subjects) {
        if (!subject.gradesCount) continue;
        let row;
        if (subject.finalGrade) {
          row = this.gradeCounts[Math.round(subject.finalGrade) - 1];
        } else if (subject.gradesAvgOriginal) {
          row = this.gradeCounts[Math.round(subject.gradesAvgOriginal) - 1];
        }
        if (row) {
          row.subjects.push(subject.name);
          row.count += 1;
        }
      }
    },
  },
  computed: {
    finalGrade(): string {
      return formatNum(
        this.gradeCounts.reduce((a, b, i) => a + (b.count || 0) * (i + 1), 0) /
          this.gradeCounts.reduce((a, b) => a + (b.count || 0), 0),
      );
    },
  },
  watch: {
    subjects() {
      this.updateData();
    },
  },
});
</script>

<style lang="scss" scoped>
#counter {
  top: 75px;
  font-size: 24px;
  z-index: 5;
}

#container {
  width: fit-content;
  margin: 100px auto;

  .card {
    position: relative;
    display: flex;
    align-items: center;

    & > div {
      text-align: right;
      margin-left: 20px;
      flex: 1;
    }

    &:hover .edit,
    input:focus + .edit {
      opacity: 0;
      pointer-events: none;
    }
  }

  @include themed() {
    background: t("alice-blue");
  }
}

input {
  width: 100px;
  font-size: 24px;
  margin: 10px;
}

.edit {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 150ms;

  @include themed() {
    color: t("light-gray");
  }
}

#finalGrade {
  padding: 10px 50px;
  text-align: right;
}
</style>
