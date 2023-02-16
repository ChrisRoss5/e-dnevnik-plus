# e-Dnevnik Plus

###### Verzija: 5.0.1
## Kako instalirati proširenje?

Preuzmi [/dist](dist) i povuci na `chrome://extensions/` (_developer mode_ omogućen)

ili

Preuzmi [verziju iz trgovine](https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe)

---

## Struktura projekta

* [/ednevnik.plus](ednevnik.plus) projekt je unutar projekta. Sadrži sve podatke za web stranicu proširenja (https://ednevnik.plus)
* [/docs](docs) je direktorij s kojeg se poslužuje web stranica (buildan [/ednevnik.plus](ednevnik.plus))
  * Prema pravilima Github Pagesa, mora ostati ovog naziva u root direktoriju mastera
* [/extension-scripts](extension_scripts) je TS projekt koji se kompajla u [/dist](dist)
  * [/service-worker.ts](extension_scripts/service_worker.ts) zamijenio je "background.js" iz manifesta v2
  * [/content-script.ts](extension_scripts/content-script.ts) je cijeli e-Dnevnik Plus Classic
* Ostali dokumenti sastav su Vue projekta koji tvore e-Dnevnik Plus App u [/dist/app](dist/app)