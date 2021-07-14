import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/Login.vue";
import Class from "../views/Class.vue";
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
    name: "Login",
    component: Login,
    meta: { transition: "slide-to-sides" },
  },
  {
    path: "/razred/:class",
    component: Class /* ,
    children: [{
      path: '',
      redirect: "/razred/:class/ocjene"
    },] */ /*
      {
        path: 'ocjene',
        component: Subjects,
      },
      {
        path: 'bilješke',
        component: Notes,
      },
      {
        path: 'ispiti',
        component: Exams,
      },
      {
        path: 'izostanci',
        component: Absences,
      },
      {
        path: 'vladanja',
        component: Conduct,
      },
      {
        path: 'raspored',
        component: Schedule,
      },
      {
        path: 'statistika',
        component: Stats,
      },
    ], */,
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
