import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Changelog from "../views/Changelog.vue";
import Home from "../views/Home.vue";
import PrivacyPolicy from "../views/PrivacyPolicy.vue";
import Uninstalled from "../views/Uninstalled.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/politika-privatnosti",
    component: PrivacyPolicy,
  },
  {
    path: "/povijest",
    component: Changelog,
  },
  {
    path: "/deinstalacija",
    component: Uninstalled,
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
