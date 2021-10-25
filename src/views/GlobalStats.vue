<template>
  <div id="global-stats">
    <div id="classes" :style="{ 'margin-right': $reactive.userOffsetWidth }">
      <div
        id="select-all"
        class="card flex-center material-icons"
        :class="{ selected: allClassesToggled }"
        @click="toggleAllClasses"
      >
        done_all
      </div>
      <div
        v-for="(classInfo, i) in classesList"
        :key="i"
        class="card flex-center"
        :class="{ selected: selectedClassesUrl.includes(classInfo.url) }"
        @click="classClicked(classInfo.url)"
      >
        <div>{{ classInfo.name }}</div>
        <div v-if="classInfo.finalGrade" id="final-grade">
          ({{ formatNum(classInfo.finalGrade) }})
        </div>
      </div>
    </div>
    <div id="stats-container" class="flex-center">
      <div v-if="shouldUserWait">
        Učitavanje statistike prvi put može potrajati.
        <span class="material-icons" v-tooltip="infoTooltip"> info </span>
        <div
          class="button"
          style="margin-top: 15px"
          @click="shouldUserWait = false"
        >
          Pokreni
        </div>
      </div>
      <div v-else class="abs-cover">
        <Stats
          :selectedClassesId="selectedClassesId"
          @sectionLoading="showSpinner = true"
          @sectionLoaded="showSpinner = false"
        ></Stats>
      </div>
      <Spinner :visible="showSpinner" :size="'125px'" blur></Spinner>
    </div>
  </div>
</template>

<script lang="ts">
import Spinner from "@/components/Spinner.vue";
import Stats from "@/components/stats/Stats.vue";
import { formatNum } from "@/scripts/utils";
import { ClassInfo } from "@/store/state";
import { defineComponent } from "vue";

export default defineComponent({
  name: "GlobalStats",
  components: { Stats, Spinner },
  created() {
    this.toggleAllClasses();
    this.shouldUserWait = this.classesList.some(
      (classInfo) => !classInfo.cachedSubjects,
    );
  },
  data() {
    return {
      selectedClassesUrl: [] as string[],
      shouldUserWait: false,
      infoTooltip: {
        content: /* html */ `
          Nakon što se učitaju svi podaci prethodnih godina, više se neće ažurirati.<br>
          Podaci se mogu ažurirati pojedinačno ulaskom u razred i klikom na
          <span class="material-icons">sync</span>`,
        html: true,
      },
      showSpinner: false,
    };
  },
  methods: {
    classClicked(url: string) {
      const idx = this.selectedClassesUrl.indexOf(url);
      if (idx == -1) this.selectedClassesUrl.push(url);
      else this.selectedClassesUrl.splice(idx, 1);
    },
    toggleAllClasses() {
      if (this.allClassesToggled) this.selectedClassesUrl = [];
      else this.selectedClassesUrl = this.classesList.map((c) => c.url);
    },
    formatNum: (num: string) => formatNum(num),
  },
  computed: {
    classesList(): ClassInfo[] {
      return this.user ? this.user.classesList : [];
    },
    allClassesToggled(): boolean {
      return this.selectedClassesUrl.length == this.classesList.length;
    },
    selectedClassesId(): string[] {
      return this.selectedClassesUrl.map((url) => url.match(/\d+/)![0]);
    },
  },
});
</script>

<style lang="scss" scoped>
#global-stats {
  height: 100%;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

#stats-container {
  position: relative;
  flex: 1;
}

#classes {
  display: flex;
  flex-wrap: wrap;
  padding-right: 20px;

  & > div {
    user-select: none;
    cursor: pointer;
    height: 44px;
    padding: 5px 20px;
    margin: 0 20px 10px;
    opacity: 0.5;
    transition: color 150ms, background-color 150ms, opacity 150ms;

    @include themed() {
      background-color: t("alice-blue-light");

      &.selected {
        opacity: 1;
        color: t("strong-blue") !important;
        background-color: t("white-background");
      }

      &:hover {
        color: t("dark-blue");
      }
    }
  }
}

#select-all {
  flex: 0 !important;
  padding: 0 20px !important;
}

#final-grade {
  margin-left: 10px;
  font-weight: bold;
}

#stats {
  margin: 0 20px;
}
</style>