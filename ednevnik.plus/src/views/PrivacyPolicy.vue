<template>
  <div class="card content-card">
    <h2>
      Politika Privatnosti
      <div id="app-types" class="card">
        <div :class="{ 'selected-app': !selectedApp }" @click="selectedApp = 0">
          za učenike i roditelje
        </div>
        <div :class="{ 'selected-app': selectedApp }" @click="selectedApp = 1">
          za nastavnike
        </div>
      </div>
    </h2>
    <template v-if="!selectedApp">
      Ovaj dokument objašnjava kako proširenje e-Dnevnik Plus koristi i čuva
      vaše osobne podatke, prikupljene prilikom njena korištenja. Dokument se
      može promijeniti u bilo koje vrijeme o čemu ćete biti pravovremeno
      obaviješteni prilikom ažuriranja proširenja.
      <h3>Koje osobne podatke proširenje prikuplja</h3>
      Prikupljeni osobni podaci su vaše korisničko ime i lozinka HUSO AAI
      računa.
      <h3>Zašto proširenje prikuplja osobne podatke</h3>
      Podaci se koriste u svrhu automatske prijave ili odjave iz e-Dnevnika te
      za spremanje korisnikovih podataka poput bilješki i postavki u kalendaru.
      <h3>Gdje se nalaze prikupljeni osobni podaci</h3>
      Svi prikupljeni podaci (ne samo osobni) ostaju spremljeni lokalno na vašem
      uređaju te podacima ne može pristupiti
      <strong>nitko osim vas</strong>. Prilikom deinstalacije svi podaci se
      trajno brišu.
      <h3>Google Analytics</h3>
      U svrhu pružanja bolje usluge i razumijevanja potreba korisnika koristim
      se alatom Google Analytics. Iako Google bilježi veliki broj informacija
      poput geografskih i demografskih pokazatelja, vaši osobni podaci su
      zaštićeni te ne postoji način identifikacije korisnika.
      <h3>Kontakt</h3>
      Upite vezane uz ovaj dokument možete tražiti putem email-a:
      <em>kristijan.ros@gmail.com</em>
    </template>
    <template v-else
      >Proširenje ne prikuplja podatke niti me izvještava o prometu na web
      mjestima e-Dnevnika.</template
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PrivacyPolicy",
  data() {
    return {
      selectedApp: 0 as 0 | 1,
    };
  },
});
</script>
<style lang="scss" scoped>
h2 {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}

#app-types {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: normal;
  margin-left: auto;

  div {
    padding: 5px 15px;
    cursor: pointer;

    &:last-child {
      border-left: 1px solid #ccc;
    }
  }
}
.selected-app {
  font-weight: bold;
}
</style>