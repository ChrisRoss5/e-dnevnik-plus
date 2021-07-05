import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

/*
No lazy loading:
https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk

Hash URL mode
https://next.router.vuejs.org/guide/essentials/history-mode.html#hash-mode
 */

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
