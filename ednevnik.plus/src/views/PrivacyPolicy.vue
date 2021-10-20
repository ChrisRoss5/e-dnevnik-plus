<template>
  <div id="container" class="card">
    <h2>Politika Privatnosti</h2>
    Ovaj dokument pomoći će vam razumjeti kako proširenje e-Dnevnik Plus koristi
    i čuva vaše osobne podatke, prikupljene prilikom njena korištenja. Dokument
    se može promijeniti u bilo koje vrijeme o čemu ćete biti pravovremeno
    obaviješteni prilikom ažuriranja proširenja.
    <h3>Koje osobne podatke proširenje prikuplja</h3>
    Prikupljeni osobni podaci su vaše korisničko ime i lozinka HUSO AAI računa.
    <h3>Zašto proširenje prikuplja osobne podatke</h3>
    Podaci se koriste u svrhu automatske prijave ili odjave iz e-Dnevnika te za
    spremanje korisnikovih podataka poput bilješki i postavki u kalendaru.
    <h3>Gdje se nalaze prikupljeni osobni podaci</h3>
    Svi prikupljeni podaci (ne samo osobni) ostaju spremljeni lokalno na vašem
    uređaju te podacima ne može pristupiti
    <strong>nitko osim vas</strong>. Prilikom deinstalacije svi podaci se trajno
    brišu.
    <h3>Google Analytics</h3>
    U svrhu pružanja bolje usluge i razumijevanja potreba korisnika koristim se
    alatom Google Analytics. Iako Google bilježi veliki broj informacija poput
    geografskih i demografskih pokazatelja, vaši osobni podaci su zaštićeni te
    ne postoji način identifikacije korisnika.
    <h3>Kontakt</h3>
    Upite vezane uz ovaj dokument možete tražiti putem email-a:
    <em>kristijan.ros@gmail.com</em>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PrivacyPolicy",
});
</script>

<style lang="scss" scoped>
#container {
  width: $original-page-width;
  margin: 0 auto;
  padding: 20px 40px 40px;
  background: white;
}

h2, h3 {
  color: $ed-color;
}
</style>
