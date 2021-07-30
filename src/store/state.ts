export const state: State = {
  settings: {
    classTabsOrder: [
      "Ocjene",
      "Bilješke",
      "Ispiti",
      "Izostanci",
      "Vladanja",
      "Raspored",
      "Statistika",
    ],
  },
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
  updates: Updates;
  classesList: ClassInfo[];
  classes: Class[];
}

export interface Class {
  url: string;
  subjects: Subject[];
  notes: ClassNote[];
  exams: Exam[];
  absences: Absence[];
  conduct: Conduct;
  schedule: Schedule;
}

export interface Schedule {
  A: ScheduleSubjectInfo[];
  B: ScheduleSubjectInfo[];
}

export interface ScheduleSubjectInfo {
  hour: number;
  subject: string;
}

export interface Conduct {
  final: string;
  measures: ConductMeasure[];
}

export interface ConductMeasure {
  name: string;
  info: string;
  date: string;
}

export interface Absence {
  hour: number;
  subject: string;
  status: string;
  cause: string;
}

export interface Exam {
  subject: string;
  note: string;
  date: string;
}

export interface ClassNote {
  title: string;
  note: string;
}

export interface Subject {
  name: string;
  teacher: string;
  categories: SubjectGradesPerCategory[];
  finalGrade: number;
  notes: SubjectNote[];
}

export interface SubjectNote {
  note: string;
  date: string;
  grade: number;
}

export interface SubjectGradesPerCategory {
  name: string;
  grades: number[];
}

export interface ClassInfo {
  url: string;
  name: string;
  year: string;
  headTeacher?: string;
  school: string;
  finalGrade?: number;
}

export interface PersonalData {
  student: StudentPersonalInfo[];
  contacts: StudentPersonalInfo[][];
}

export interface StudentPersonalInfo {
  key: string;
  value: string;
}

export interface Updates {
  classGrades: PageUpdateInfo;
}

export interface PageUpdateInfo {
  lastUpdated: number;
  maxAge: number;
}

export interface Settings {
  classTabsOrder: string[];
}
