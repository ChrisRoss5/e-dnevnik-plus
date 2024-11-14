declare global {
  interface Window {
    dataLayer: any;
    googleAnalyticsId: string;
    isAppInitiated: boolean;
    devTestMode: boolean;
    isNewUser: boolean;
    devPause: (t: number) => Promise<void>;
    devClearLocalStorage: () => void;
    analyticsInfo?: {
      schoolName: string;
      classYearFull: string;
      classYear: number;
      userType: UserType;
    };
  }
}

// TODO before publishing: set devTestMode to false
window.devTestMode = false;
window.devPause = (t) => new Promise((res) => setTimeout(res, t));
window.devClearLocalStorage = () => chrome.storage.local.clear();
window.googleAnalyticsId = "G-MPMHVT6WTW";

if (window.devTestMode) {
  if (!window.chrome) (window as any).chrome = {};
  if (!window.chrome.runtime) (window as any).chrome.runtime = {};
  (window as any).chrome.runtime.sendMessage = function(...args: any[]) {
    console.log("chrome.runtime.sendMessage called with:");
    console.log(args);
  };
}

/* Google Analytics
https://www.googletagmanager.com/gtag/js?id=G-MPMHVT6WTW
Removed "http:"!=c&&"https:"!=c&&(Rg(29),a.abort()),
because the actual protocol is "chrome-extension:"
https://issuetracker.google.com/issues/174954288 */
/* import "@/scripts/gtag.js"; */

/* https://v3.vuejs.org/guide */
/* https://www.chartjs.org/ */
/* https://www.chartjs.org/chartjs-plugin-annotation/ */
import { Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
/* https://github.com/developit/mitt */
import mitt from "mitt";
/* https://vue-tippy.netlify.app/
import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css"; */
/* https://vcalendar.io/ */
import VCalendar from "v-calendar";
/* https://v-tooltip.netlify.app/ */
import VTooltip from "v-tooltip";
import "v-tooltip/dist/v-tooltip.css";
/* https://github.com/justintaddei/v-wave */
import VWave from "v-wave";
import { createApp, reactive } from "vue";
/* https://github.com/Maronato/vue-toastification/tree/next */
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
/* import "chartjs-plugin-piechart-outlabels"; // outdated - not compatible w chart 3 */
import GlobalMixin from "./components/GlobalMixin";
/* https://next.router.vuejs.org/ */
import router from "./router";
/* https://next.vuex.vuejs.org/ */
import { store } from "./store";
import { UserType } from "./store/state";

/* https://v-tooltip.netlify.app/guide/config.html#default-values */
VTooltip.options.offset = [0, 10];
VTooltip.options.instantMove = true;

Chart.register(annotationPlugin);
Chart.defaults.font.size = 14;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.interaction.mode = "index";
(Chart.defaults.plugins.tooltip.footerFont as any) = { weight: "normal" };
Chart.defaults.plugins.tooltip.footerMarginTop = 10;
Chart.defaults.plugins.tooltip.footerAlign = "right";

/* window.dataLayer = window.dataLayer || [];
window.gtag = function() {
  window.dataLayer.push(arguments);
};
window.gtag("js", new Date());
if (window.devTestMode)
  (window as any)["ga-disable-" + window.googleAnalyticsId] = true; */

const app = createApp(App);
app.config.globalProperties.$emitter = mitt();
app.config.globalProperties.$reactive = reactive({ userOffsetWidth: "0px" });

app.config.errorHandler = (err: any, vm: any, info: string) => {
  const error = err?.stack || info;
  console.log(error);
  chrome.runtime.sendMessage({
    name: "SEND_ANALYTICS_EVENT",
    params: {
      name: "error",
      error: error
        .replaceAll(/ +/g, " ")
        .trim()
        .substring(0, 99),
    },
  });
};

window.addEventListener("error", (event) => {
  const error = event.error || event.message;
  console.log(error);
  if (event.message.includes("ResizeObserver")) return;
  chrome.runtime.sendMessage({
    name: "SEND_ANALYTICS_EVENT",
    params: {
      name: "error",
      error: error
        .replaceAll(/ +/g, " ")
        .trim()
        .substring(0, 99),
    },
  });
});

app
  .use(store)
  .use(router)
  .use(Toast, { position: "bottom-right" } as PluginOptions)
  .use(VWave)
  .use(VTooltip)
  .use(VCalendar)
  .mixin(GlobalMixin as any)
  .mount("#app");

export default app.config.globalProperties.$emitter;
