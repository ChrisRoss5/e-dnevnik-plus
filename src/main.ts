import { createApp } from "vue";
import App from "./App.vue";

/* https://next.vuex.vuejs.org/ */
import { store } from "./store";

/* https://next.router.vuejs.org/ */
import router from "./router";

/* https://github.com/developit/mitt */
import mitt from "mitt";

/* https://github.com/justintaddei/v-wave */
import VWave from "v-wave";

const app = createApp(App);
app.config.globalProperties.$emitter = mitt();
app
  .use(store)
  .use(router)
  .use(VWave)
  .mount("#app");
