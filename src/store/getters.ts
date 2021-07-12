import { GetterTree } from "vuex";
import { State, User, ClassInfo, Class } from "./state";

export type Getters = {
  user(state: State): User | undefined;
  classInfo(
    state: State,
    _getters: any,
  ): (url: string) => ClassInfo | undefined;
  openedClassInfo(state: State, _getters: any): ClassInfo | undefined;
  openedClass(state: State, _getters: any): Class | undefined;
};

export const getters: GetterTree<State, State> & Getters = {
  user: (state) => state.users.find((user) => user.signedIn),
  classInfo: (state, _getters) => (_url) => {
    const user: User = _getters.user;
    if (user) return user.classesList.find(({ url }) => url == _url);
  },
  openedClassInfo: (state, _getters) => {
    const user: User = _getters.user;
    if (user) return user.classesList.find(({ opened }) => opened);
  },
  openedClass: (state, _getters) => {
    const user: User = _getters.user;
    if (user)
      return user.classes.find(
        ({ url }) => url == _getters.openedClassInfo.url,
      );
  },
};
