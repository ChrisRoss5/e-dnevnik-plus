<template>
  <div id="login" class="flex-center">
    <div id="forms">
      <transition name="error">
        <div v-if="!valid" id="error">
          <div class="card">Neispravno korisničko ime ili lozinka.</div>
        </div>
      </transition>
      <div class="card" id="students">
        <div class="card-title">
          <span class="material-icons"> person </span>
          Učenici
        </div>
        <div>Korisničko ime:</div>
        <div style="position: relative">
          <input
            v-model="username"
            type="text"
            spellcheck="false"
            class="card"
            @keypress="inputKeyPressed"
          />
          <div class="skolehr">@skole.hr</div>
        </div>
        <div>Lozinka:</div>
        <input
          v-model="password"
          type="password"
          spellcheck="false"
          class="card"
          @keypress="inputKeyPressed"
        />
        <div
          class="button"
          :class="{ 'disabled-button': !loginReady, loggingIn: loggingIn }"
          :tabindex="loginReady ? 0 : -1"
          @click="loginStudent"
        >
          Prijava
        </div>
      </div>
      <div class="card" id="parents">
        <div class="card-title">
          <span class="material-icons"> supervisor_account </span>
          Roditelji
        </div>
        <div>
          Pristup je dozvoljen isključivo korisnicima registriranim u sustavu
          <a href="https://gov.hr/" target="_blank" class="text-link"
            >e-Građani</a
          >.
        </div>
        <div style="color: gray; padding: 20px 0">
          Iz pedagoških razloga, ocjene se prikazuju s vremenskim odmakom od 48
          sati.
        </div>
        <a href="https://ocjene.skole.hr/nias" target="_blank" class="button"
          >Prijava</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      valid: true,
      loggingIn: false,
    };
  },
  methods: {
    inputKeyPressed(e: KeyboardEvent) {
      e.key == "Enter" && this.loginStudent();
    },
    loginStudent() {
      if (!this.loginReady) return;
      this.loggingIn = true;
      this.$router.push("ocjene");

      const loginRequest = new XMLHttpRequest();
      const parser = new DOMParser();
      loginRequest.open("GET", "https://ocjene.skole.hr/login", true);
      loginRequest.send();
      loginRequest.onload = () => {
        const doc: HTMLDocument = parser.parseFromString(
          loginRequest.responseText,
          "text/html"
        );
        console.log(doc);

        this.loggingIn = false;
        /* if (true) {

        } else {

        } */
      };
    },
  },
  computed: {
    loginReady(): boolean {
      return !!this.username && !!this.password;
    },
  },
});
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
}

#forms {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

#error {
  flex-basis: 100%;

  .card {
    margin: 10px auto;
    text-align: center;
    color: red;
    background: #fff;
  }
}

.card:not(input) {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 400px;
  padding: 15px;
  margin: 20px;
}

.card-title {
  font-weight: bold;
  color: gray;
  padding-bottom: 20px;
}

.skolehr {
  position: absolute;
  right: 10px;
  top: 17.5px;
  color: gray;
  font-size: 15px;
  pointer-events: none;
}

.button {
  margin-top: auto;
}

.loggingIn {
  background: linear-gradient(to right, #8eb5e9 40%, #1a73e8 50%, #8eb5e9 60%);
  background-size: 300%;
  background-position: right;
  animation: loggingIn 1s infinite linear;
}

@keyframes loggingIn {
  50% {
    background-size: 400%;
  }
  100% {
    background-size: 600%;
    background-position: left;
  }
}

.material-icons {
  vertical-align: bottom;
}

/* https://v3.vuejs.org/guide/transitions-enterleave.html#transition-classes */

.error-enter-active {
  transition: all 600ms, transform 300ms;
}

.error-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-100px);
}

.error-enter-to {
  max-height: 100px;
}
</style>
