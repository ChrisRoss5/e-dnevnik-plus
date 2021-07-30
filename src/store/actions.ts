import { ActionTree, ActionContext } from "vuex";
import { State } from "./state";
import { Mutations, MutationTypes } from "./mutations";
import chromeLocalStorage from "./storage";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export enum ActionTypes {
  INIT = "INIT"
}
export interface Actions {
  [ActionTypes.INIT]({ commit }: AugmentedActionContext): Promise<boolean>;
}

export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.INIT]({ commit }) {
    const state = (await chromeLocalStorage()) as State;
    if (!state) return false;
    commit(MutationTypes.INIT, state);
    return !!state.users.find((user) => user.signedIn);
  }
};
