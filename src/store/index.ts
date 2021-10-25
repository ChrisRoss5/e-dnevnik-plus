/*
__VUE_DEVTOOLS_GLOBAL_HOOK__.store
https://dev.to/3vilarthas/vuex-typescript-m4j
https://next.vuex.vuejs.org/guide/typescript-support.html
https://developer.chrome.com/docs/extensions/reference/storage/#property-local
 */

import {
  CommitOptions, createStore, DispatchOptions, Store as VuexStore
} from "vuex";
import { Actions, actions, ActionTypes } from "./actions";
import { Getters, getters } from "./getters";
import { Mutations, mutations } from "./mutations";
import { State, state } from "./state";
import chromeLocalStorage from "./storage";

function storeMutated(_store: Store) {
  _store.subscribe((mutation, _state) => {
    console.log("MUTATED", mutation, _state);
    if (mutation.type != ActionTypes.INIT) chromeLocalStorage(_state);
  });
}

export const store = createStore({
  plugins: [storeMutated],
  state,
  getters,
  mutations,
  actions,
});

export type Store = Omit<
  VuexStore<State>,
  "getters" | "commit" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions,
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions,
  ): ReturnType<Actions[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};
