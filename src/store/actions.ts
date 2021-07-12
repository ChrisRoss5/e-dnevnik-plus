import { ActionTree, ActionContext } from 'vuex'
import { State, User } from './state'
import { Mutations } from './mutations'
import { ActionTypes } from './action-types'
import { MutationTypes } from './mutation-types'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
  [ActionTypes.SAVE_USER](
    { commit }: AugmentedActionContext,
    payload: User
  ): Promise<number>
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.SAVE_USER]({ commit }) {
    return new Promise((resolve) => {
      /* setTimeout(() => {
        const data = 256
        commit(MutationTypes.ADD_USER, data)
        resolve(data)
      }, 500) */
    })
  },
}