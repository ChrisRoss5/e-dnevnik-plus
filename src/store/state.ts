export const state: State = {
  settings: {
    darkTheme: true,
    appDisabled: false,
    injectContent: false,
    navbarCollapsed: false,
  },
  users: [],
};

export interface State {
  settings: GlobalSettings;
  users: User[];
}

export interface User {
  signedIn: boolean;
  email: string;
  password: string;
  fullName: string;
  settings: Settings;
  classesList: ClassInfo[];
  lastLoadedClassUrl?: string;
}

export interface Settings {
  classTabsOrder?: string[];
}

export interface GlobalSettings {
  darkTheme: boolean;
  appDisabled: boolean;
  injectContent: boolean;
  navbarCollapsed: boolean;
}

export interface ClassInfo {
  url: string;
  name: string;
  year: string;
  school: string;
  headTeacher?: string;
  finalGrade?: string;
  cachedSubjects?: SubjectCache[];
  lastUpdated?: number;
}

export interface SubjectCache {
  url: string;
  name: string;
  teachers: string;
  gradesByCategory?: GradesByCategory[];
  finalGrade?: number;
  lastNote?: Note;
  lastUpdated?: number;
}

export interface GradesByCategory {
  name: string;
  grades: number[][]
}

export interface Note {
  note: string;
  date: string;
  grade: string;
}