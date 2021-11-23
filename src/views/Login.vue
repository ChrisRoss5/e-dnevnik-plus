<template>
  <div id="login" class="flex-center">
    <div id="forms">
      <transition name="error">
        <div v-if="!firstAttempt" id="error">
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
            v-model.trim="email"
            type="text"
            spellcheck="false"
            class="card"
            @keyup.enter="loginStudent"
            autocomplete="email"
            autofocus
          />
          <div class="skolehr">@skole.hr</div>
        </div>
        <div>Lozinka:</div>
        <div style="position: relative">
          <input
            v-model="password"
            :type="passwordVisible ? 'text' : 'password'"
            spellcheck="false"
            class="card"
            @keyup.enter="loginStudent"
            autocomplete="password"
          />
          <div
            class="toggle-password material-icons"
            @click="passwordVisible = !passwordVisible"
          >
            {{ passwordVisible ? "visibility_off" : "visibility" }}
          </div>
        </div>
        <button
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
        </button>
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
        <div class="button" @click="loginParent" v-wave>Prijava</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { login } from "@/scripts/scrapers/auth";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      passwordVisible: false,
      firstAttempt: true,
      loggingIn: false,
    };
  },
  methods: {
    async loginStudent(e: Event) {
      e.preventDefault();
      if (!this.loginReady || this.loggingIn) return;
      this.loggingIn = true;
      const errorCard = this.$refs.errorCard as HTMLElement;
      const domain = this.email.indexOf("@");
      const email =
        (domain == -1 ? this.email : this.email.slice(0, domain)) + "@skole.hr";
      const loggedIn = await login(email, this.password);

      if (loggedIn) {
        this.$router.push("/razred");
      } else {
        if (!this.firstAttempt) {
          errorCard.style.animation = "none";
          errorCard.offsetWidth; // nosonar: reflow trigger
          errorCard.style.animation = "error-red 1s";
        }
        this.firstAttempt = this.loggingIn = false;
      }
    },
    loginParent() {
      const q =
        "e-Dnevnik Plus App nije prilagođen za roditelje.\nŽelite li nastaviti prijavu na Classic verziji proširenja?";
      if (!window.confirm(q)) return;
      chrome.declarativeNetRequest.updateEnabledRulesets(
        { disableRulesetIds: ["ruleset"] },
        () => window.location.replace("https://ocjene.skole.hr/nias"),
      );
    },
  },
  computed: {
    loginReady(): boolean {
      return (!!this.email && !!this.password) || true;
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
    border: 1px solid transparent;

    @include themed() {
      background: t("white-background");
    }
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

.skolehr,
.toggle-password {
  position: absolute;
  right: 10px;
  top: 17px;
  color: gray;
  font-size: 15px;
  pointer-events: none;
}

.toggle-password {
  pointer-events: auto;
  font-size: 20px;
  transition: color 150ms;

  &:hover {
    cursor: pointer;

    @include themed() {
      color: t("body-color");
    }
  }
}

.button {
  margin-top: auto;
  font-size: 1rem;
}

.loggingIn {
  background: #8eb5e9;
  animation: loggingIn 1s infinite linear;
}

#students {
  transition: margin $views-transition;
}

@keyframes loggingIn {
  50% {
    opacity: 0.9;
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
