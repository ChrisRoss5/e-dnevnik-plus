import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Changelog from "../views/Changelog.vue";
import Author from "../views/Author.vue";
import Home from "../views/Home.vue";
import PrivacyPolicy from "../views/PrivacyPolicy.vue";


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
    path: "/autor",
    component: Author,
  },
  {
    path: "/deinstalacija",
    component: () => import("../views/Uninstalled.vue"),
  },
  {
    path: "/donacije",
    component: () => import("../views/Donations.vue"),
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
