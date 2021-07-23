<template>
  <div v-if="user" id="class-container">
    <div id="class-info">
      <div id="class-title">
        {{ openedClassInfo ? openedClassInfo.name : "" }}
      </div>
      <div v-for="(dropdown, i) in dropdowns" :key="i" class="dropdown-info">
        <div
          :id="dropdown.id"
          class="expand-arrow material-icons hovered-text-button"
          @click="visibleDropdown = dropdown.id"
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
    <div id="sections" ref="sections">
      <router-link
        v-for="(tab, i) in tabs"
        :key="i"
        :to="tab.name.toLowerCase()"
      >
        <span class="material-icons"> {{ tab.icon }} </span>
        <div>{{ tab.name }}</div>
      </router-link>
      <div id="line"></div>
      <div id="selected-line" ref="selectedLine"></div>
    </div>
    <div id="section">
      <router-view v-slot="{ Component }">
        <transition :name="sectionTransition">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { User, ClassInfo, Class } from "@/store/state";
import Dropdown, { DropdownItem } from "@/components/Dropdown.vue";
/* import { mapGetters } from "vuex"; */

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
  },
  data() {
    return {
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
  mounted() {
    this.userNavigated();
    this.$emitter.on("main-scrolled", this.mainScrolled);
    new (window as any).ResizeObserver(() => this.userNavigated()).observe(
      this.$refs.sections as HTMLElement,
    );
  },
  beforeUnmount() {
    this.$emitter.off("main-scrolled", this.mainScrolled);
    /* ResizeObserver is automatically unobserved on reference deletion! */
  },
  methods: {
    userNavigated(to?: string) {
      const sections = this.$refs.sections as HTMLElement;
      if (!sections) return;
      const { offsetLeft, offsetWidth } = ((to &&
        [...sections.children].find((s) => s.getAttribute("href") == to)) ||
        sections.querySelector(".router-link-active")) as HTMLElement;
      const line = this.$refs.selectedLine as HTMLElement;
      line.style.transition = to ? "width 500ms, transform 500ms" : "none";
      line.style.transform = `translateX(${offsetLeft}px)`;
      line.style.width = offsetWidth + "px";
    },
    mainScrolled() {
      const sections = this.$refs.sections as HTMLElement;
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
      ).map((c) => ({
        name: filterBy ? this[filterBy] : c.year,
        alignRight: c.name,
      }));
    },
    getPathName(path: string): string {
      return path.slice(path.lastIndexOf("/") + 1);
    },
  },
  computed: {
    /* ...mapGetters(["openedClassInfo", "openedClass"]), // TODO: FIX TYPES */
    user(): User | undefined {
      return this.$store.getters.user;
    },
    openedClassInfo(): ClassInfo | undefined {
      return this.$store.getters.openedClassInfo;
    },
    openedClass(): Class | undefined {
      return this.$store.getters.openedClass;
    },
    classesList(): ClassInfo[] {
      return this.user ? this.user.classesList : [];
    },
    headTeacher(): string {
      return this.openedClassInfo ? this.openedClassInfo.headTeacher : "";
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
      this.userNavigated(to.href);
      const fromIdx = this.tabNames.indexOf(this.getPathName(from.path));
      const toIdx = this.tabNames.indexOf(this.getPathName(to.path));
      this.sectionTransition = toIdx < fromIdx ? "slide-right" : "slide-left";
    },
  },
});
</script>

<style lang="scss" scoped>
#class-container {
  position: relative;
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
}

.dropdown-info {
  position: relative;
  display: inline-grid;
  gap: 0px 0px;
  grid-auto-flow: row;
  color: $light-gray-text;
  border-left: 1px solid #c3cfdd;
  padding-left: 20px;
  margin-left: 20px;
}

.expand-arrow {
  grid-area: 1 / 2 / 3 / 3;
  font-size: 30px;
  padding-left: 15px;

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

#sections {
  position: sticky;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  padding: 30px 30px 0;
  transition: padding 150ms;

  &.sticky {
    backdrop-filter: blur(5px);
    background: #ffffffd1;
  }
}

a {
  display: flex;
  flex: 1;
  justify-content: center;
  color: #476282;
  padding: 0 15px 15px;
  transition: color 500ms;

  .material-icons {
    padding-right: 5px;
  }

  &:first-child {
    padding-left: 0;
    margin-left: 0;
  }

  &:last-child {
    padding-right: 0;
    margin-right: 0;
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

#selected-line {
  position: absolute;
  height: 3px;
  left: 0;
  bottom: 0;
  border-radius: 3px 3px 0 0;
  background: $button-color;
  transition-timing-function: cubic-bezier(0.35, 0, 0.25, 1);
  z-index: 1;
}

#section {
  height: 1000px;
  box-shadow: 0px 0px 200px #cecece;
  border: 1px solid gray;
  margin: 20px 80px;
}

/* transitions */
</style>
