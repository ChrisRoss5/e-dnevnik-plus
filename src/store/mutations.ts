import {
  State,
  User,
  ClassInfo,
  SubjectCache,
  GlobalSettings,
  Settings,
} from "./state";
import { MutationTree } from "vuex";

export enum MutationTypes {
  INIT = "INIT",
  ADD_USER = "ADD_USER",
  UPDATE_USER_STATUS = "UPDATE_USER_STATUS",
  UPDATE_LAST_LOADED_CLASS_URL = "UPDATE_LAST_LOADED_CLASS_URL",
  UPDATE_CLASSES_LIST = "UPDATE_CLASSES_LIST",
  UPDATE_CLASS_PROPERTY = "UPDATE_CLASS_PROPERTY",
  UPDATE_CLASS_TABS_ORDER = "UPDATE_CLASS_TABS_ORDER",
  UPDATE_SUBJECT = "UPDATE_SUBJECT",
  UPDATE_GLOBAL_SETTING = "UPDATE_GLOBAL_SETTING",
  UPDATE_USER_SETTINGS = "UPDATE_USER_SETTINGS",
}

export type Mutations<S = State> = {
  [MutationTypes.INIT](state: S, newState: S): void;
  [MutationTypes.ADD_USER](state: S, user: User): void;
  [MutationTypes.UPDATE_USER_STATUS](
    state: S,
    { user, status }: { user: User; status: boolean },
  ): void;
  [MutationTypes.UPDATE_LAST_LOADED_CLASS_URL](
    state: S,
    { user, url }: { user: User; url: string },
  ): void;
  [MutationTypes.UPDATE_CLASSES_LIST](
    state: S,
    { user, classesList }: { user: User; classesList: ClassInfo[] },
  ): void;
  [MutationTypes.UPDATE_CLASS_PROPERTY](
    state: S,
    {
      classInfo,
      property,
      value,
    }: { classInfo: ClassInfo; property: string; value: string },
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
  [MutationTypes.UPDATE_GLOBAL_SETTING](
    state: S,
    { name, value }: { name: keyof GlobalSettings; value: boolean },
  ): void;
  [MutationTypes.UPDATE_USER_SETTINGS](
    state: S,
    { user, settings }: { user: User; settings: Partial<Settings> },
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.INIT](state, newState) {
    Object.assign(state, newState);
  },
  [MutationTypes.ADD_USER](state, user) {
    state.users.push(user);
  },
  [MutationTypes.UPDATE_USER_STATUS](state, { user, status }) {
    user.signedIn = status;
  },
  [MutationTypes.UPDATE_LAST_LOADED_CLASS_URL](state, { user, url }) {
    user.lastLoadedClassUrl = url;
  },
  [MutationTypes.UPDATE_CLASSES_LIST](state, { user, classesList }) {
    user.classesList = classesList.map((classInfo) => {
      const sameClass = user.classesList.find((c) => c.url == classInfo.url);
      return sameClass ? { ...sameClass, ...classInfo } : classInfo;
    });
    user.signedIn = true;
  },
  [MutationTypes.UPDATE_CLASS_PROPERTY](state, { classInfo, property, value }) {
    (classInfo as any)[property] = value;
  },
  [MutationTypes.UPDATE_CLASS_TABS_ORDER](state, { user, tabs }) {
    user.settings.classTabsOrder = tabs;
  },
  [MutationTypes.UPDATE_SUBJECT](state, { classInfo, updatedSubject }) {
    if (!classInfo.cachedSubjects) {
      classInfo.cachedSubjects = [updatedSubject];
      return;
    }
    const cachedSubjectIdx = classInfo.cachedSubjects.findIndex(
      (subject) => subject.url == updatedSubject.url,
    );
    if (cachedSubjectIdx == -1) {
      classInfo.cachedSubjects.push(updatedSubject);
      return;
    }
    classInfo.cachedSubjects[cachedSubjectIdx] = updatedSubject;
  },
  [MutationTypes.UPDATE_GLOBAL_SETTING](state, { name, value }) {
    state.settings[name] = value;
  },
  [MutationTypes.UPDATE_USER_SETTINGS](state, { user, settings }) {
    user.settings = { ...user.settings, ...settings };
  },
};
