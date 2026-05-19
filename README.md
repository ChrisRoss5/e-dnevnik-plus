## Download / Preuzimanje
https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe

###### V5.3

## EN: Project structure

This Chrome extension (Manifest V3) transforms the national e-Class register "e-Dnevnik" into a modern app for students and parents. It ships two versions that share a single service worker:

- **e-Dnevnik Plus App** — a complete standalone redesign built with Vue 3, replacing the original UI entirely.
- **e-Dnevnik Plus Classic** — a content script injected into `ocjene.skole.hr` that enhances the original site with extra features.

### Directories

- [/app](app) — Vue 3 project that builds **e-Dnevnik Plus App** into [/dist/app](dist/app). Contains all source code, components, views, and app-level configs (`package.json`, `tsconfig.json`, `vue.config.js`, etc.).
- [/classic](classic) — TypeScript project that compiles **e-Dnevnik Plus Classic** into [/dist](dist).
  - [service-worker.ts](classic/service-worker/service-worker.ts) — the extension's service worker (replaces `background.js` from Manifest V2). Shared by both App and Classic.
  - [content-script.ts](classic/content-script/content-script.ts) — the content script injected into the original e-Dnevnik site.
- [/src/extension](src/extension) — source-controlled extension shell files copied into [/dist](dist), including `manifest.json`, `rules.json`, popup files, and static extension assets.
- [/ednevnik.plus](ednevnik.plus) — a separate Vue 3 project for the extension's website ([ednevnik.plus](https://ednevnik.plus)).
- [/docs](docs) — built output of the website, served via GitHub Pages. Must remain in the root directory per GitHub Pages rules.
- [/dist](dist) — generated base extension build output. This folder is ignored and recreated with `npm run build`.
- `/dist-chrome`, `/dist-edge`, `/dist-firefox` — generated browser-specific extension outputs.
- [/cws](cws) — Chrome Web Store listing assets (screenshots, logos).
- [/zips](zips) — archived extension builds from previous releases.

### Build

Run `npm run build` from the repository root to rebuild the base extension and all browser targets. Run `npm run lint:firefox` after a build to validate the Firefox target with `web-ext`.

---

## HR: Struktura projekta

Ovo Chrome proširenje (Manifest V3) pretvara nacionalni e-Dnevnik u modernu aplikaciju za učenike i roditelje. Sadrži dvije verzije koje dijele isti service worker:

- **e-Dnevnik Plus App** — potpuni redizajn izraden u Vue 3, zamjenjuje originalno sučelje.
- **e-Dnevnik Plus Classic** — content script koji se injektira u `ocjene.skole.hr` i nadograduje originalni e-Dnevnik dodatnim funkcijama.

### Direktoriji

- [/app](app) — Vue 3 projekt koji builda **e-Dnevnik Plus App** u [/dist/app](dist/app). Sadrži sav izvorni kod, komponente, viewove i konfiguracije (`package.json`, `tsconfig.json`, `vue.config.js`, itd.).
- [/classic](classic) — TypeScript projekt koji kompajla **e-Dnevnik Plus Classic** u [/dist](dist).
  - [service-worker.ts](classic/service-worker/service-worker.ts) — service worker proširenja (zamijenio `background.js` iz Manifesta V2). Dijele ga App i Classic.
  - [content-script.ts](classic/content-script/content-script.ts) — content script koji se injektira u originalni e-Dnevnik.
- [/src/extension](src/extension) — verzionirane datoteke kostura proširenja koje se kopiraju u [/dist](dist), uključujući `manifest.json`, `rules.json`, popup datoteke i statične resurse proširenja.
- [/ednevnik.plus](ednevnik.plus) — zaseban Vue 3 projekt za web stranicu proširenja ([ednevnik.plus](https://ednevnik.plus)).
- [/docs](docs) — buildana web stranica, poslužuje se preko GitHub Pagesa. Mora ostati u root direktoriju prema pravilima GitHub Pagesa.
- [/dist](dist) — generirani osnovni build proširenja. Direktorij je ignoriran i ponovno se stvara naredbom `npm run build`.
- `/dist-chrome`, `/dist-edge`, `/dist-firefox` — generirani browser-specific buildovi proširenja.
- [/cws](cws) — resursi za Chrome Web Store listing (screenshotovi, logotipi).
- [/zips](zips) — arhivirani buildovi proširenja iz prethodnih verzija.

### Build

Pokreni `npm run build` iz root direktorija repozitorija za rebuild osnovnog proširenja i svih browser targeta. Nakon builda pokreni `npm run lint:firefox` za validaciju Firefox targeta kroz `web-ext`.
