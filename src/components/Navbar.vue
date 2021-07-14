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
    <div
      v-if="$route.name == 'Login'"
      id="welcome"
      class="flex-center text"
      style="--order: 5"
    >
      Dobro došli!
    </div>
    <div v-else id="nav-mid">
      <router-link to="/razred/_">
        <span class="material-icons"> school </span>
        <div class="text" style="--order: 2">Razred</div>
      </router-link>
      <router-link to="/statistika">
        <span class="material-icons"> equalizer </span>
        <div class="text" style="--order: 3">Statistika ocjena</div>
      </router-link>
      <router-link to="/kalkulator-bodova">
        <span class="material-icons"> functions </span>
        <div class="text" style="--order: 4">Kalkulator bodova</div>
      </router-link>
      <span id="more-horiz" class="material-icons"> more_horiz </span>
      <router-link to="/stranica/školska-stranica">
        <span id="school" class="material-icons"> home </span>
        <div class="text" style="--order: 5">Školska stranica</div>
      </router-link>
      <router-link to="/stranica/loomen">
        <span class="material-icons"> apps </span>
        <div class="text" style="--order: 6">Loomen</div>
      </router-link>
      <router-link to="/stranica/srednja-hr">
        <span class="material-icons"> thumb_up </span>
        <div class="text" style="--order: 7">Srednja.hr</div>
      </router-link>
      <router-link to="/stranica/školski-e-rudnik">
        <span class="material-icons"> bubble_chart </span>
        <div class="text" style="--order: 8">Školski e-Rudnik</div>
      </router-link>
    </div>
    <div id="nav-bottom">
      <router-link to="/postavke" v-if="$route.name != 'Login'">
        <span class="material-icons"> settings </span>
        <div class="text" style="--order: 9">Postavke</div>
      </router-link>
      <a id="collapse" @click="navCollapsed = !navCollapsed">
        <div id="collapse-arrow" class="material-icons">chevron_left</div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" scoped>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navbar",
  data() {
    return {
      navCollapsed: false,
      openedClassYear: "20/21",
    };
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
#nav-bottom > a,
#nav-mid > a {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  box-shadow: $nav-shadow-bottom;
}
#nav-top {
  user-select: none;
}
#nav-mid > a,
#nav-bottom > a:not(#collapse) {
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
#nav-bottom {
  user-select: none;
  margin-top: auto;
  box-shadow: $nav-shadow-top !important;
  cursor: pointer;
}

#more-horiz {
  width: 100%;
  padding: 20px 0;
  text-align: center;
  color: $user-color;
  box-shadow: $nav-shadow-bottom;
}

.text {
  transition: transform 150ms calc(200ms + var(--order) * 25ms),
    opacity 150ms calc(200ms + var(--order) * 25ms), color 150ms;
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

#collapse-arrow {
  margin-left: auto;
  font-size: 50px;
  width: 35px;
  color: $user-color;
  box-shadow: none !important;
  transition: color 150ms, transform $collapse-duration;
}
#collapse:hover #collapse-arrow {
  color: white;
}

.router-link-active {
  background: $navbar-selected ;
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
    margin: auto;
    transform: scale(-1);
  }

  .text {
    transform: translateY(10px);
    opacity: 0;
    transition: transform 150ms, opacity 150ms;
  }
}
</style>