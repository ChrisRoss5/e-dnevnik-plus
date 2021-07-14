<template>
  <div v-if="openedClassInfo" id="class-container" ref="classContainer">
    <div id="class-info">
      <div>{{ openedClassInfo.name }}</div>
      <div>
        <div class="expand-arrow material-icons">arrow_drop_down</div>
        <div class="title">Godina:</div>
        <div class="name">{{ openedClassInfo.year }}</div>
      </div>
      <div v-if="openedClass">
        <div class="expand-arrow material-icons">arrow_drop_down</div>
        <div class="title">Razrednik:</div>
        <div class="name">{{ openedClass.headTeacher }}</div>
      </div>
      <div>
        <div class="expand-arrow material-icons">arrow_drop_down</div>
        <div class="title">Škola:</div>
        <div class="name">{{ openedClassInfo.school }}</div>
      </div>
    </div>
    <div id="sections" ref="sections">
      <router-link
        v-for="(tab, i) in tabs"
        :key="i"
        :to="tab.name.toLowerCase()"
        @click.self="userNavigated($event)"
      >
        <span class="material-icons"> {{ tab.icon }} </span>
        <div>{{ tab.name }}</div>
      </router-link>
      <div id="line"></div>
      <div id="selected-line" ref="selectedLine"></div>
    </div>
    <div id="class-section">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ClassInfo, Class } from "@/store/state";
/* import { mapGetters } from "vuex"; */

export default defineComponent({
  name: "Class",
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
    };
  },
  mounted() {
    (
      (this.$refs.classContainer as HTMLElement).parentElement as HTMLElement
    ).onscroll = this.mainScrolled;
    new (window as any).ResizeObserver(this.navResized).observe(
      this.$refs.sections as HTMLElement,
    );
  },
  methods: {
    userNavigated(e: MouseEvent | HTMLElement) {
      const target = (e as MouseEvent).target;
      const { offsetLeft, offsetWidth } = (target || e) as HTMLElement;
      const line = this.$refs.selectedLine as HTMLElement;
      line.style.transition = target ? "width 500ms, transform 500ms" : "none";
      line.style.transform = `translateX(${offsetLeft}px)`;
      line.style.width = offsetWidth + "px";
    },
    navResized() {
      const sections = this.$refs.sections as HTMLElement;
      const activeSection = sections.querySelector(".router-link-active");
      if (activeSection) this.userNavigated(activeSection as HTMLElement);
    },
    mainScrolled(e: Event) {
      const main = e.target as HTMLElement;
      const user = document.getElementById("user") as HTMLElement;
      const sections = this.$refs.sections as HTMLElement;
      const short = main.scrollTop > 30;
      sections.style.paddingRight = short ? user.offsetWidth + 80 + "px" : "";
      user.className = short ? "card" : "";
    },
  },
  computed: {
    /* ...mapGetters(["openedClassInfo", "openedClass"]), // TODO: FIX TYPES */
    openedClassInfo(): ClassInfo | undefined {
      return this.$store.getters.openedClassInfo;
    },
    openedClass(): Class | undefined {
      return this.$store.getters.openedClass;
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

  & > div:first-child {
    display: inline-block;
    font-size: 55px;
    font-weight: bold;
    color: #1b3a57;
    line-height: 55px;
    height: 55px;
  }

  & > div:not(:first-child) {
    display: inline-grid;
    gap: 0px 0px;
    grid-auto-flow: row;
    color: #78909c;
    border-left: 1px solid #c3cfdd;
    padding-left: 20px;
    margin-left: 20px;
  }
}

.expand-arrow {
  grid-area: 1 / 2 / 3 / 3;
  font-size: 30px;
  padding-left: 15px;
  transition: color 150ms;

  &:hover {
    &,
    & ~ * {
      cursor: pointer;
      color: #1b3a57;
    }
  }
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

  * {
    pointer-events: none;
  }

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

#class-section {
  height: 200vh;
  /* background: linear-gradient(white, blue); */
}
</style>
