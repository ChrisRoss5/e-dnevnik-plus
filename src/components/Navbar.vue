<template>
  <div id="navbar" :class="{ 'nav-collapsed': navCollapsed }">
    <div id="nav-top">
      <a id="carnet-logo" href="https://www.carnet.hr/" target="_blank">
        <img src="@/assets/img/carnet-logo-2.png" />
      </a>
      <a
        href="https://www.carnet.hr/usluga/e-dnevnik-za-ucenike-i-roditelje/"
        target="_blank"
        class="title text"
        style="--order: 1"
      >
        e-Dnevnik
      </a>
    </div>
    <transition
      :name="transitionName"
      mode="out-in"
      @enter="initResizeObserver"
    >
      <div
        v-if="!isLoginPage"
        id="nav-mid"
        ref="navMid"
        :class="{ overflowing: navMidOverflowing }"
      >
        <NavbarList
          :list="linksTop"
          rootLink="/"
          :order="2"
          :navCollapsed="navCollapsed"
        ></NavbarList>
        <span id="more-horiz" class="material-icons"> more_horiz </span>
        <NavbarList
          :list="pages"
          rootLink="/stranica/"
          :order="5"
          :navCollapsed="navCollapsed"
        ></NavbarList>
      </div>
      <div v-else id="welcome" class="flex-center text" style="--order: 5">
        Dobro došli!
      </div>
    </transition>
    <div id="nav-bottom">
      <transition :name="transitionName" mode="out-in">
        <div v-if="!isLoginPage">
          <NavbarList
            :list="linksBottom.slice(0, -1)"
            rootLink="/"
            :order="8"
            :navCollapsed="navCollapsed"
          ></NavbarList>
        </div>
        <div v-else></div>
      </transition>
      <NavbarList
        :list="linksBottom.slice(-1)"
        rootLink="/"
        :order="9"
        :navCollapsed="navCollapsed"
      ></NavbarList>
      <a id="collapse" @click="navCollapsed = !navCollapsed">
        <div id="collapse-arrow" class="material-icons">chevron_left</div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" scoped>
import { defineComponent } from "vue";
import NavbarList from "./NavbarList.vue";

export default defineComponent({
  name: "Navbar",
  components: { NavbarList },
  data() {
    return {
      transitionName: "",
      navCollapsed: false,
      navMidOverflowing: false,
      linksTop: [
        {
          name: "Razred",
          icon: "school",
        },
        {
          name: "Statistika ocjena",
          icon: "equalizer",
        },
        {
          name: "Kalkulator bodova",
          icon: "functions",
        },
      ],
      pages: [
        {
          name: "Školska stranica",
          icon: "home",
        },
        {
          name: "Loomen",
          icon: "apps",
        },
        {
          name: "Srednja.hr",
          icon: "thumb_up",
        },
        {
          name: "Školski e-Rudnik",
          icon: "bubble_chart",
        },
      ],
      linksBottom: [
        {
          name: "Postavke",
          icon: "settings",
        },
        {
          name: "O aplikaciji",
          icon: "help_outline",
        },
      ],
    };
  },
  mounted() {
    setTimeout(() => (this.transitionName = "navbar"), 500);
    this.initResizeObserver();
  },
  methods: {
    initResizeObserver() {
      !this.isLoginPage &&
        new (window as any).ResizeObserver(this.customListChanged).observe(
          this.$refs.navMid as HTMLElement,
        );
    },
    customListChanged() {
      const navMid = this.$refs.navMid as HTMLElement | undefined;
      this.navMidOverflowing = navMid
        ? navMid.offsetHeight < navMid.scrollHeight
        : false;
    },
  },
  computed: {
    isLoginPage() {
      return this.$route.name == "login";
    },
  },
});
</script>

<style lang="scss" scoped>
$collapse-duration: 500ms;
$nav-shadow-top: 0 1px 0 #ffffff1a inset;
$nav-shadow-bottom: 0 -1px 0 #ffffff1a inset;

#navbar {
  color: white;
  background-attachment: fixed;
  background-color: $main-color;
  background-image: url("~@/assets/img/nav-background.png");
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
  max-width: 350px;
  transition: max-width $collapse-duration;
}

#nav-top,
#nav-bottom :deep(a),
#nav-mid :deep(a) {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 20px 30px;
  box-shadow: $nav-shadow-bottom;
}

#nav-top {
  user-select: none;
}

#nav-mid {
  flex: 1;
  overflow: hidden auto;
  transition: box-shadow 150ms;

  &.overflowing {
    box-shadow: 0 0 5px 1px #476282;
  }
}

#nav-bottom {
  box-shadow: $nav-shadow-top !important;
}

#nav-mid :deep(a),
#nav-bottom :deep(a:not(#collapse)) {
  color: $navbar-color;
  transition: background-color 150ms, opacity 150ms;

  .material-icons {
    padding-right: 15px;
  }

  &:hover {
    cursor: pointer;
    background-color: #ffffff14;
  }
}

#nav-top,
#collapse {
  height: 110px !important;
}

#more-horiz {
  width: 100%;
  padding: 20px 0;
  text-align: center;
  color: $user-color;
  box-shadow: $nav-shadow-bottom;
}

:deep(.text) {
  transition: transform 150ms calc(150ms + var(--order) * 20ms),
    opacity 150ms calc(150ms + var(--order) * 20ms), color 150ms;
}

#carnet-logo {
  img {
    height: 70px;
    padding-right: 25px;
    transition: transform $collapse-duration - 100ms;
    transform-origin: 40% 50%;
  }

  & + .title {
    font-size: 35px;
    color: white;

    &:hover {
      color: #fffc;
    }
  }

  &:hover img {
    transform: rotate(360deg);
  }
}

#welcome {
  flex: 1;
  font-size: 24px;
  letter-spacing: 2px;
  pointer-events: none;
}

#collapse {
  flex-basis: 100%;
  cursor: pointer;

  &:hover #collapse-arrow {
    color: white;
  }
}

#collapse-arrow {
  margin-left: auto;
  font-size: 50px;
  width: 35px;
  color: $user-color;
  box-shadow: none !important;
  transition: color 150ms, transform $collapse-duration;
}

.router-link-active {
  background: $navbar-selected;
  color: $navbar-selected-text-color !important;
}

.nav-collapsed {
  max-width: 84px !important;

  #carnet-logo img {
    transform: scale(0.65) translate(-40px, -12px);

    &:hover {
      transform: scale(0.65) translate(-42px, -12px) rotate(360deg);
    }
  }

  #welcome {
    opacity: 0;
  }

  #collapse-arrow {
    transform: scale(-1);
  }

  :deep(.text) {
    transform: translateY(10px);
    opacity: 0;
    transition: transform 150ms, opacity 150ms;
  }
}

/* transitions */

.navbar-enter-active,
.navbar-leave-active {
  transition: opacity $views-transition;
}

.navbar-enter-from,
.navbar-leave-to {
  opacity: 0;
}
</style>