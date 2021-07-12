<template>
  <div id="navbar" :class="{ 'nav-collapsed': navCollapsed }">
    <div id="nav-top">
      <img id="carnet-logo" src="@/assets/img/carnet-logo-2.png" />
      <div class="title">e-Dnevnik</div>
    </div>
    <div id="welcome" v-if="$route.name == 'Login'">Dobro došli!</div>
    <template v-else>
      <div class="title">
        Razred: <strong>{{ openedClass }}</strong>
      </div>
    </template>
    <div id="nav-bottom" @click="navCollapsed = !navCollapsed">
      <span id="collapse-arrow" class="material-icons"> chevron_left </span>
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
      openedClass: "4.C",
    };
  },
});
</script>

<style lang="scss" scoped>
$collapse-duration: 500ms;

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
  width: 20%;
  min-width: 320px;
  transition: width $collapse-duration, min-width $collapse-duration;

  & > div {
    display: flex;
    align-items: center;
    padding: 20px 30px;
    box-shadow: 0 -1px 0 #ffffff1a inset;

    img {
      padding-right: 25px;
    }

    title {
      font-size: 26px;
    }

    &:not(#nav-top):not(#nav-bottom) {
      transition: background-color 150ms, opacity 150ms;

      &:hover {
        cursor: pointer;
        background-color: #ffffff14;
      }
    }
  }
}

#nav-top {
  pointer-events: none;
}

#welcome {
  flex: 1;
  justify-content: center;
  font-size: 24px;
  letter-spacing: 2px;
  pointer-events: none;
}

#nav-bottom {
  user-select: none;
  margin-top: auto;
  box-shadow: 0 1px 0 #ffffff1a inset !important;
  cursor: pointer;

  &:hover #collapse-arrow {
    opacity: 1;
  }
}

#carnet-logo {
  height: 70px;
  transform-origin: left;
  transition: transform $collapse-duration;

  & + .title {
    font-size: 35px;
  }
}

#collapse-arrow {
  margin-left: auto;
  width: 20px;
  transform: scale(1.5);
  opacity: 0.5;
  transition: opacity 150ms, transform $collapse-duration;
}

.nav-collapsed {
  min-width: 0 !important;
  width: 100px !important;

  #carnet-logo {
    transform: scale(0.8) translateX(-12px);
  }

  #welcome {
    opacity: 0;
  }

  #collapse-arrow {
    margin: auto;
    transform: scale(-1.5);
  }
}
</style>