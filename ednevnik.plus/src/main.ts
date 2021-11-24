import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.config.globalProperties.$lastVersion = "5.0.1";
app.config.globalProperties.$inApp =
  window.top && window.top.window.location.protocol == "chrome-extension:";
app.use(router).mount("#app");

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $lastVersion: string,
    $inApp: boolean
  }
}