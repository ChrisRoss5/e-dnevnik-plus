export const state: State = {
  settings: {},
  users: [
    {
      signedIn: true,
      email: "kristijan.rosandic@skole.hr",
      password: "grandayyy",
      fullName: "Kristijan Rosandić",
      settings: {},
      updates: {
        personalData: {
          lastUpdated: 0,
          maxAge: 0,
        },
        classesList: {
          lastUpdated: 0,
          maxAge: 0,
        },
        classes: {
          lastUpdated: 0,
          maxAge: 0,
        },
        subjects: {
          lastUpdated: 0,
          maxAge: 0,
        },
        subject: {
          lastUpdated: 0,
          maxAge: 0,
        },
        notes: {
          lastUpdated: 0,
          maxAge: 0,
        },
        exams: {
          lastUpdated: 0,
          maxAge: 0,
        },
        absences: {
          lastUpdated: 0,
          maxAge: 0,
        },
        conduct: {
          lastUpdated: 0,
          maxAge: 0,
        },
        schedule: {
          lastUpdated: 0,
          maxAge: 0,
        },
      },
      personalData: {
        student: [
          {
            key: "",
            value: "",
          },
        ],
        contacts: [
          [
            {
              key: "",
              value: "",
            },
          ],
        ],
      },
      classesList: [
        {
          url: "aaa",
          name: "4.a",
          year: "2019./2020.",
          headTeacher: "asd asd",
          school: "ccccccc cccccc ddddddd",
          finalGrade: 5,
          opened: true,
        },
        {
          url: "bbb",
          name: "4.b",
          year: "2018./2019.",
          headTeacher: "asd asd",
          school: "ccccccc ggggggg ddddddd",
          finalGrade: 5,
          opened: true,
        },
        {
          url: "ccc",
          name: "4.c",
          year: "2017./2018.",
          headTeacher: "ddd fff",
          school: "ccccccc cccccc ddddddd",
          finalGrade: 5,
          opened: true,
        },
      ],
      classes: [
        {
          url: "aaa",
          subjects: [
            {
              name: "",
              teacher: "",
              categories: [
                {
                  name: "",
                  grades: [0],
                },
              ],
              finalGrade: 0,
              notes: [
                {
                  note: "",
                  date: "",
                  grade: 0,
                },
              ],
            },
          ],
          notes: [
            {
              title: "",
              note: "",
            },
          ],
          exams: [
            {
              subject: "",
              note: "",
              date: "",
            },
          ],
          absences: [
            {
              hour: 0,
              subject: "",
              status: "",
              cause: "",
            },
          ],
          conduct: {
            final: "",
            measures: [
              {
                name: "",
                info: "",
                date: "",
              },
            ],
          },
          schedule: {
            A: [
              {
                hour: 0,
                subject: "",
              },
            ],
            B: [
              {
                hour: 0,
                subject: "",
              },
            ],
          },
        },
      ],
    },
  ],
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
  personalData: PersonalData;
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
  headTeacher: string;
  school: string;
  finalGrade: number;
  opened: boolean;
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
  personalData: PageUpdateInfo;
  classesList: PageUpdateInfo;
  classes: PageUpdateInfo;
  subjects: PageUpdateInfo;
  subject: PageUpdateInfo;
  notes: PageUpdateInfo;
  exams: PageUpdateInfo;
  absences: PageUpdateInfo;
  conduct: PageUpdateInfo;
  schedule: PageUpdateInfo;
}

export interface PageUpdateInfo {
  lastUpdated: number;
  maxAge: number;
}

export interface Settings {
  // eslint-disable-next-line
  [key: string]: any;
}
