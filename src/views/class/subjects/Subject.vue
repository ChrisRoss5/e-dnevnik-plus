<template>
  <ClassSectionFrame :isSubject="true" class="subject">
    <div id="subject-info">
      <div class="subject-name">{{ subject.name }}</div>
      <div class="teachers">{{ subject.teachers }}</div>
      <router-link :to="$route.path.replace(/\/\d+$/, '')" id="close">
        <div class="teachers">IZVORNI PRIKAZ</div>
        <span class="material-icons"> close </span>
      </router-link>
    </div>
  </ClassSectionFrame>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ExtendedSubjectCache } from "@/views/class/subjects/Subjects.vue";
import ClassSectionFrame from "@/views/class/ClassSectionFrame.vue";

export default defineComponent({
  name: "Subject",
  components: { ClassSectionFrame },
  props: {
    subject: {
      type: [Object, Boolean] as PropType<ExtendedSubjectCache | false>,
    },
  },
});
</script>

<style lang="scss" scoped>
.subject {
  position: relative;
  flex-shrink: 0;
  margin: 5px 10px !important;
}

#subject-info {
  display: flex;
  margin: 0 20px 10px;
}

#close {
  flex: 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;

  span {
    @include themed() {
      color: t("gray-blue");
    }
  }
}
</style>
