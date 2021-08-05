const state = {
  settings: {},
  users: [
    {
      signedIn: true,
      email: "kristijan.rosandic@skole.hr",
      password: "grandayyy",
      fullName: "Kristijan Rosandić",
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
      classesList: [
        {
          url: "aaa123",
          name: "4.a",
          year: "19/20",
          headTeacher: "asd asd",
          school: "ccccccc cccccc ddddddd",
          finalGrade: 5,
        },
        {
          url: "bbb234",
          name: "4.b",
          year: "2018./2019.",
          headTeacher: "asd asd",
          school: "ccccccc ggggggg ddddddd",
          finalGrade: 5,
          opened: false,
        },
        {
          url: "ccc345",
          name: "4.c",
          year: "2017./2018.",
          headTeacher: "ddd fff",
          school: "ccccccc cccccc ddddddd",
          finalGrade: 5,
          opened: true,
        },
      ],
    },
  ],
} as State;

import { State } from "./state";

export default function chromeLocalStorage(data?: State) {
  return new Promise((resolve) => {
    resolve(state);
    //(chrome.storage.local[data ? "set" : "get"] as any)(data || null, resolve);
  });
}

// TODO: chrome.storage.sync