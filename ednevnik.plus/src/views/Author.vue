<template>
  <div class="card content-card">
    Ovako je e-Dnevnik Plus izgledao krajem 2018. godine:
    <img src="~@/assets/img/history/python.png" />300 linija Python koda
    (ispušta i zvukove :P). Zapravo, tada aplikacija još nije niti imala naziv.
    Bilo je moguće navigirati razredima, predmetima, uređivati ocjene i
    pregledavati razrednu statistiku ocjena. Naziv sam osmislio nakon što sam
    završio prvu verziju proširenja za Chrome Web Trgovinu. To mi je bila prva
    web aplikacija, a imao sam 16 godina u 2. razredu srednje škole TŠSB.<br /><br />Ovako
    je e-Dnevnik Plus izgledao početkom 2019. godine:
    <img src="~@/assets/img/history/v1.png" />
    Nakon podjele na Redditu i prvih 500 korisnika, Srednja.hr objavljuje
    <a
      class="plus"
      href="https://www.srednja.hr/zbornica/srednjoskolac-iz-broda-osmislio-program-e-dnevnik-plus-predvida-prosjek-ocjena/"
      target="_blank"
    >
      članak</a
    >, a potom i nekoliko drugih portala. Proširenje dostiže 2500 tjedno
    aktivnih korisnika pred kraj školske godine. Prelazim u ETŠ Zagreb i nastavljam
    nadograđivati proširenje s mnoštvom novih funkcionalnosti. Od školske godine
    2019./2020. e-Dnevnik više ne prikazuje prosjek ocjena i naglo se povećava
    potražnja za ovim proširenjem.
    <br /><br />
    Ovako je e-Dnevnik Plus izgledao školske godine 2019./2020.:
    <img src="~@/assets/img/history/v2.png" />
    Pred početak školske godine 2020./2021., e-Dnevnik je redizajniran s novim
    funkcionalnostima. To znači da sam trebao izraditi gotovo sve ispočetka.
    <br /><br />
    Ovako je e-Dnevnik Plus izgledao školske godine 2020./2021.:
    <img src="~@/assets/img/history/v3.png" />
    Ipak, godinu dana kasnije (ljeto 2021. nakon mature) odlučujem opet
    izbrisati sve i započeti iznova. Ali ovaj put na pravi način. Krpanje
    "početničkog" koda sa starim tehnologijama nije bilo zabavno. Stoga, danas
    postoji moja verzija e-Dnevnika - Plus App, ali i jednostavna i sigurna Classic
    verzija koja se ugrađuje u e-Dnevnik kao što je bilo i prije.
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Author",
});
</script>

<style lang="scss" scoped>
img {
  display: block;
  max-width: 70%;
  margin: 40px auto;
}
</style>
