import { User, ClassInfo } from "@/store/state";

interface InitData {
  email: string;
  password: string;
  fullName: string;
  classesList: ClassInfo[];
}

export default function newUser(initData: InitData): User {
  return {
    ...initData,
    signedIn: true,
    settings: {
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
        subjectColors: false,
        countAvgs: false,
        sortByDragging: true,
        subjectsOrder: {},
        expandedSubjects: []
      },
      calendarSettings: {
        showEntireCalendar: true,
        zoom: 3,
        customNotes: []
      }
    },
  };
}
