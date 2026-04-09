export const state: State = {
  settings: {
    darkTheme: true,
    transitions: true,
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
  classNews: ClassNews[];
  adsShown: string[];
}

export interface Settings {
  autoSignIn: boolean;
  classTabsOrder: string[];
  subjectsSettings: SubjectsSettings;
  calendarSettings: CalendarSettings;
  calculatorSettings: CalculatorSettings;
  websitesSettings: WebsiteSettings[];
}

export interface SubjectsSettings {
  margin: number;
  zoom: number;
  expandTablesOnHover: boolean;
  subjectLineColors: boolean;
  subjectColumnColors: boolean;
  countAvgs: boolean;
  sortByDragging: boolean;
  subjectsOrder: Record<string, string[] | undefined>;
  expandedSubjects: string[];
}

export interface CalendarSettings {
  showEntireCalendar: boolean;
  zoom: number;
  customNotes: CustomCalendarNote[];
}

export interface CustomCalendarNote {
  date: string;
  note: string;
}

export interface CalculatorSettings {
  selectedSchool: string;
  selectedProgram: string;
  selectedExtraPoints: string;
  userValues: number[][];
}

export interface WebsiteSettings {
  name: string;
  urls: WebsiteInfo[];
  disabled?: boolean;
}

export interface WebsiteInfo {
  url: string;
  name: string;
  tooltip?: string;
}

export interface GlobalSettings {
  darkTheme: boolean;
  transitions: boolean;
  navbarCollapsed: boolean;
}

export interface ClassInfo {
  url: string;
  name: string;
  year: string;
  isYearCompleted: boolean;
  school?: string;
  schoolUrl?: string;
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
  grades: number[][];
}

export interface Note {
  note: string;
  date: string;
  grade: string;
}

export interface ClassNews {
  subjectName: string;
  subjectNews: SubjectNews[];
}

export interface SubjectNews {
  grade: number | null;
  note: string;
}

export interface Ad {
  id: string;
  goal?: number;
  goalComplete?: boolean;
  targetUserTypes?: UserType[];
  targetClassYears?: number[];
  targetSchoolNames?: string[];
  targetSchoolPrograms?: string[];
  targetMinGradeCurrClass?: number;
  targetMaxGradeCurrClass?: number;
  targetMinGradePrevClass?: number;
  targetMaxGradePrevClass?: number;
  targetSubjectGrades?: {
    name: string;
    minGrade?: number;
    maxGrade?: number
  };
  images: {
    popup?: string;
    banner?: string | string[];
    logo?: string;
  };
  showPopup?: boolean;
  url: string;
}

export type UserType = "srednjoškolac" | "osnovnoškolac";
