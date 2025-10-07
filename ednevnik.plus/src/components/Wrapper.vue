<template>
  <div id="wrapper">
    <div id="important" class="very-important" v-if="importantMessage">
      <span v-html="importantMessage"></span>
    </div>
    <div id="important">
      <strong v-if="$inApp">
        Tvoja trenutno instalirana verzija proširenja: {{ $lastVersion }}
      </strong>
      <template v-else>
        <transition name="opacity"
          ><span v-if="message" v-html="message"></span></transition
        >&nbsp;
      </template>
      <!-- Nova verzija za učenike i roditelje je stigla!
      <strong
        >Postojeći korisnici trebaju potvrditi nova dopuštenja kako bi
        proširenje nastavilo raditi.</strong
      > -->
      <div id="urls">
        <router-link to="/povijest">Verzije</router-link
        ><!-- <router-link to="/autor">Autor</router-link> -->
      </div>
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
        <a class="plus" href="https://k1k1.dev/" target="_blank">k1k1.dev</a>
        |
        <router-link to="politika-privatnosti" class="plus">
          politika privatnosti</router-link
        >
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Wrapper",
  data() {
    return {
      scrollTop: 0,
      message: "",
      importantMessage: "",
    };
  },
  mounted() {
    document.body.addEventListener(
      "scroll",
      () => (this.scrollTop = document.body.scrollTop),
    );
    fetch("https://ednevnik.plus/users.html")
      .then((response) => response.text())
      .then((html) => (this.message = html));
    fetch("https://ednevnik.plus/important.html")
      .then((response) => response.text())
      .then((html) => {
        if (!html.startsWith("<script>")) this.importantMessage = html;
      });
  },
});
</script>

<style lang="scss">
#wrapper {
  display: flex;
  flex-direction: column;
}

#important {
  position: relative;
  background: #182e41;
  color: white;
  text-align: center;
  padding: 18px;
  z-index: 1;

  &.very-important {
    font-weight: bold;
    background-color: #ff5a5a;
  }

  #urls {
    position: absolute;
    right: 18px;
    top: 18px;
  }

 //a:first-of-type {
 //  padding-right: 10px;
 //  margin-right: 10px;
 //  border-right: 1px solid white;
 //}
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
