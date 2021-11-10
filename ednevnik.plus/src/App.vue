<template>
  <div id="heading">
    <router-link to="/" id="title">
      <div id="ed" class="ed">e-Dnevnik</div>
      <div id="plus" class="plus">Plus</div>
    </router-link>
    <div id="subtitle">Proširenje za školski e-Dnevnik</div>
  </div>
  <router-view class="router-view"> </router-view>
  <div id="footer" :class="{ default: $route.path != '/' }">
    <div style="color: gray">
      Ovo proširenje nije službena CARNET-ova aplikacija.
    </div>
    2019.-2021. |
    <a
      class="plus"
      href="mailto:kristijan.ros@gmail.com?subject=e-Dnevnik Plus — Kontakt"
    >
      kristijan.ros@gmail.com</a
    >
    |
    <router-link to="politika-privatnosti" class="plus">
      politika privatnosti</router-link
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  mounted() {
    const path = localStorage.getItem("path");
    if (path) {
      localStorage.removeItem("path");
      this.$router.replace(path);
    }
  },
});
</script>

<style lang="scss">
#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

#heading {
  text-align: center;
  margin: 40px 0 40px;
}

#title {
  font-size: 3.5rem;
  display: flex;
  justify-content: center;
}

#ed {
  transform: translateX(10px);
  opacity: 0;
  animation: show-ed 1s forwards;
}

#plus {
  transform: translateX(-5px);
  opacity: 0;
  animation: show-plus 600ms 400ms forwards;
}

@keyframes show-ed {
  to {
    transform: translateX(-5px);
    opacity: 1;
  }
}

@keyframes show-plus {
  to {
    transform: translateX(10px);
    opacity: 1;
  }
}

#subtitle {
  font-size: 1.3rem;
  letter-spacing: 2px;
  font-style: italic;
  color: $ed-color;
}

#footer {
  font-size: 0.75rem;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;

  &.default {
    position: relative;
    margin: 40px auto;
    text-align: center;
  }
}

@media only screen and (max-width: 768px) {
  .router-view {
    width: 100% !important;
  }

  #footer {
    position: relative;
    padding: 20px;
    text-align: center;
  }
}

/* transitions */
</style>
