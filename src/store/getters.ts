import { GetterTree } from "vuex";
import { State, User, ClassInfo } from "./state";

export type Getters = {
  user(state: State): User | undefined;
  classInfo(
    state: State,
    _getters: any,
  ): (nameAndYear: string) => ClassInfo | undefined;
};

export const getters: GetterTree<State, State> & Getters = {
  user: (state) => state.users.find((user) => user.signedIn),
  classInfo: (state, _getters) => (nameAndYear) => {
    const user: User = _getters.user;
    const [name, year] = nameAndYear.split("-");
    if (user)
      return user.classesList.find(
        (c) => c.name == name && c.year.slice(0, 2) == year.slice(-2),
      );
  },
};
