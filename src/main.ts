declare global {
  interface Window {
    isAppInitiated: boolean;
    devTestMode: boolean;
    devPause: (t: number) => Promise<void>;
  }
}
// TODO: modify
window.devTestMode = true;
window.devPause = (t) => new Promise((res) => setTimeout(res, t));

import { createApp } from "vue";
import App from "./App.vue";

/* https://next.vuex.vuejs.org/ */
import { store } from "./store";

/* https://next.router.vuejs.org/ */
import router from "./router";

/* https://github.com/developit/mitt */
import mitt from "mitt";

/* https://github.com/Maronato/vue-toastification/tree/next */
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

/* https://github.com/justintaddei/v-wave */
import VWave from "v-wave";

/* https://v-tooltip.netlify.app/ */
import VTooltip from "v-tooltip";
import "v-tooltip/dist/v-tooltip.css";

/* https://v-tooltip.netlify.app/guide/config.html#default-values */
VTooltip.options.offset = [0, 10];
VTooltip.options.instantMove = true;

/* https://vue-tippy.netlify.app/ */
// import VueTippy from "vue-tippy";
// import "tippy.js/dist/tippy.css";

/* https://www.chartjs.org/ */
/* https://www.chartjs.org/chartjs-plugin-annotation/ */
import { Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(annotationPlugin);
Chart.defaults.font.size = 16;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.interaction.mode = "index";
(Chart.defaults.plugins.tooltip.footerFont as any) = { weight: "normal" };
Chart.defaults.plugins.tooltip.footerMarginTop = 10;
Chart.defaults.plugins.tooltip.footerAlign = "right";

const app = createApp(App);
app.config.globalProperties.$emitter = mitt();

app
  .use(store)
  .use(router)
  .use(Toast, { position: "bottom-right" } as PluginOptions)
  .use(VWave)
  .use(VTooltip)
  /* .use(VueTippy, {
    defaultProps: { animateFill: true },
  }) */
  .mount("#app");
