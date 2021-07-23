import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/Login.vue";
import Class from "../views/Class.vue";
import Subjects from "../views/class/Subjects.vue";
import Notes from "../views/class/Notes.vue";
import Exams from "../views/class/Exams.vue";
import Absences from "../views/class/Absences.vue";
import Conduct from "../views/class/Conduct.vue";
import Schedule from "../views/class/Schedule.vue";
import Stats from "../views/class/Stats.vue";
import Website from "../views/Website.vue";

/*
No lazy loading:
https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk

Hash URL mode:
https://next.router.vuejs.org/guide/essentials/history-mode.html#hash-mode
 */

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login",
    component: Login,
/*     meta: { transition: "slide-to-sides" }, */
  },
  {
    path: "/razred",
    redirect: "/razred/-/ocjene",
  },
  {
    path: "/razred/:class",
    component: Class,
    children: [
      {
        path: "",
        redirect: "/razred/-/ocjene",
      },
      {
        path: "ocjene",
        component: Subjects,
      },
      {
        path: "bilješke",
        component: Notes,
      },
      {
        path: "ispiti",
        component: Exams,
      },
      {
        path: "izostanci",
        component: Absences,
      },
      {
        path: "vladanja",
        component: Conduct,
      },
      {
        path: "raspored",
        component: Schedule,
      },
      {
        path: "statistika",
        component: Stats,
      },
    ],
  },
  {
    path: "/stranica/:website",
    component: Website,
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

export default router;
