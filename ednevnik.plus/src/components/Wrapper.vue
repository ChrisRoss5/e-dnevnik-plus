<template>
  <div id="wrapper">
    <div id="important">
      <strong v-if="$inApp">
        Tvoja trenutno instalirana verzija proširenja: {{ $lastVersion }}
      </strong>
      <template v-else>
        Više od <strong>100,000</strong> učenika i
        <strong>40,000</strong> nastavnika aktivno koristi e-Dnevnik Plus!
        <!-- Nova verzija za učenike i roditelje je stigla!
        <strong
          >Postojeći korisnici trebaju potvrditi nova dopuštenja kako bi
          proširenje nastavilo raditi.</strong
        > -->
      </template>
      <div id="urls">
        <router-link to="/povijest">Verzije</router-link
        ><router-link to="/autor">Autor</router-link>
      </div>
    </div>
    <div id="background">
      <div
        v-for="(rect, i) in rectangles"
        :key="i"
        class="rect"
        :style="rect"
      ></div>
    </div>
    <div id="heading">
      <router-link to="/" id="title">
        <div id="ed" class="ed">e-Dnevnik</div>
        <div id="plus" class="plus">Plus</div>
      </router-link>
      <div id="subtitle">Proširenje za školski e-Dnevnik</div>
    </div>
    <router-view class="router-view"> </router-view>
    <transition name="opacity">
      <div
        v-show="$route.path != '/' || scrollTop == 0 || $isMobile"
        id="footer"
        :class="{ default: $route.path != '/' }"
      >
        <div style="color: gray">
          Ovo proširenje nije službena CARNET-ova aplikacija.
        </div>
        2019.-{{ new Date().getFullYear() }}. |
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
    </transition>
  </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent } from "vue";

export default defineComponent({
  name: "Wrapper",
  data() {
    return {
      rectangles: [] as CSSProperties[],
      speed: 20000,
      scrollTop: 0,
    };
  },
  mounted() {
    for (let i = 0; i < 10; i++) this.updateRect(i, true);
    document.body.addEventListener(
      "scroll",
      () => (this.scrollTop = document.body.scrollTop),
    );
  },
  methods: {
    updateRect(i: number, init?: boolean) {
      const size = this.rand(30, 150);
      const bottomPerc = this.rand(0, 100);
      const bottom = init ? bottomPerc + "%" : -size + "px";
      const transition =
        this.rand(this.speed, this.speed * 2) *
        (init ? 1 - bottomPerc / 100 : 1);
      this.rectangles[i] = { bottom, opacity: "1" };
      setTimeout(() => {
        this.rectangles[i] = {
          bottom: "100%",
          opacity: "0",
          left: this.rand(-10, 100) + "%",
          width: size + "px",
          height: size + "px",
          borderRadius: this.rand(size / 10, size / 3) + "px",
          animation: "rotate " + size * 100 + "ms linear infinite",
          transition: `bottom ${transition}ms ease-out, opacity ${
            transition * 0.2
          }ms ${transition * 0.5}ms`,
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
#wrapper {
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

  #urls {
    position: absolute;
    right: 18px;
    top: 18px;
  }

  a:first-of-type {
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid white;
  }
}

#background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0;
  transform: scale(0) rotate(45deg);
  animation: show-background 3s forwards;

  .rect {
    background: rgba($plus-color, 0.5);
    opacity: 0;
    filter: opacity(0.4);
    position: absolute;
    will-change: bottom, opacity;
  }
}

@keyframes show-background {
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
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

  #urls {
    padding-top: 10px;
    position: static !important;
  }
}
</style>
