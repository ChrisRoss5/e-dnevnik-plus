import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.config.globalProperties.$lastVersion = "5.0.1";
app.config.globalProperties.$inApp = inIframe();
app.use(router).mount("#app");

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $lastVersion: string;
    $inApp: boolean;
  }
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
