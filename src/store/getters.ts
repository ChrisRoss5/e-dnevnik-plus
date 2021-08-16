import { State, User, ClassInfo } from "./state";

export type Getters = {
  user(state: State): User | undefined;
  classInfo(
    state: State,
    _getters: any,
  ): (classId: string) => ClassInfo | undefined;
};

export const getters: Getters = {
  user: (state) => state.users.find((user) => user.signedIn),
  classInfo: (state, _getters) => (classId) => {
    const user: User | undefined = _getters.user;
    if (user) return user.classesList.find((c) => c.url.includes(classId));
  },
};
