declare global {
  interface Window {
    dataLayer: any;
    isAppInitiated: boolean;
    devTestMode: boolean;
    devPause: (t: number) => Promise<void>;
    devClearLocalStorage: () => void;
  }
}

// TODO: BEFORE BUILD
window.devTestMode = true;
window.devPause = (t) => new Promise((res) => setTimeout(res, t));
window.devClearLocalStorage = () => chrome.storage.local.clear();

/* https://v3.vuejs.org/guide */
import { createApp, reactive } from "vue";
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
/* import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css"; */

/* https://vcalendar.io/ */
import VCalendar from "v-calendar";

/* https://www.chartjs.org/ */
/* https://www.chartjs.org/chartjs-plugin-annotation/ */
import { Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
/* import "chartjs-plugin-piechart-outlabels"; // outdated - not compatible w chart 3 */
import GlobalMixin from "./components/GlobalMixin";
Chart.register(annotationPlugin);
Chart.defaults.font.size = 16;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.interaction.mode = "index";
(Chart.defaults.plugins.tooltip.footerFont as any) = { weight: "normal" };
Chart.defaults.plugins.tooltip.footerMarginTop = 10;
Chart.defaults.plugins.tooltip.footerAlign = "right";

/* Google Analytics
Remove "http:"!=d&&"https:"!=d&&(Rg(29),a.abort()),
because the actual protocol is "chrome-extension:"
https://issuetracker.google.com/issues/174954288
*/
import "@/scripts/gtag.js";
window.dataLayer = window.dataLayer || [];
window.gtag = function() {
  window.dataLayer.push(arguments);
};
window.gtag("js", new Date());
// (window as any)['ga-disable-G-MPMHVT6WTW'] = true;

const app = createApp(App);
app.config.globalProperties.$emitter = mitt();
app.config.globalProperties.$reactive = reactive({ userOffsetWidth: "0px" });
app
  .use(store)
  .use(router)
  .use(Toast, { position: "bottom-right" } as PluginOptions)
  .use(VWave)
  .use(VTooltip)
  .use(VCalendar)
  /* .use(VueTippy, {
    defaultProps: { animateFill: true },
  }) */
  .mixin(GlobalMixin)
  .mount("#app");
