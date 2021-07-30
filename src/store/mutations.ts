import { MutationTree } from "vuex";
import { State, User } from "./state";
import { getters } from "./getters";

function getUser() {
  return getters.user;
}

export enum MutationTypes {
  INIT = "INIT",
  ADD_USER = "ADD_USER",
  UPDATE_CLASS_TABS_ORDER = "UPDATE_CLASS_TABS_ORDER",
}

export type Mutations<S = State> = {
  [MutationTypes.INIT](state: S, newState: S): void;
  [MutationTypes.ADD_USER](state: S, user: User): void;
  [MutationTypes.UPDATE_CLASS_TABS_ORDER](
    state: S,
    classTabsOrder: string[],
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.INIT](state, newState) {
    Object.assign(state, newState);
  },
  [MutationTypes.ADD_USER](state, user) {
    state.users.push(user);
  },
  [MutationTypes.UPDATE_CLASS_TABS_ORDER](state, classTabsOrder) {
    const user = getters.user(state);
    if (user) user.settings.classTabsOrder = classTabsOrder;
  },
};
