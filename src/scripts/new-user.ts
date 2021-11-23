import { ClassInfo, Settings, User } from "@/store/state";

interface InitData {
  email: string;
  password: string;
  fullName: string;
  classesList: ClassInfo[];
}

const { width } = window.screen;

export const defaultUserSettings: Settings = {
  autoSignIn: true,
  classTabsOrder: [
    "Ocjene",
    "Biljeske",
    "Ispiti",
    "Izostanci",
    "Vladanja",
    "Raspored",
    "Statistika",
  ],
  subjectsSettings: {
    margin: 0,
    zoom: 2,
    expandTablesOnHover: true,
    subjectLineColors: false,
    subjectColumnColors: false,
    countAvgs: false,
    sortByDragging: true,
    subjectsOrder: {},
    expandedSubjects: [],
  },
  calendarSettings: {
    showEntireCalendar: false,
    zoom: width >= 1440 ? 4 : 3,
    customNotes: [],
  },
  calculatorSettings: {
    selectedSchool: "",
    selectedProgram: "",
    selectedExtraPoints: "",
    userValues: [[], [], [], [], [], [], []],
  },
  websitesSettings: [
    {
      name: "Školska stranica",
      urls: [],
    },
    {
      name: "Školski e-Rudnik",
      urls: [
        {
          name: "ŠeR - Školski e-Rudnik (Vol. 2)",
          url:
            "https://app.powerbi.com/view?r=eyJrIjoiM2Q1NjVmZDEtMGUyMy00MDBiLTkzYWItYjBhMTA3MDFlOWUxIiwidCI6IjJjMTFjYmNjLWI3NjEtNDVkYi1hOWY1LTRhYzc3ZTk0ZTFkNCIsImMiOjh9",
          tooltip:
            "Prikazuje statističke podatke o općem uspjehu učenika, njihovim ocjenama,<br> " +
            "opravdanim i neopravdanim izostancima, pedagoškim mjerama<br> " +
            "te trendove po školskim godinama.",
        },
        {
          name: "ŠeR - Školski e-Rudnik",
          url:
            "https://app.powerbi.com/view?r=eyJrIjoiZWE3YTE4OWQtOWJmNC00OTJmLWE2MjktYTQ5MWJlNDNlZDQ0IiwidCI6IjJjMTFjYmNjLWI3NjEtNDVkYi1hOWY1LTRhYzc3ZTk0ZTFkNCIsImMiOjh9",
          tooltip:
            "Prikazuje adresar školskih ustanova, geografsku distribuciju škola i učenika,<br> " +
            "razne statističke podatke o školama, učenicima i o obrazovnim programima<br> " +
            "te demografske trendove po školskim godinama.",
        },
        {
          name: "ŠeR - Školski e-Rudnik (Vol. 3)",
          url:
            "https://app.powerbi.com/view?r=eyJrIjoiOTUxNTE3YmQtM2E3MC00MDc0LTg3OTQtYTExZWZhYzU3Y2FlIiwidCI6IjJjMTFjYmNjLWI3NjEtNDVkYi1hOWY1LTRhYzc3ZTk0ZTFkNCIsImMiOjh9",
          tooltip:
            "Prikazuje rezultate učenika na državnoj maturi, njihove ocjene u završnim<br> " +
            "razredima osnovnih i srednjih škola, trendove po školskim godinama<br> " +
            "te upise na visoka učilišta.",
        },
      ],
    },
    {
      name: "Srednja.hr",
      urls: [{ name: "Srednja.hr", url: "https://www.srednja.hr/" }],
    },
  ],
};

export default function newUser(initData: InitData): User {
  return {
    ...initData,
    signedIn: true,
    settings: defaultUserSettings,
    classNews: [],
  };
}
