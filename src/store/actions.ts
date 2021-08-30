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
  INIT = "INIT",
}
export interface Actions {
  [ActionTypes.INIT]({ commit }: AugmentedActionContext): Promise<boolean>;
}

// prettier-ignore
export const actions: ActionTree<State, State> & Actions = { // nosonar: Index signature
  async [ActionTypes.INIT]({ commit }) {
    const state = (await chromeLocalStorage()) as State;
    console.log("LOCAL STORAGE: ", state);

    //await pause(3000);
    if (!state) return false;
    commit(MutationTypes.INIT, state);
    return !!state.users.find((user) => user.signedIn);
  },
};

// todo: delete
function pause(t: number) {
  return new Promise((res) => setTimeout(res, t));
}
