<template>
  <div
    id="navbar"
    :class="{
      'nav-collapsed': navCollapsed,
      shadow: $route.path.includes('/stranica/'),
    }"
  >
    <div id="nav-top">
      <a
        id="app-logo"
        href="https://www.carnet.hr/usluga/e-dnevnik-za-ucenike-i-roditelje/"
        target="_blank"
      >
        <img src="@/assets/img/logo.png" />
      </a>
      <a
        href="https://ednevnik.plus"
        target="_blank"
        id="main-title"
        class="text"
        style="--order: 1"
      >
        e-Dnevnik
      </a>
    </div>
    <transition name="navbar" @enter="initResizeObserver">
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
        <!-- <span id="more-horiz" class="material-icons flex-center">
          more_horiz
        </span> -->
        <NavbarList
          :list="websites"
          rootLink="/stranica/"
          :order="5"
          :navCollapsed="navCollapsed"
        ></NavbarList>
      </div>
      <div v-else id="welcome" class="abs-center text" style="--order: 5">
        Dobro došli!
      </div>
    </transition>
    <div id="nav-bottom">
      <transition name="navbar">
        <div v-if="!isLoginPage">
          <NavbarAds :ads="ads" :navCollapsed="navCollapsed"></NavbarAds>
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

<script lang="ts">
import { Ad } from "@/store/state";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";
import NavbarAds from "./NavbarAds.vue";
import NavbarList from "./NavbarList.vue";

const toast = useToast();

export interface NavbarLink {
  name: string;
  icon: string;
  blinking?: boolean;
}

export default defineComponent({
  name: "Navbar",
  components: { NavbarList, NavbarAds },
  data() {
    return {
      navMidOverflowing: false,
      mounted: false,
      linksTop: [
        {
          name: "Razred",
          icon: "school",
        },
        {
          name: "Kalendar",
          icon: "edit_calendar",
        },
        {
          name: "Statistika ocjena",
          icon: "equalizer",
        },
        {
          name: "Kalkulator bodova",
          icon: "table_view",
        },
      ] as NavbarLink[],
      linksBottom: [
        {
          name: "Postavke",
          icon: "settings",
        },
        {
          name: "O aplikaciji",
          icon: "help_outline",
        },
      ] as NavbarLink[],
      ads: [] as Ad[],
      navCollapsed: false,
    };
  },
  created() {
    this.$emitter.on("show-banners", (ads: Ad[]) => {
      this.ads = ads;
    });
  },
  mounted() {
    // If navbar is expanded, always show a "welcome" message for a second
    setTimeout(() => (this.mounted = true), this.navCollapsed ? 100 : 1000);
    if (!chrome.storage) return;
    chrome.storage.sync.get(["newUpdates", "updateNotif", "ads"], (data) => {
      this.linksBottom[1].blinking = data.newUpdates;
      if (data.updateNotif) {
        toast.success(
          "Proširenje je ažurirano! Nova verzija: " +
            chrome.runtime.getManifest().version,
          {
            timeout: 10000,
          },
        );
        chrome.storage.sync.remove("updateNotif");
      }
      this.ads = data.ads || [];
    });
  },
  methods: {
    initResizeObserver() {
      if (!this.isLoginPage)
        new ResizeObserver(this.customListChanged).observe(
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
    isLoginPage(): boolean {
      return this.$route.path == "/" || !this.mounted;
    },
    websites(): NavbarLink[] {
      const icons = {
        "Školska stranica": "home",
        "Školski e-Rudnik": "bubble_chart",
        "Srednja.hr": "whatshot",
      } as Record<string, string>;
      return this.user
        ? this.user.settings.websitesSettings
            .filter((website) => !website.disabled)
            .map(({ name }) => ({ name, icon: icons[name] || "web" }))
        : [];
    },
    /*
    // removed due to ads
    navCollapsed: {
      get(): boolean {
        return this.$store.state.settings.navbarCollapsed;
      },
      set(value: boolean) {
        this.$store.commit(MutationTypes.UPDATE_GLOBAL_SETTING, {
          name: "navbarCollapsed",
          value,
        });
      },
    }, */
  },
});
</script>

<style lang="scss" scoped>
$collapse-duration: 500ms;
$nav-shadow-top: 0 1px 0 #ffffff1a inset;
$nav-shadow-bottom: 0 -1px 0 #ffffff1a inset;

@mixin text-hidden {
  transform: translateY(10px);
  opacity: 0;
  transition: transform 150ms, opacity 150ms;
}

#navbar {
  position: relative;
  background-attachment: fixed;
  background-image: url("~@/assets/img/nav-background.png");
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
  max-width: $navbar-max-width;
  transition: max-width $collapse-duration, box-shadow $views-transition;
  z-index: 1;

  &.shadow {
    box-shadow: 0 0 10px black;
  }

  @include themed() {
    background-color: t("dark-dark-blue");
  }
}

#nav-top,
#nav-bottom :deep(a),
#nav-mid :deep(a) {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 30px;
  box-shadow: $nav-shadow-bottom;
}

#nav-top {
  align-items: flex-start;
  padding-top: 15px;
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
  margin-top: auto;
  box-shadow: $nav-shadow-top !important;
}

#nav-mid :deep(a),
#nav-bottom :deep(a:not(#collapse)) {
  color: $navbar-text-color;
  transition: background-color 150ms, color 150ms, opacity 150ms;

  .material-icons {
    padding-right: 15px;
  }

  &:hover {
    cursor: pointer;
    background-color: #ffffff14;
  }
}

#nav-top {
  height: 104px !important;
  user-select: none;
}

#more-horiz {
  width: 100%;
  height: 25px;
  box-shadow: $nav-shadow-bottom;

  @include themed() {
    color: t("gray-blue");
  }
}

:deep(.text) {
  transition: transform 150ms calc(150ms + var(--order) * 20ms),
    opacity 150ms calc(150ms + var(--order) * 20ms), color 150ms,
    text-shadow 150ms;
}

#app-logo {
  margin: 3px 25px 0 0;

  img {
    height: 50px;
    border-radius: 10px;
    box-shadow: 0 0 20px -5px #2296da;
    transition: transform $collapse-duration - 100ms,
      height $collapse-duration - 100ms, box-shadow 150ms;
  }

  &:hover img {
    box-shadow: 0 0 20px -2px #2296da;
  }
}

#main-title {
  position: relative;
  font-size: 2rem;
  line-height: 35px;
  color: white;
  text-shadow: 0 0 20px $plus-color;

  &::after {
    content: "Plus";
    position: absolute;
    right: 0;
    top: 100%;
    font-style: italic;
    font-size: 1.1rem;
    line-height: 0.8rem;
    color: $plus-color;
    text-shadow: 0 0 20px white;
  }

  &:hover {
    text-shadow: 0 0 25px white;
  }
}

#welcome {
  font-size: 1.5rem;
  letter-spacing: 2px;
  pointer-events: none;
  color: white;
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
  font-size: 3rem;
  width: 35px;
  box-shadow: none !important;
  transition: color 150ms, transform $collapse-duration;

  @include themed() {
    color: t("gray-blue");
  }
}

.nav-collapsed {
  max-width: 84px !important;

  #app-logo img {
    height: 44px;
    transform: translateX(-11px);
  }

  #welcome {
    transform: translate(-50%, calc(-50% + 10px)) !important;
  }

  #collapse-arrow {
    transform: scale(-1);
  }

  :deep(.text) {
    @include text-hidden;
  }
}

/* transitions */

.navbar-enter-active,
.navbar-leave-active {
  transition: opacity $views-transition !important;
}

.navbar-enter-from,
.navbar-leave-to {
  opacity: 0;

  :deep(.text) {
    @include text-hidden;
  }
}
</style>
