<template>
  <div
    id="section-container"
    class="card"
    :style="{ width: isSubject ? '60%' : '' }"
  >
    <slot></slot>
    <iframe src="about:blank" ref="iframe" :class="{ loading }"></iframe>
    <Spinner :visible="loading" :size="'50px'"></Spinner>
  </div>
</template>

<script lang="ts">
import Spinner from "@/components/Spinner.vue";
import { getOriginalSectionPage } from "@/scripts/scrapers/scrapers";
import { defineComponent } from "vue";

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
      } as Record<string, string>,
      errorMessage: "Greška pri učitavanju stranice e-Dnevnika.",
    };
  },
  methods: {
    async updateContent() {
      this.loading = true;
      const { classId, subjectId } = this.$route.params;
      if ((this.isSubject && !subjectId) || classId == "-" || !classId) return;

      const iframe = this.$refs.iframe as HTMLIFrameElement;
      const doc = iframe.contentWindow!.document;
      const pathName = this.$route.path.match(/[^/]+$/)![0];
      const url = this.isSubject
        ? "https://ocjene.skole.hr/grade/" + subjectId
        : this.urls[pathName];
      const page = await getOriginalSectionPage(classId as string, url);
      await this.addStyleTag(doc, page ? page.styleURL : "", pathName);
      if (!page) doc.body.className = "loading-error-plus";
      doc.body.innerHTML = "";
      doc.body.append(page ? page.content : this.errorMessage);
      iframe.style.height = "150px";
      const contentEl = doc.body.firstElementChild;
      if (contentEl) iframe.style.height = contentEl.scrollHeight + "px";
      this.loading = false;
    },
    addStyleTag(doc: Document, href: string, pathName: string) {
      return new Promise<void>((resolve) => {
        const docHead = doc.getElementsByTagName("head")[0];
        const link = docHead.appendChild(doc.createElement("link"));
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        link.onload = link.onerror = () => resolve();
        if (!href) resolve();
        docHead.appendChild(this.getCustomStyle(pathName == "raspored"));
      });
    },
    getCustomStyle(showAll: boolean) {
      const style = document.createElement("style");
      style.textContent =
        /* css */ `
          * {
            background: transparent !important;
            transition: none !important;
          }
          .loading-error-plus {
            display: grid;
            place-content: center;
          }
          .hide {
            display: ${showAll ? "flex" : "none"} !important;
          }
      ` +
        (this.$store.state.settings.darkTheme
          ? /* css */ `
          body, * {
            color: white;
            border-color: #2d2d2d !important;
            box-shadow: none !important;
          }`
          : "");
      return style;
    },
  },
  watch: {
    "$route.params.classId"() {
      this.updateContent();
    },
    "$route.params.subjectId"() {
      this.updateContent();
    },
  },
});
</script>

<style lang="scss" scoped>
#section-container {
  position: relative;
  margin: 0 auto;
  width: $original-page-width;
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
