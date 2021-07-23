<template>
  <div id="login" class="flex-center">
    <div id="forms">
      <transition name="error">
        <div v-if="!valid" id="error">
          <div class="card" ref="errorCard">
            Neispravno korisničko ime ili lozinka.
          </div>
        </div>
      </transition>
      <form class="card" id="students">
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
            autocomplete="on"
            autofocus
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
          autocomplete="on"
        />
        <div
          class="button"
          :class="{
            'disabled-button': !loginReady || loggingIn,
            loggingIn: loggingIn,
          }"
          :tabindex="loginReady ? 0 : -1"
          @click="loginStudent"
          v-wave
        >
          Prijava
        </div>
      </form>
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
        <a
          href="https://ocjene.skole.hr/nias"
          target="_blank"
          class="button"
          v-wave
          >Prijava</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { login } from "@/scripts/scrapers";

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
    async loginStudent() {
      this.$router.push("razred");
      /* if (!this.loginReady) return;
      this.loggingIn = true;
      const errorCard = this.$refs.errorCard as HTMLElement;
      const valid = await login(this.username, this.password);
      if (valid) {
        console.log("OCJENE");
        this.$router.push("ocjene");
      } else {
        if (!this.valid) {
          errorCard.style.animation = "none";
          errorCard.offsetWidth; // NOSONAR: reflow trigger
          errorCard.style.animation = "error-red 1s";
        }
        this.valid = this.loggingIn = false;
      } */
    },
  },
  computed: {
    loginReady(): boolean {
      return (!!this.username && !!this.password) || true;
    },
  },
});
</script>

<style>
@keyframes error-red {
  0%,
  50%,
  100% {
    border: 1px solid transparent;
  }
  25%,
  75% {
    border: 1px solid red;
  }
}
</style>

<style lang="scss" scoped>
#login {
  height: 100%;
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
    border: 1px solid transparent;
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
  background: #8eb5e9;
  animation: loggingIn 1s infinite linear;
}

@keyframes loggingIn {
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

.material-icons {
  vertical-align: bottom;
}

/* transitions */

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
