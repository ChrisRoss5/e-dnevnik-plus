import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

/*
__VUE_DEVTOOLS_GLOBAL_HOOK__.store
https://next.vuex.vuejs.org/guide/typescript-support.html
https://developer.chrome.com/docs/extensions/reference/storage/#property-local
 */

export interface State {
  count: number
}

export const store = createStore<State>({
  state: {
    count: 0
  }
})

export const key: InjectionKey<Store<State>> = Symbol()

export function useStore() {
  return baseUseStore(key)
}