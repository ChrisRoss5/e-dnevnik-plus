<template>
  <div class="card content-card">
    <h2>Povijest razvoja</h2>
    Ovako je e-Dnevnik Plus izgledao krajem 2018. godine:
    <img src="~@/assets/img/history/python2.png" />300 linija Python koda
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
    aktivnih korisnika pred kraj školske godine. Prelazim u ETŠ Zagreb i
    nastavljam nadograđivati proširenje s mnoštvom novih funkcionalnosti. Od
    školske godine 2019./2020. e-Dnevnik više ne prikazuje prosjek ocjena i
    naglo se povećava potražnja za proširenjem. Početkom 2020. godine objavio
    sam e-Dnevnik Plus za nastavnike i
    <a
      class="plus"
      href="https://chrisross5.github.io/e-Dnevnik-Plus-WEB-stari/skole/"
      target="_blank"
      >e-Dnevnik Plus za škole</a
    >
    (verzija za info-stupove).<br /><br />
    Ovako je e-Dnevnik Plus izgledao školske godine 2019./2020.:
    <img src="~@/assets/img/history/v2.png" />
    Pred početak školske godine 2020./2021., e-Dnevnik je redizajniran s novim
    funkcionalnostima. To znači da sam trebao izraditi gotovo sve ispočetka.
    <a
      class="plus"
      href="https://www.youtube.com/watch?v=t_lQPHSU8T4&list=PLzgE2RyhiYODJlMcdx7AzpmclEBe0Dbeo&ab_channel=KristijanRoss"
      target="_blank"
    >
      Playlista na Youtubeu</a
    >
    sadrži obilaske kroz 4 najbitnije stare verzije proširenja. Stara naslovna
    stranica (s verzijama &lt; 5.0) nalazi se
    <a
      class="plus"
      href="https://chrisross5.github.io/e-Dnevnik-Plus-WEB-stari/"
      target="_blank"
    >
      ovdje</a
    >.<br /><br />
    Ovako je e-Dnevnik Plus izgledao školske godine 2020./2021.:
    <img src="~@/assets/img/history/v3.png" />
    e-Dnevnik Plus pobjeđuje na
    <a
      class="plus"
      href="https://informatika.azoo.hr/natjecanje/dogadjaj/614/rezultati"
      target="_blank"
    >
      državnom natjecanju iz informatike
    </a>
    te je izabran kao najbolji rad na izložbi
    <a
      class="plus"
      href="https://inova-croatia.com/en/product-detail/e-dnevnik-plus-2/"
      target="_blank"
    >
      INOVA</a
    >. Ipak, godinu dana kasnije (ljeto 2021. nakon mature) odlučujem opet
    izbrisati sve i započeti iznova, ali ovaj put na pravi način. Krpanje
    početničkog koda sa starim tehnologijama nije bilo zabavno. Stoga, danas
    postoji moja moderna verzija e-Dnevnika - Plus App, ali i jednostavna i
    sigurna Classic verzija koja se ugrađuje u e-Dnevnik kao što je bilo i
    prije.
    <br />
    <br />
    <hr />
    <br />
    e-Dnevnik Plus 5.0 je Open Source, izrađen u Vue Frameworku s Typescriptom.
    Razvoj je trajao 5 mjeseci bez razmaka, što je otprilike 1000 sati rada. Za
    donacije, klikni
    <a class="plus" href="https://ednevnik.plus/donacije" target="_blank">
      ovdje</a
    >. Za pregled drugih aplikacija i proširenja, vidi moj Developer Portfolio
    na <a class="plus" href="https://k1k1.dev/" target="_blank"> k1k1.dev</a>.
    <br />
    <br />
    <br />
    <br />
    <div style="color: gray; font-style: italic; text-align: right">
      — Kristijan Rosandić
    </div>
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
