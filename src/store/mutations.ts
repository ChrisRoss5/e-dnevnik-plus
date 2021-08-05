import { State, User, ClassInfo, SubjectCache } from "./state";
import { getters } from "./getters";

export enum MutationTypes {
  INIT = "INIT",
  ADD_USER = "ADD_USER",
  UPDATE_USER_STATUS = "UPDATE_USER_STATUS",
  UPDATE_CLASSES_LIST = "UPDATE_CLASSES_LIST",
  UPDATE_CLASS_TEACHER = "UPDATE_CLASS_TEACHER",
  UPDATE_CLASS_TABS_ORDER = "UPDATE_CLASS_TABS_ORDER",
  UPDATE_SUBJECT = "UPDATE_SUBJECT",
}

export type Mutations<S = State> = {
  [MutationTypes.INIT](state: S, newState: S): void;
  [MutationTypes.ADD_USER](state: S, user: User): void;
  [MutationTypes.UPDATE_USER_STATUS](
    state: S,
    { user, status }: { user: User; status: boolean },
  ): void;
  [MutationTypes.UPDATE_CLASSES_LIST](
    state: S,
    { user, classesList }: { user: User; classesList: ClassInfo[] },
  ): void;
  [MutationTypes.UPDATE_CLASS_TEACHER](
    state: S,
    { classInfo, teacher }: { classInfo: ClassInfo; teacher: string },
  ): void;
  [MutationTypes.UPDATE_CLASS_TABS_ORDER](
    state: S,
    { user, tabs }: { user: User; tabs: string[] },
  ): void;
  [MutationTypes.UPDATE_SUBJECT](
    state: S,
    {
      classInfo,
      updatedSubject,
    }: { classInfo: ClassInfo; updatedSubject: SubjectCache },
  ): void;
};

export const mutations: Mutations = {
  [MutationTypes.INIT](state, newState) {
    Object.assign(state, newState);
  },
  [MutationTypes.ADD_USER](state, user) {
    state.users.push(user);
  },
  [MutationTypes.UPDATE_USER_STATUS](state, { user, status }) {
    user.signedIn = status;
  },
  [MutationTypes.UPDATE_CLASSES_LIST](state, { user, classesList }) {
    user.classesList = { ...user.classesList, ...classesList };
    user.signedIn = true;
  },
  [MutationTypes.UPDATE_CLASS_TEACHER](state, { classInfo, teacher }) {
    classInfo.headTeacher = teacher;
  },
  [MutationTypes.UPDATE_CLASS_TABS_ORDER](state, { user, tabs }) {
    user.settings.classTabsOrder = tabs;
  },
  [MutationTypes.UPDATE_SUBJECT](state, { classInfo, updatedSubject }) {
    if (!classInfo.cache) {
      classInfo.cache = [updatedSubject];
      return;
    }
    const cachedSubjectIdx = classInfo.cache.findIndex(
      (subject) => subject.url == updatedSubject.url,
    );
    if (cachedSubjectIdx == -1) {
      classInfo.cache.push(updatedSubject);
      return;
    }
    classInfo.cache[cachedSubjectIdx] = updatedSubject;
  },
};
