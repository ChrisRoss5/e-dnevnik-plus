import { createApp } from 'vue'
import App from './App.vue'

/* https://next.vuex.vuejs.org/ */
import { store } from './store'

/* https://next.router.vuejs.org/ */
import router from './router'

/* https://github.com/justintaddei/v-wave */
import VWave from 'v-wave'

createApp(App).use(VWave).use(store).use(router).mount('#app')
