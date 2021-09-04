<template>
  <div id="section-container" class="card">
    <slot></slot>
    <iframe src="about:blank" ref="iframe" :class="{ loading }"></iframe>
    <Spinner :visible="loading" :size="'50px'"></Spinner>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { addStyleTag } from "@/scripts/utils";
import { getSectionHTML } from "@/scripts/scrapers";
import Spinner from "@/components/Spinner.vue";

export default defineComponent({
  name: "ClassSectionFrame",
  components: { Spinner },
  props: { isSubject: Boolean },
  mounted() {
    this.$nextTick(this.updateContent);
  },
  data() {
    return {
      loading: true,
      urls: {
        biljeske: "https://ocjene.skole.hr/notes",
        ispiti: "https://ocjene.skole.hr/exam",
        izostanci: "https://ocjene.skole.hr/absent",
        vladanja: "https://ocjene.skole.hr/behavior",
        raspored: "https://ocjene.skole.hr/schedule",
        "osobni-podaci": "https://ocjene.skole.hr/personal_data",
      },
      errorMessage: "Greška pri učitavanju stranice e-Dnevnika.",
    };
  },
  methods: {
    async updateContent() {
      this.loading = true;
      const { classId, subjectId } = this.$route.params;
      if (this.isSubject && !subjectId || classId == "-") return;

      const iframe = this.$refs.iframe as HTMLIFrameElement;
      const doc = iframe.contentWindow!.document;
      const pathName = this.$route.path.match(/[^/]+$/)![0];
      const url: string = this.isSubject
        ? "https://ocjene.skole.hr/grade/" + subjectId
        : (this.urls as any)[pathName];

      await addStyleTag(doc, this.$store.state.settings.darkTheme);
      const sectionEl = await getSectionHTML(classId as string, url);

      doc.body.innerHTML = "";
      doc.body.append(sectionEl || this.errorMessage);
      if (!sectionEl) doc.body.className = "loading-error-plus";
      const contentEl = doc.body.firstElementChild;
      if (contentEl) iframe.style.height = contentEl.scrollHeight + "px";

      this.loading = false;
    },
  },
  watch: {
    '$route.params.classId'() {
      this.updateContent();
    },
  },
});
</script>

<style lang="scss" scoped>
#section-container {
  position: relative;
  margin: 0 auto;
  width: 954px;
  min-width: 50%;
  padding: 10px;
}

iframe {
  transition: opacity 150ms;

  &.loading {
    opacity: 0;
  }
}
</style>
