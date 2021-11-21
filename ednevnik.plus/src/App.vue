<template>
  <div id="important">
    Nova verzija za učenike i roditelje je stigla!
    <strong
      >Postojeći korisnici trebaju potvrditi nova dopuštenja kako bi proširenje
      nastavilo raditi.</strong
    >
  </div>
  <div id="background">
    <img
      src="@/assets/img/favicon.png"
      v-for="(rect, i) in rectangles"
      :key="i"
      class="rect"
      :style="rect"
    />
  </div>
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
  data() {
    return {
      rectangles: [] as Record<string, string>[],
    };
  },
  mounted() {
    const path = localStorage.getItem("path");
    if (path) {
      localStorage.removeItem("path");
      this.$router.replace(path);
    }

    for (let i = 0; i < 20; i++)
      setTimeout(() => this.updateRect(i), this.rand(0, 15000));
  },
  methods: {
    updateRect(i: number) {
      const transition = this.rand(10000, 20000);
      const size = this.rand(30, 150);
      this.rectangles[i] = { bottom: size * -2 + "px", opacity: "1" };

      setTimeout(() => {
        this.rectangles[i] = {
          bottom: "100%",
          opacity: "0",
          left: this.rand(0, 100) + "%",
          width: size + "px",
          height: size + "px",
          borderRadius: this.rand(size / 10, size / 3) + "px",
          transform: "translateX(-50%)",
          transition: `bottom ${transition}ms, opacity ${transition * 0.2}ms ${
            transition * 0.5
          }ms`,
        };

        setTimeout(() => this.updateRect(i), transition);
      }, 100);
    },
    rand(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
  },
});
</script>

<style lang="scss">
#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

#important {
  top: 0;
  position: sticky;
  background: #182e41;
  color: white;
  text-align: center;
  padding: 18px;
  z-index: 1;
}

#background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;

  .rect {
    /* background: rgba($plus-color, 0.5); */
    opacity: 0;
    filter: opacity(0.4);
    position: absolute;
  }
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
</style>
