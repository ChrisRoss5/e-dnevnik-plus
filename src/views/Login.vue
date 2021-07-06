<template>
  <div id="login" class="flex-center">
    <div id="cards">
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
          />
          <div class="skolehr">@skole.hr</div>
        </div>
        <div>Lozinka:</div>
        <input
          v-model="password"
          type="password"
          spellcheck="false"
          class="card"
        />
        <div
          class="button"
          :class="{ 'disabled-button': !loginReady }"
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

interface User {
  username: string;
  password: string;
}

export default defineComponent({
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    } as User;
  },
  methods: {
    loginStudent() {
      const loginRequest = new XMLHttpRequest();
      const parser = new DOMParser();
      loginRequest.open("GET", "https://ocjene.skole.hr/login", true);
      loginRequest.send();
      loginRequest.onload = () => {
        const doc = parser.parseFromString(
          loginRequest.responseText,
          "text/html"
        );
        console.log(doc);
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

#cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.card:not(input) {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 350px;
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
  font-size: 12px;
}

.button {
  margin-top: auto;
}

.material-icons {
  vertical-align: bottom;
}
</style>
