<template>
  <div id="class-container">
    <div
      id="class-info"
      :style="{ 'margin-right': $reactive.userOffsetWidth }"
      ref="classInfo"
    >
      <div id="class-title" class="title">
        {{ openedClassInfo ? openedClassInfo.name : "" }}
      </div>
      <div>
        <div v-for="(dropdown, i) in dropdowns" :key="i" class="dropdown-info">
          <div
            :id="dropdown.id"
            class="expand-arrow material-icons hovered-text-button"
            @click="visibleDropdown = dropdown.id"
            v-wave
          >
            arrow_drop_down
          </div>
          <div class="dropdown-title">{{ dropdown.title }}</div>
          <div class="dropdown-name">{{ dropdown.name }}</div>
          <Dropdown
            :visible="visibleDropdown == dropdown.id"
            :list="dropdown.list"
            :sourceElementId="dropdown.id"
            @close="closeDropdown(dropdown.id)"
          ></Dropdown>
        </div>
      </div>
      <div
        v-if="confirmedFinalGrade"
        id="confirmed-final-grade"
        class="card"
        v-tooltip.bottom="'Potvrđeni završni uspjeh (na svjedodžbi)'"
      >
        {{ confirmedFinalGrade }}
      </div>
    </div>
    <div id="sections-container" ref="sectionsContainer">
      <SlickList
        id="sections"
        v-model:list="tabs"
        axis="x"
        lockAxis="x"
        :lockOffset="30"
        :lockToContainerEdges="true"
        :distance="5"
        @sort-start="tabsSortingEvent(true)"
        @sort-end="tabsSortingEvent(false)"
        @sort-cancel="tabsSortingEvent(false)"
        @update:list="tabsOrderChanged"
      >
        <SlickItem
          v-for="(tab, i) in tabs"
          :key="tab.name"
          :index="i"
          class="section-item"
        >
          <router-link
            :to="getSectionPath(tab.name)"
            draggable="false"
            :class="{
              'router-link-active': $route.path.includes(
                tab.name.toLowerCase(),
              ),
            }"
          >
            <span class="material-icons"> {{ tab.icon }} </span>
            <div v-if="!tabsIconOnly" class="section-name">
              {{ tab.realName || tab.name }}
            </div>
            <div class="selected-line tab-drag"></div>
          </router-link>
        </SlickItem>
        <span
          id="sort"
          class="material-icons"
          v-tooltip.bottom-end="'Sortiraj kartice povlačenjem'"
        >
          swap_horiz
        </span>
      </SlickList>
      <div id="line"></div>
      <transition name="opacity">
        <div
          v-show="activeRouterLink"
          class="selected-line"
          ref="selectedLine"
        ></div>
      </transition>
    </div>

    <!-- @/views/class components -->
    <div id="section" v-if="classId">
      <router-view
        v-slot="{ Component }"
        :classId="classId"
        @sectionLoading="showSpinner = true"
        @sectionLoaded="showSpinner = false"
      >
        <transition :name="sectionTransition" mode="out-in">
          <component :is="Component" :key="triggerTransition" />
        </transition>
      </router-view>
      <Spinner :visible="showSpinner" :size="'125px'" blur></Spinner>
    </div>
  </div>
</template>

<script lang="ts">
import Dropdown, { DropdownItem } from "@/components/Dropdown.vue";
import Spinner from "@/components/Spinner.vue";
import { formatNum } from "@/scripts/utils";
import { ClassInfo } from "@/store/state";
import { defineComponent } from "vue";
import { SlickItem, SlickList } from "vue-slicksort";

interface DropdownInfo {
  id: string;
  title: string;
  name: string;
  list: DropdownItem[];
}

export default defineComponent({
  name: "Class",
  components: {
    Dropdown,
    SlickList,
    SlickItem,
    Spinner,
  },
  beforeMount() {
    if (!this.user) return;
    const _tabs = this.user.settings.classTabsOrder;
    this.tabs = _tabs.map((name) => this.tabs.find((tab) => tab.name == name)!);
  },
  mounted() {
    this.$nextTick(this.classChanged);
    this.$emitter.on("main-scrolled", this.mainScrolled);
    const resizeObserver = new ResizeObserver(() =>
      this.positionSelectedLine(false),
    );
    const sections = this.getSectionsContainer();
    if (sections) resizeObserver.observe(sections);
  },
  beforeUnmount() {
    this.$emitter.off("main-scrolled", this.mainScrolled);
    /* ResizeObserver is automatically unobserved on reference deletion! */
  },
  data() {
    return {
      classId: "",
      tabsIconOnly: false,
      showSpinner: false,
      tabs: [
        { name: "Ocjene", icon: "grade" },
        { name: "Biljeske", realName: "Bilješke", icon: "edit" },
        { name: "Ispiti", icon: "event_note" },
        { name: "Izostanci", icon: "timer_off" },
        { name: "Vladanja", icon: "error" },
        { name: "Raspored", icon: "date_range" },
        { name: "Statistika", icon: "equalizer" },
      ],
      visibleDropdown: "",
      sectionTransition: "",
      triggerTransition: 0,
      activeRouterLink: undefined as HTMLElement | undefined,
    };
  },
  methods: {
    tabsSortingEvent(started: boolean) {
      const line = this.$refs.selectedLine as HTMLElement;
      const sections = this.getSectionsContainer();
      if (!sections) return;
      for (const anchor of sections.querySelectorAll("a")) {
        const _line = anchor.lastElementChild as HTMLElement;
        const s = started && anchor.classList.contains("router-link-active");
        _line.style.display = s ? "block" : "none";
      }
      line.style.display = started ? "none" : "block";
    },
    tabsOrderChanged() {
      if (!this.user) return;
      const newOrder = this.tabs.map((t) => t.name);
      this.updateUserSettings("classTabsOrder", newOrder);
      const sections = this.getSectionsContainer();
      if (!sections) return;
      sections.classList.add("no-transition");
      this.$nextTick(() => {
        this.positionSelectedLine();
        sections.classList.remove("no-transition");
      });
    },
    classChanged() {
      if (!this.user) return;
      let classId = this.$route.params.classId as string;
      if (classId == "-") {
        // Match the newest class by default
        classId = this.user.classesList[0].url.match(/\d+/)![0];
        this.$router.replace({ params: { classId } });
      }
      this.classId = classId;
    },
    positionSelectedLine(transition?: boolean) {
      const sections = this.getSectionsContainer();
      if (!sections) return;
      this.activeRouterLink = sections.querySelector(
        ".router-link-active",
      ) as HTMLElement;
      if (this.activeRouterLink) {
        const line = this.$refs.selectedLine as HTMLElement;
        const { offsetLeft, offsetWidth } = this.activeRouterLink;
        line.style.transition = transition
          ? "width 500ms, transform 500ms"
          : "none";
        line.style.transform = "translateX(" + (offsetLeft + 30) + "px)";
        line.style.width = offsetWidth + "px";
      }
      const sectionsPadding = parseInt(sections.style.paddingRight) || 0;
      this.tabsIconOnly = sections.offsetWidth - sectionsPadding < 900;
    },
    mainScrolled(scrollTop: number) {
      const sections = this.getSectionsContainer();
      if (!sections) return;
      const short = scrollTop > 30;
      const paddingRight = parseInt(this.$reactive.userOffsetWidth) + 40;
      sections.style.paddingRight = short ? paddingRight + "px" : "";
      sections.className = short ? "blur" : "";
    },
    closeDropdown(id: string) {
      if (id == this.visibleDropdown) this.visibleDropdown = "";
    },
    getDropdownList(filterBy?: "headTeacher" | "school"): DropdownItem[] {
      return (filterBy
        ? this.classesList.filter((c) => c[filterBy] == this[filterBy])
        : this.classesList
      ).map((classInfo) => ({
        name: filterBy ? this[filterBy] : classInfo.year,
        alignRight: classInfo.name,
        link:
          "/razred/" +
          classInfo.url.match(/\d+/)![0] +
          "/" +
          this.getSectionName(this.$route.path),
        active: classInfo.url.includes(this.classId),
      }));
    },
    getSectionPath(name: string) {
      return "/razred/" + this.$route.params.classId + "/" + name.toLowerCase();
    },
    getSectionName(path: string) {
      return path.replace(/\/razred\/\d+\//, "").replace(/\/\d+$/, "");
    },
    getSectionsContainer() {
      return this.$refs.sectionsContainer as HTMLElement | undefined;
    },
  },
  computed: {
    /* TODO: FIX mapGetters TYPES!!! */
    openedClassInfo(): ClassInfo | undefined {
      return this.$store.getters.classInfo(
        this.$route.params.classId as string,
      );
    },
    classesList(): ClassInfo[] {
      return this.user ? this.user.classesList : [];
    },
    headTeacher(): string {
      return this.openedClassInfo ? this.openedClassInfo.headTeacher || "" : "";
    },
    school(): string {
      return this.openedClassInfo ? this.openedClassInfo.school || "" : "";
    },
    dropdowns(): DropdownInfo[] {
      return [
        {
          id: "year",
          title: "Godina:",
          name: this.openedClassInfo ? this.openedClassInfo.year : "",
          list: this.getDropdownList(),
        },
        {
          id: "headteacher",
          title: "Razrednik:",
          name: this.headTeacher,
          list: this.getDropdownList("headTeacher"),
        },
        {
          id: "school",
          title: "Škola:",
          name: this.school,
          list: this.getDropdownList("school"),
        },
      ];
    },
    confirmedFinalGrade(): string {
      const finalGrade =
        this.openedClassInfo && this.openedClassInfo.finalGrade;
      return finalGrade ? formatNum(finalGrade) : "";
    },
    tabNames(): string[] {
      return this.tabs.map((tab) => tab.name.toLowerCase());
    },
  },
  watch: {
    $route(to, from) {
      this.classChanged();
      this.$nextTick(() => this.positionSelectedLine(true));
      const toName = this.getSectionName(to.path);
      const fromName = this.getSectionName(from.path);
      if (
        toName == "osobni-podaci" ||
        fromName == "osobni-podaci" ||
        toName == "potvrde" ||
        fromName == "potvrde"
      ) {
        this.sectionTransition = "opacity";
        this.triggerTransition += 1;
        return;
      }
      const toIdx = this.tabNames.indexOf(toName);
      const fromIdx = this.tabNames.indexOf(fromName);
      if (toIdx != fromIdx && fromIdx != -1) this.triggerTransition += 1;
      this.sectionTransition = toIdx < fromIdx ? "slide-right" : "slide-left";
    },
  },
});
</script>

<style lang="scss">
body > .section-item {
  z-index: 10 !important;

  .router-link-active .tab-drag {
    display: block !important;
  }
}
</style>

<style lang="scss" scoped>
#class-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

#class-info {
  display: flex;
  align-items: center;
  margin: 15px 30px 0;
}

#class-title {
  margin-right: 20px;
}

.dropdown-info {
  position: relative;
  display: inline-grid;
  padding: 2px 0 2px 20px;

  @include themed() {
    color: t("light-gray");
    border-left: 1px solid t("light-border-color");
  }
}

.expand-arrow {
  grid-area: 1 / 2 / 3 / 3;
  font-size: 30px;
  padding: 0 15px;

  &:hover ~ .dropdown-title,
  &:hover ~ .dropdown-name {
    cursor: pointer;

    @include themed() {
      color: t("dark-blue");
    }
  }
}

.dropdown-title,
.dropdown-name {
  transition: color 150ms;
}

.dropdown-title {
  grid-area: 1 / 1 / 2 / 2;
}

.dropdown-name {
  grid-area: 2 / 1 / 3 / 2;
}

#confirmed-final-grade {
  background: #4caf50;
  color: white;
  padding: 5px 10px;
  margin-left: 15px;
}

#sections-container {
  position: sticky;
  top: 0;
  padding: 25px 30px 0;
  transition: padding 150ms;
  z-index: 6;
  will-change: padding;

  &.blur {
    @include themed() {
      background: rgba(t("white-background"), 0.75);
    }
  }

  &.no-transition a {
    transition: none !important;
  }
}

#sections {
  position: relative;
  display: flex;
}

.section-item {
  flex: 1;
  z-index: 1;
}

.section-name {
  padding-left: 5px;
}

a {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 15px 15px;
  transition: color 500ms;

  @include themed() {
    color: t("gray-blue");

    &.router-link-active {
      color: t("strong-blue");
    }
  }
}

#sort {
  position: absolute;
  top: -20px;
  right: 0;
  color: #47628282;
  z-index: 1;
}

#line {
  width: 100%;
  height: 1.5px;

  @include themed() {
    background: t("light-border-color");
  }
}

.selected-line {
  position: absolute;
  height: 3px;
  left: 0;
  bottom: 0;
  border-radius: 3px 3px 0 0;
  transition-timing-function: cubic-bezier(0.35, 0, 0.25, 1);
  z-index: 1;

  &.tab-drag {
    bottom: -1.5px;
    right: 0;
    display: none;
  }

  @include themed() {
    background: t("strong-blue");
  }
}

#section {
  position: relative;
  flex: 1;
  margin: 40px 20px;

  & > div {
    transition: opacity $views-transition, transform $views-transition;
  }
}

/* transitions */

.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(-50px);
  opacity: 0;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
</style>
