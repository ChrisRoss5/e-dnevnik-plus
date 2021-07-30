import { User, ClassInfo } from "@/store/state";

interface InitData {
  email: string;
  password: string;
  fullName: string;
  classesList: ClassInfo[];
}

export default function newUser(info: InitData): User {
  return {
    ...info,
    signedIn: true,
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
    updates: {
      classGrades: {
        lastUpdated: 0,
        maxAge: 0,
      },
    },
    classes: [],
  };
}
