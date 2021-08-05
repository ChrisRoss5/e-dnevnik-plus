export const state: State = {
  settings: {},
  users: [],
};

export interface State {
  settings: Settings;
  users: User[];
}

export interface User {
  signedIn: boolean;
  email: string;
  password: string;
  fullName: string;
  settings: Settings;
  classesList: ClassInfo[];
}

export interface Settings {
  classTabsOrder?: string[];
}

export interface ClassInfo {
  url: string;
  name: string;
  year: string;
  school: string;
  headTeacher?: string;
  finalGrade?: number;
  cache?: SubjectCache[];
  lastUpdated?: number;
}

export interface SubjectCache {
  url: string;
  name: string;
  teachers: string;
  grades?: CategoryGrades[];
  finalGrade?: number;
  lastNote?: Note;
  lastUpdated?: number;
}

export interface CategoryGrades {
  name: string;
  grades: number[][]
}

export interface Note {
  note: string;
  date: string;
  grade: string;
}