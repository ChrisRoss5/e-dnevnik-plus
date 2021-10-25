import { ActionContext, ActionTree } from "vuex";
import { Mutations, MutationTypes } from "./mutations";
import { State } from "./state";
import chromeLocalStorage from "./storage";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export enum ActionTypes {
  INIT = "INIT",
}
export interface Actions {
  [ActionTypes.INIT]({ commit }: AugmentedActionContext): Promise<boolean>;
}

// prettier-ignore
export const actions: ActionTree<State, State> & Actions = { // nosonar: Index signature
  async [ActionTypes.INIT]({ commit }) {
    const state = await chromeLocalStorage();
    console.log("LOCAL STORAGE: ", state);
    if (!state) return false;
    commit(MutationTypes.INIT, state);
    return !!state.users.find((user) => user.signedIn);
  },
};
