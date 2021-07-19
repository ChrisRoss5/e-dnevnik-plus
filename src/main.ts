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

/* https://v-tooltip.netlify.app/ */
import VTooltip from "v-tooltip";

/* https://v-tooltip.netlify.app/guide/config.html#default-values */
VTooltip.options.offset = [0, 10];
VTooltip.options.instantMove = true;

const app = createApp(App);
app.config.globalProperties.$emitter = mitt();
app
  .use(store)
  .use(router)
  .use(VWave)
  .use(VTooltip)
  .mount("#app");
