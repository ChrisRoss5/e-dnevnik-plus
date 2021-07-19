/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/* https://github.com/Akryum/v-tooltip/discussions/603 */
declare module 'v-tooltip';

/*
Chrome API types => https://stackoverflow.com/a/64440752/10264782

npm install @types/chrome --save-dev
Add { webextensions: true } to compilerOptions in .eslintrc.js
Add "chrome" to compilerOptions.types in tsconfig.json
 */