import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { store } from "@/store";

import Login from "@/views/Login.vue";
import Class from "@/views/class/Class.vue";

import Subjects from "@/views/class/subjects/Subjects.vue";
import Subject from "@/views/class/subjects/Subject.vue";
import ClassSectionFrame from "@/views/class/ClassSectionFrame.vue";
import ClassStats from "@/views/class/ClassStats.vue";

import Calendar from "@/views/calendar/Calendar.vue";
import GlobalStats from "@/views/GlobalStats.vue";
import Calculator from "@/views/calculator/Calculator.vue";


import Websites from "@/views/Websites.vue";
import Settings from "@/views/settings/Settings.vue";

/*
No lazy loading:
https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk

Hash URL mode:
https://next.router.vuejs.org/guide/essentials/history-mode.html#hash-mode
 */

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/razred",
    redirect: "/razred/-/ocjene",
  },
  {
    path: "/razred/:classId",
    component: Class,
    children: [
      {
        path: "",
        redirect: "/razred/-/ocjene",
      },
      {
        path: "ocjene",
        component: Subjects,
        children: [
          {
            path: ":subjectId",
            component: Subject,
          },
        ],
      },
      {
        path: "biljeske",
        component: ClassSectionFrame,
      },
      {
        path: "ispiti",
        component: ClassSectionFrame,
      },
      {
        path: "izostanci",
        component: ClassSectionFrame,
      },
      {
        path: "vladanja",
        component: ClassSectionFrame,
      },
      {
        path: "raspored",
        component: ClassSectionFrame,
      },
      {
        path: "statistika",
        component: ClassStats,
      },
      {
        path: "osobni-podaci",
        component: ClassSectionFrame,
      },
    ],
  },
  {
    path: "/kalendar",
    component: Calendar,
  },
  {
    path: "/statistika-ocjena",
    component: GlobalStats,
  },
  {
    path: "/kalkulator-bodova",
    component: Calculator,
  },
  {
    path: "/stranica/:website",
    component: Websites,
  },
  {
    path: "/postavke",
    component: Settings,
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!window.isAppInitiated) return next(); // App not INIT
  const isAuthenticated = !!store.getters.user;
  const isLoginPage = to.path == "/";
  if (!isLoginPage && !isAuthenticated) next({ path: "/" });
  else if (isLoginPage && isAuthenticated) next(false);
  else next();
});

export default router;
