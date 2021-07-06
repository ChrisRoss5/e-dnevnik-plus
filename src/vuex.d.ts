import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

/* https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component */

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}