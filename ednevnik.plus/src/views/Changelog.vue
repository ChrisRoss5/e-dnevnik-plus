<template>
  <div class="card content-card">
    <h2>Povijest ažuriranja</h2>
    <hr>
    <h3>Verzija 5.0 (za učenike i roditelje)</h3>
    <ul>
      <li>Uklonjene sve funkcionalnosti prethodne verzije proširenja.</li>
      <li>
        Novi prozor proširenja omogućuje odabir verzije e-Dnevnika:
        <span class="plus">App</span> ili <span class="plus">Classic</span
        ><br />
        Odabrana verzija postaje zadana te se svaki put otvara navigacijom na
        <a href="ocjene.skole.hr" class="plus">ocjene.skole.hr</a>
        <img class="card" src="~@/assets/img/popup.png" />
      </li>
      <li>
        <span class="plus">App</span> verzija je nova aplikacija za napredan
        pregled sadržaja s e-Dnevnika:
        <ul>
          <li>
            Osnovne lokacije su: Razred, Kalendar, Statistika ocjena i
            Kalkulator bodova.
          </li>
          <li>
            Sve promjene ostaju automatski spremljene za prijavljenog korisnika.
          </li>
        </ul>
      </li>
      <li>
        <span class="plus">Classic</span> verzija dodaje prosjeke na stranici
        e-Dnevnika:
        <ul>
          <li>Na stranici odabira predmeta, za svaki predmet i završni prosjek.</li>
          <li>Na stranici predmeta.</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Changelog",
});
</script>

<style lang="scss" scoped>
.card > ul > li {
  padding: 7px 0;
}

img {
  display: block;
  margin: 20px auto;
  height: 250px;
  box-shadow: 0 0 3px #ccc;
}
</style>
