## Download / Preuzimanje
https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe

###### V5.1.1

## EN: Project structure
- [/ednevnik.plus](ednevnik.plus) is a project within the project. It contains all the data for the extension's website (https://ednevnik.plus).
- [/docs](docs) is the directory from which the website is served (built from [/ednevnik.plus](ednevnik.plus)).
  - According to Github Pages rules, it must remain named this way in the root directory of the master branch.
- [/extension-scripts](extension_scripts) is a TS project that compiles into /dist.
  - [/service-worker.ts](extension_scripts/service-worker.ts) has replaced `background.js` from manifest v2.
  - [/content-script.ts](extension_scripts/content-script.ts) is the entire **e-Dnevnik Plus Classic**.
- Other documents are part of the Vue project that form the **e-Dnevnik Plus App** in [/dist/app](dist/app).

## HR: Struktura projekta

- [/ednevnik.plus](ednevnik.plus) projekt je unutar projekta. Sadrži sve podatke za web stranicu proširenja (https://ednevnik.plus).
- [/docs](docs) je direktorij s kojeg se poslužuje web stranica (buildan [/ednevnik.plus](ednevnik.plus)).
  - Prema pravilima Github Pagesa, mora ostati ovog naziva u root direktoriju mastera.
- [/extension-scripts](extension_scripts) je TS projekt koji se kompajla u [/dist](dist).
  - [/service-worker.ts](extension_scripts/service-worker.ts) zamijenio je `background.js` iz manifesta v2.
  - [/content-script.ts](extension_scripts/content-script.ts) je cijeli **e-Dnevnik Plus Classic**.
- Ostali dokumenti sastav su Vue projekta koji tvore **e-Dnevnik Plus App** u [/dist/app](dist/app).
