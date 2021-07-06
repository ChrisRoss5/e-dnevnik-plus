/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/*
Chrome API types => https://stackoverflow.com/a/64440752/10264782

npm install @types/chrome --save-dev
Add { webextensions: true } to compilerOptions in .eslintrc.js
Add "chrome" to compilerOptions.types in tsconfig.json
 */