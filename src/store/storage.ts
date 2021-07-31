const state = {
  settings: {},
  users: [
    {
      signedIn: false,
      email: "kristijan.rosandicc@skole.hr",
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
      updates: {
        classGrades: {
          lastUpdated: 0,
          maxAge: 0,
        },
      },
      classesList: [
        {
          url: "aaa",
          name: "4.a",
          year: "19/20",
          headTeacher: "asd asd",
          school: "ccccccc cccccc ddddddd",
          finalGrade: 5,
        },
        {
          url: "bbb",
          name: "4.b",
          year: "2018./2019.",
          headTeacher: "asd asd",
          school: "ccccccc ggggggg ddddddd",
          finalGrade: 5,
          opened: false,
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

/* chrome.runtime.sendMessage({greeting: "hello"}, function(response: string) {
  console.log(response);
}); */
