<template>
  <div id="class-container">
    <div id="class-info">
      <div id="class-title">
        {{ openedClassInfo ? openedClassInfo.name : "" }}
      </div>
      <div v-for="(dropdown, i) in dropdowns" :key="i" class="dropdown-info">
        <div
          :id="dropdown.id"
          class="expand-arrow material-icons hovered-text-button"
          @click="visibleDropdown = dropdown.id"
          v-wave
        >
          arrow_drop_down
        </div>
        <div class="title">{{ dropdown.title }}</div>
        <div class="name">{{ dropdown.name }}</div>
        <Dropdown
          :visible="visibleDropdown == dropdown.id"
          :list="dropdown.list"
          :sourceElementId="dropdown.id"
          @close="closeDropdown(dropdown.id)"
        ></Dropdown>
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
        <SlickItem v-for="(tab, i) in tabs" :key="i" :index="i">
          <router-link :to="tab.name.toLowerCase()" draggable="false">
            <span class="material-icons"> {{ tab.icon }} </span>
            <div>{{ tab.name }}</div>
            <div class="selected-line tab-drag"></div>
          </router-link>
        </SlickItem>
      </SlickList>
      <div id="line"></div>
      <div class="selected-line" ref="selectedLine"></div>
    </div>

    <!-- @/views/class components -->
    <div id="section">
      <router-view
        v-slot="{ Component }"
        :classURL="classURL"
        @sectionLoaded="showSpinner = false"
      >
        <transition :name="sectionTransition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <Spinner :visible="showSpinner" :size="'125px'"></Spinner>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { User, ClassInfo } from "@/store/state";
import { MutationTypes } from "@/store/mutations";
import Dropdown, { DropdownItem } from "@/components/Dropdown.vue";
import { SlickList, SlickItem } from "vue-slicksort";
import Spinner from "@/components/Spinner.vue";

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
  data() {
    return {
      classURL: "",
      showSpinner: false,
      tabs: [
        { name: "Ocjene", icon: "grade" },
        { name: "Bilješke", icon: "edit" },
        { name: "Ispiti", icon: "event_note" },
        { name: "Izostanci", icon: "timer_off" },
        { name: "Vladanja", icon: "error" },
        { name: "Raspored", icon: "date_range" },
        { name: "Statistika", icon: "show_chart" },
      ],
      visibleDropdown: "",
      sectionTransition: "",
    };
  },
  beforeMount() {
    if (!this.user) return;
    const _tabs = this.user.settings.classTabsOrder;
    if (!_tabs) return;
    this.tabs = _tabs.map((name) => this.tabs.find((tab) => tab.name == name)!);
  },
  mounted() {
    this.$nextTick(this.classChanged);
    this.userNavigated();
    this.$emitter.on("main-scrolled", this.mainScrolled);
    new (window as any).ResizeObserver(() => this.userNavigated()).observe(
      this.getSectionsContainer(),
    );
  },
  beforeUnmount() {
    this.$emitter.off("main-scrolled", this.mainScrolled);
    /* ResizeObserver is automatically unobserved on reference deletion! */
  },
  methods: {
    tabsSortingEvent(started: boolean) {
      const line = this.$refs.selectedLine as HTMLElement;
      const sections = this.getSectionsContainer();
      for (const anchor of sections.querySelectorAll("a")) {
        const _line = anchor.lastElementChild as HTMLElement;
        const s = started && anchor.classList.contains("router-link-active");
        _line.style.display = s ? "block" : "none";
      }
      line.style.display = started ? "none" : "block";
    },
    tabsOrderChanged() {
      this.user &&
        this.$store.commit(MutationTypes.UPDATE_CLASS_TABS_ORDER, {
          user: this.user,
          tabs: this.tabs.map((tab) => tab.name),
        });
      const sections = this.getSectionsContainer();
      sections.classList.add("no-transition");
      this.$nextTick(() => {
        this.userNavigated();
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
      this.classURL = classId;
    },
    userNavigated(to?: string) {
      const line = this.$refs.selectedLine as HTMLElement;
      const sections = this.getSectionsContainer();
      if (!sections) return;
      const { offsetLeft, offsetWidth } = ((to &&
        [...sections.querySelectorAll("a")].find(
          (s) => s.getAttribute("href") == to,
        )) ||
        sections.querySelector(".router-link-active")) as HTMLElement;
      line.style.transition = to ? "width 500ms, transform 500ms" : "none";
      line.style.transform = `translateX(${offsetLeft}px)`;
      line.style.width = offsetWidth + "px";
    },
    mainScrolled() {
      const sections = this.getSectionsContainer();
      if (!sections) return;
      const main = document.getElementById("main")!;
      const user = document.getElementById("user")!;
      const short = main.scrollTop > 30;
      sections.style.paddingRight = short ? user.offsetWidth + 40 + "px" : "";
      sections.className = short ? "sticky" : "";
      user.classList[short ? "add" : "remove"]("card");
    },

    closeDropdown(id: string) {
      if (id == this.visibleDropdown) this.visibleDropdown = "";
    },
    getDropdownList(filterBy?: "headTeacher" | "school"): DropdownItem[] {
      return (
        filterBy
          ? this.classesList.filter((c) => c[filterBy] == this[filterBy])
          : this.classesList
      ).map((classInfo) => ({
        name: filterBy ? this[filterBy] : classInfo.year,
        alignRight: classInfo.name,
        link: { params: { classId: classInfo.url.match(/\d+/)![0] } },
        active: classInfo.url.includes(this.classURL),
      }));
    },
    getPathName(path: string): string {
      return path.slice(path.lastIndexOf("/") + 1);
    },
    getSectionsContainer(): HTMLElement {
      return this.$refs.sectionsContainer as HTMLElement;
    },
  },
  computed: {
    /* TODO: FIX mapGetters TYPES */
    user(): User | undefined {
      return this.$store.getters.user;
    },
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
      return this.openedClassInfo ? this.openedClassInfo.school : "";
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
          id: "teacher",
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
    tabNames(): string[] {
      return this.tabs.map((tab) => tab.name.toLowerCase());
    },
  },
  watch: {
    $route(to, from) {
      this.classChanged();
      this.userNavigated(to.href);
      const fromIdx = this.tabNames.indexOf(this.getPathName(from.path));
      const toIdx = this.tabNames.indexOf(this.getPathName(to.path));
      this.sectionTransition = toIdx < fromIdx ? "slide-right" : "slide-left";
      this.showSpinner = true;
    },
  },
});
</script>

<style>
body > div:last-child .router-link-active .tab-drag {
  display: block !important;
}
</style>

<style lang="scss" scoped>
#class-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

#class-info {
  display: flex;
  align-items: center;
  margin: 20px 30px 0;
}

#class-title {
  display: inline-block;
  font-size: 55px;
  font-weight: bold;
  color: #1b3a57;
  line-height: 55px;
  height: 55px;
  margin-right: 20px;
}

.dropdown-info {
  position: relative;
  display: inline-grid;
  gap: 0px 0px;
  grid-auto-flow: row;
  color: $light-gray-text;
  border-left: 1px solid #c3cfdd;
  padding-left: 20px;
}

.expand-arrow {
  grid-area: 1 / 2 / 3 / 3;
  font-size: 30px;
  padding: 0 15px;

  &:hover ~ .title,
  &:hover ~ .name {
    cursor: pointer;
    color: $hovered-text-button;
  }
}

.title,
.name {
  transition: color 150ms;
}

.title {
  grid-area: 1 / 1 / 2 / 2;
}

.name {
  grid-area: 2 / 1 / 3 / 2;
}

#sections-container {
  position: sticky;
  top: 0;
  padding: 30px 30px 0;
  transition: padding 150ms;

  &.sticky {
    backdrop-filter: blur(5px);
    background: #ffffffd1;
  }

  &.no-transition a {
    transition: none !important;
  }
}

#sections {
  display: flex;
  flex-wrap: wrap;

  & > div {
    flex: 1;
  }
}

a {
  position: relative;
  display: flex;
  justify-content: center;
  color: #476282;
  padding: 0 15px 15px;
  transition: color 500ms;

  .material-icons {
    padding-right: 5px;
  }

  &.router-link-active {
    color: $button-color;
  }
}

#line {
  width: 100%;
  height: 1.5px;
  background: #c3cfdd;
}

.selected-line {
  position: absolute;
  height: 3px;
  left: 0;
  bottom: 0;
  border-radius: 3px 3px 0 0;
  background: $button-color;
  transition-timing-function: cubic-bezier(0.35, 0, 0.25, 1);
  z-index: 1;

  &.tab-drag {
    bottom: -1.5px;
    right: 0;
    display: none;
  }
}

#section {
  position: relative;
  flex: 1;
  padding: 40px 30px;
  overflow: hidden;

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
