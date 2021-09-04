<template>
  <div id="counter" class="blur" @click.self="$emit('close')">
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
      </div>
      <div id="finalGrade">
        <span
          class="material-icons"
          v-tooltip.top-start="{
            content:
              'Prosjek svih zaključnih ocjena (završni uspjeh).<br>' +
              'Ako ocjena iz predmeta nije zaključena, zaokružuje se prosjek.' +
              '<br>Ako predmet nema ocjena, ne uračunava se u ovaj prosjek.',
            html: true,
          }"
        >
          info </span
        >{{ finalGrade }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ExtendedSubjectCache } from "@/views/class/subjects/Subjects.vue";
import { formatNum } from "@/scripts/utils";

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
        const name = subject.name;
        let row;
        if (subject.finalGrade) {
          row = this.gradeCounts[Math.round(subject.finalGrade) - 1];
        } else if (subject.gradesAvgOriginal) {
          row = this.gradeCounts[Math.round(subject.gradesAvgOriginal) - 1];
        }
        if (row) {
          row.subjects.push(name);
          row.count += 1;
        }
      }
    },
  },
  computed: {
    finalGrade(): string {
      return formatNum(
        this.gradeCounts.reduce((a, b, i) => a + b.count * (i + 1), 0) /
          this.gradeCounts.reduce((a, b) => a + b.count, 0),
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
  position: absolute;
  top: 75px;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 24px;
  z-index: 5;
}

#container {
  width: fit-content;
  margin: 100px auto;

  .card {
    display: flex;
    align-items: center;

    & > div {
      text-align: right;
      margin-left: 20px;
      flex: 1;
    }
  }

  @include themed() {
    background: t("alice-blue");
  }
}

input {
  width: 75px;
  font-size: 24px;
  margin: 10px;
}

#finalGrade {
  padding: 10px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
