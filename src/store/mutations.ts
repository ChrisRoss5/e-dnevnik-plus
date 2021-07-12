import { MutationTree } from 'vuex'
import { MutationTypes } from './mutation-types'
import { State, User } from './state'

export type Mutations<S = State> = {
  [MutationTypes.ADD_USER](state: S, payload: User): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_USER](state, payload: User) {
    state.users.push(payload);
  }
}