<template>
  <div class="card content-card">
    <h2>
      Povijest ažuriranja
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
      <h3>Verzija {{ $lastVersion }}<span>(22.11.2021.)</span></h3>
      <ul>
        <li>e-Dnevnik Plus <span class="plus">App</span>:</li>
        <ul>
          <li>
            Ispravljena greška: zbroj novih ocjena i bilješki uvijek je bio 3.
          </li>
          <li>
            Opcija "Prikaži boje ocjena" podjeljena je na dvije nove opcije:
            <ul>
              <li>Prikaži boje ocjena po ukupnom broju</li>
              <li>Prikaži boje ocjena po mjesecima</li>
            </ul>
          </li>
          <li>Smanjen zum cijele aplikacije za 10%.</li>
          <li>Dodana opcija prikaza lozinke kod prijave.</li>
        </ul>
        <li>e-Dnevnik Plus <span class="plus">Classic</span>:</li>
        <ul>
          <li>
            Dodana opcija automatske prijave (kvačica na /login stranici).
          </li>
        </ul>
      </ul>
      <h3>Verzija 5.0<span>(11.11.2021.)</span></h3>
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
              Sve promjene ostaju automatski spremljene za prijavljenog
              korisnika.
            </li>
          </ul>
        </li>
        <li>
          <span class="plus">Classic</span> verzija dodaje prosjeke na stranici
          e-Dnevnika:
          <ul>
            <li>
              Na stranici odabira predmeta, za svaki predmet i završni prosjek.
            </li>
            <li>Na stranici predmeta.</li>
          </ul>
        </li>
      </ul>
      <h3>Verzija &lt;= 4.8<span>(21.3.2019.)</span></h3>
      <a
        class="plus"
        href="https://chrisross5.github.io/e-Dnevnik-Plus-WEB-stari/"
        >https://chrisross5.github.io/e-Dnevnik-Plus-WEB-stari/</a
      >
    </template>
    <template v-else>Nema novosti.</template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Changelog",
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

.card > ul > li {
  padding: 7px 0;
}

h3:not(:first-of-type) {
  padding-top: 20px;
}

h3 span {
  color: #ccc;
  font-weight: normal;
  padding-left: 15px;
}

img {
  display: block;
  margin: 20px auto;
  height: 250px;
  box-shadow: 0 0 3px #ccc;
}
</style>
