import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { store } from "@/store";
import Login from "../views/Login.vue";
import Class from "../views/Class.vue";
import Subjects from "../views/class/subjects/Subjects.vue";
import Subject from "../views/class/subjects/Subject.vue";
import Notes from "../views/class/Notes.vue";
import Exams from "../views/class/Exams.vue";
import Absences from "../views/class/Absences.vue";
import Conduct from "../views/class/Conduct.vue";
import Schedule from "../views/class/Schedule.vue";
import Stats from "../views/class/Stats.vue";
import Websites from "../views/Websites.vue";

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
    component: Websites,
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
  const isAuthenticated = !!store.getters.user;
  const isLoginPage = to.path == "/";
  if (!isLoginPage && !isAuthenticated) next({ path: "/" });
  else if (isLoginPage && isAuthenticated) next(false);
  else next();
});

export default router;
