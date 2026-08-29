## Download
https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe

###### V5.3

## Project structure

This browser extension (Manifest V3) transforms the national e-Class register "e-Dnevnik" into a modern app for students and parents. It ships two versions that share a single service worker:

- **e-Dnevnik Plus App** - a complete standalone redesign built with Vue 3, replacing the original UI entirely.
- **e-Dnevnik Plus Classic** - a content script injected into `ocjene.skole.hr` that enhances the original site with extra features.

### Directories

- [/app](app) - Vue 3 project that builds **e-Dnevnik Plus App** into [/dist/app](dist/app). Contains all source code, components, views, and app-level configs (`package.json`, `tsconfig.json`, `vue.config.js`, etc.).
- [/classic](classic) - TypeScript project that compiles **e-Dnevnik Plus Classic** into [/dist](dist).
  - [service-worker.ts](classic/service-worker/service-worker.ts) - the extension's service worker (replaces `background.js` from Manifest V2). Shared by both App and Classic.
  - [content-script.ts](classic/content-script/content-script.ts) - the content script injected into the original e-Dnevnik site.
- [/src/extension](src/extension) - source-controlled extension shell files copied into [/dist](dist), including `manifest.json`, `rules.json`, popup files, and static extension assets.
- [/ednevnik.plus](ednevnik.plus) - a separate Vue 3 project for the extension's website ([ednevnik.plus](https://ednevnik.plus)).
- [/docs](docs) - built output of the website, served via GitHub Pages. Must remain in the root directory per GitHub Pages rules.
- [/dist](dist) - generated base extension build output. This folder is ignored and recreated with `npm run build`.
- `/dist-chrome`, `/dist-edge`, `/dist-firefox` - generated browser-specific extension outputs.
- [/cws](cws) - Chrome Web Store listing assets (screenshots, logos).
- [/zips](zips) - archived extension builds from previous releases.

---

## Build

From the repository root:

```
npm i
npm run build
```

That rebuilds the Vue app, Classic scripts, and Chrome / Edge / Firefox targets. Load unpacked from `dist-chrome/`, `dist-edge/`, or `dist-firefox/`. Zip the matching folder for the store. After a Firefox build, `npm run lint:firefox` validates the target with `web-ext`.

Website (GitHub Pages serves repo-root `docs/`):

```
cd ednevnik.plus
npm i
npx -p node@16 vue-cli-service build --dest ../docs
```
