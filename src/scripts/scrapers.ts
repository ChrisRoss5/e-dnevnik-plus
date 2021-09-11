import { useToast } from "vue-toastification";
import { MutationTypes } from "@/store/mutations";
import { User, ClassInfo, SubjectCache } from "@/store/state";
import { store } from "@/store";
import newUser from "./new-user";
import * as UTILS from "./utils";

const toast = useToast();
const URLS = {
  base: "https://ocjene.skole.hr",
  login: "https://ocjene.skole.hr/login",
  logout: "https://ocjene.skole.hr/logout",
  classes: "https://ocjene.skole.hr/class",
  exams: "https://ocjene.skole.hr/exam",
};

async function login(
  email: string,
  password: string,
  fetch1?: Response,
): Promise<boolean> {
  if (window.devTestMode) return true;
  //
  // Login GET
  fetch1 = fetch1 || (await fetch(URLS.login));
  if (!fetch1.url.includes("login")) {
    //
    // Logout GET
    return (await logout()) && login(email, password);
  }
  const loginDoc = UTILS.parseDoc(await fetch1.text(), fetch1.url);
  const csrfElement = loginDoc.getElementsByName("csrf_token")[0];
  if (!csrfElement) {
    toast.error("Greška u prijavi: Nedostaje CSRF token!");
    return false;
  }
  const csrf_token = (csrfElement as HTMLInputElement).value;
  //
  // Login POST
  const fetch2 = await fetch(URLS.login, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: UTILS.formEncodedBody({ username: email, password, csrf_token }),
  });
  const loggedIn = !fetch2.url.includes("login");
  if (!loggedIn) return false;
  //
  // Either /class or /course
  const nextDoc = UTILS.parseDoc(await fetch2.text(), fetch2.url);
  const classesList = await getClassesList(
    fetch2.url == URLS.classes ? nextDoc : undefined,
  );
  if (!classesList || !classesList.length) {
    toast.error("Greška u prijavi: Popis razreda je nedostupan!");
    return false;
  }
  //
  // Old or new user
  const user = store.state.users.find((u) => u.email == email);
  if (user) {
    store.commit(MutationTypes.UPDATE_CLASSES_LIST, { user, classesList });
  } else {
    const fullName = UTILS.getElText(nextDoc.querySelector(".user-name"));
    store.commit(
      MutationTypes.ADD_USER,
      newUser({ email, password, fullName, classesList }),
    );
    setTimeout(() => {
      toast.success(
        "Automatska prijava je omogućena!\nOpciju promijenite u postavkama ⚙️",
        { timeout: false },
      );
    }, 7000);
    toast("Prva prijava može potrajati malo duže.");
  }
  await updateClassesHeadteacher();
  return true;
}

async function logout(): Promise<boolean> {
  const success = (await fetch(URLS.logout)).url.includes("login");
  if (!success) toast.error("Greška u odjavi! Pokušajte ponovo.");
  return success;
}

async function authFetch(url: string): Promise<undefined | Document> {
  const fetch1 = await fetch(url);
  if (fetch1.url.includes("login")) {
    const user = store.getters.user as User | undefined;
    if (!user) return;
    if (!(await login(user.email, user.password, fetch1))) {
      const error = `Greška u prijavi: Promijenili ste lozinku za ${user.email}!`;
      toast.error(error, { timeout: false });
      store.commit(MutationTypes.UPDATE_USER_STATUS, { user, status: false });
      return;
    }
  }
  return UTILS.parseDoc(await fetch1.text(), fetch1.url);
}

async function getClassesList(
  classesDoc?: Document,
): Promise<ClassInfo[] | undefined> {
  classesDoc = classesDoc || (await authFetch(URLS.classes));
  if (!classesDoc) return;
  const date = new Date();
  const [currentYear, currentMonth] = [date.getFullYear(), date.getMonth()];
  const classMenus = classesDoc.getElementsByClassName("class-menu-vertical");
  const classesList = [] as ClassInfo[];
  for (const menu of classMenus) {
    const year = UTILS.getElText(menu.querySelector(".class-schoolyear"));
    const [start, end] = year.split("/").map((y) => parseInt("20" + y));
    const finalGrade = menu.querySelector(".overall-grade .bold");
    classesList.push({
      url: (menu.querySelector(".school") as HTMLAnchorElement).href,
      name: UTILS.getElText(menu.querySelector(".class > .bold")),
      year: start + "./" + end + ".",
      isYearCompleted:
        currentYear > end || (currentYear == end && currentMonth > 6),
      school: UTILS.getElText(menu.querySelector(".school-name")),
      finalGrade: UTILS.getElText(finalGrade) || undefined,
    });
  }
  return classesList;
}

async function updateSubjects(classInfo: ClassInfo, forceUpdate?: boolean) {
  if (window.devTestMode) return true;
  const cachedSubjects = classInfo.cachedSubjects || [];
  const { lastUpdated, isYearCompleted } = classInfo;
  const timestamp = Date.now() / 1000;
  const updateAllSubjects = timestamp - (lastUpdated || 0) > 1800;
  const promises: Promise<boolean>[] = [];
  const saveSubject = (updatedSubject: SubjectCache | false) => {
    if (!updatedSubject) return false;
    updatedSubject.lastUpdated = timestamp;
    const toSave = { classInfo, updatedSubject };
    store.commit(MutationTypes.UPDATE_SUBJECT, toSave);
    return true;
  };

  if (isYearCompleted && classInfo.cachedSubjects && !forceUpdate) return true;
  if (updateAllSubjects || forceUpdate) {
    classInfo.lastUpdated = timestamp;

    // Default: 30 minutes; TODO: add settings
    const classDoc = await authFetch(classInfo.url);
    if (!classDoc) {
      toast.error("Greška pri dobavljanju razreda!");
      return false;
    }

    store.commit(MutationTypes.UPDATE_LAST_LOADED_CLASS_URL, {
      user: store.getters.user as User,
      url: classInfo.url,
    });

    // TODO: delete slice
    [...classDoc.querySelectorAll(".content a[href^='/grade/']")]
      /* .slice(0, 3) */
      .forEach((anchor) =>
        promises.push(
          updateSubject({
            url: (anchor as HTMLAnchorElement).href,
            name: UTILS.getElText(anchor.children[0]),
            teachers: UTILS.getElText(anchor.children[1]),
          }).then(saveSubject),
        ),
      );
  } else
    for (const subject of cachedSubjects)
      if (timestamp - (subject.lastUpdated || 0) > 1800)
        promises.push(updateSubject(subject).then(saveSubject));

  await Promise.allSettled(promises);
  return true;
}

async function updateSubject(subject: SubjectCache) {
  const subjectDoc = await authFetch(subject.url);
  if (!subjectDoc) {
    toast.error("Greška: Predmet ne postoji!");
    return false;
  }
  subject.gradesByCategory = [];
  subjectDoc.querySelectorAll(".grades-table > .row").forEach((rowEl) => {
    if (rowEl.classList.contains("final-grade")) {
      const finalGrade = UTILS.getElText(rowEl.lastElementChild).match(/\d/);
      if (finalGrade) subject.finalGrade = parseInt(finalGrade[0]);
      return;
    }
    subject.gradesByCategory?.push({
      name: UTILS.capitalize(UTILS.getElText(rowEl.firstElementChild)),
      grades: [...rowEl.children]
        .slice(1)
        .map((cell) => (UTILS.getElText(cell).match(/\d/g) || []).map(Number)),
    });
  });
  const lastNoteEl = subjectDoc.querySelector(".notes-table > .row");
  if (lastNoteEl) {
    const info = [...lastNoteEl.children].map(UTILS.getElText);
    subject.lastNote = { note: info[0], date: info[1], grade: info[2] };
  }
  return subject;
}

async function updateClassesHeadteacher() {
  const classesList = store.getters.user.classesList as ClassInfo[];
  // Because the class response is 302, requests must go 1 by 1
  // prettier-ignore
  for (let i = 0; i < classesList.length; i++) {  // nosonar: for of
    if (classesList[i].headTeacher) continue;
    const classDoc = await authFetch(classesList[i].url);
    if (!classDoc) {
      toast.error("Greška pri dobavljanju razreda!");
      return;
    }
    const headTeacher = classDoc.querySelector(".schoolyear .black");
    if (headTeacher)
      store.commit(MutationTypes.UPDATE_CLASS_PROPERTY, {
        classInfo: classesList[i],
        property: "headTeacher",
        value: UTILS.getElText(headTeacher),
      });
  }
}

async function getSectionHTML(classId: string, sectionUrl: string) {
  if (window.devTestMode || (await switchClassIfNeeded(classId))) return false;
  const doc = await authFetch(sectionUrl);
  if (!doc) {
    toast.error("Greška pri dobavljanju stranice razreda!");
    return false;
  }
  return doc.querySelector(".content") || false;
}

async function getExams(classId: string) {
  if (classId) {
    return [
      {
        subject: "Matematika",
        note: '1. pisana provjera znanja "Brojevi"',
        date: "19.10.2021",
      },
      {
        subject: "Strojarske konstrukcije",
        note: "Prva pisana provjera znanja",
        date: "22.10.2021",
      },
      {
        subject: "Engleski jezik I",
        note: "Pismena provjera znanja",
        date: "30.10.2021",
      },
      {
        subject: "Matematika",
        note: "Nizovi",
        date: "30.11.2021",
      },
      {
        subject: "Roboti i manipulatori (izborni)",
        note: "1. pisana provjera znanja",
        date: "5.11.2021",
      },
      {
        subject: "Alati i naprave",
        note: "1. Pisana provjera znanja - Alati za savijanje",
        date: "6.11.2021",
      },
      {
        subject: "Termodinamika",
        note: "1. pisana provjera: Motori s unutarnjim izgaranjem",
        date: "16.11.2021",
      },
      {
        subject: "Hrvatski jezik",
        note: "Prva pisana provjera znanja",
        date: "23.11.2021",
      },
      {
        subject: "Hrvatski jezik",
        note: "Prva školska zadaća",
        date: "26.11.2021",
      },
      {
        subject: "Pneumatika i hidraulika",
        note: "1. Pisana provjera znanja",
        date: "24.11.2021",
      },
      {
        subject: "Matematika",
        note: "Funkcije: 3. pisana provjera znanja",
        date: "1.2.2022",
      },
      {
        subject: "Alati i naprave",
        note: "2. Pisana provjera znanja: Alati za dubokov vučenje",
        date: "5.2.2022",
      },
      {
        subject: "Hrvatski jezik",
        note: "Druga školska zadaća",
        date: "25.2.2022",
      },
      {
        subject: "Matematika",
        note: "Derivacije: pisana provjera znanja",
        date: "1.3.2022",
      },
      {
        subject: "Strojarske konstrukcije",
        note: "3. pisana provjera znanja",
        date: "11.3.2022",
      },
      {
        subject: "Termodinamika",
        note: "2.pisana provjera znanja",
        date: "29.3.2022",
      },
      {
        subject: "Hrvatski jezik",
        note: "Druga pisana provjera znanja",
        date: "9.3.2022",
      },
      {
        subject: "Pneumatika i hidraulika",
        note: "2. Pisana provjera znanja",
        date: "3.3.2022",
      },
      {
        subject: "Kontrola i osiguranje kvalitete",
        note: "2. pisana provjera znanja",
        date: "22.3.2022",
      },
      {
        subject: "CNC tehnologije",
        note: "Pismena provjera znanja",
        date: "31.3.2022",
      },
      {
        subject: "Matematika",
        note: "5. pisana provjera znanja",
        date: "21.4.2022",
      },
      {
        subject: "Engleski jezik I",
        note: "Pismena provjera znanja",
        date: "16.4.2022",
      },
      {
        subject: "Roboti i manipulatori (izborni)",
        note: "Pisana provjera znanja",
        date: "23.4.2022",
      },
      {
        subject: "Alati i naprave",
        note: "3.Pisana provjera znanja - Alati za kovanje",
        date: "30.4.2022",
      },
      {
        subject: "Strojarske konstrukcije",
        note: "2. pisana provjera znanja",
        date: "17.12.2021",
      },
      {
        subject: "Engleski jezik I",
        note: "Pismena provjera znanja",
        date: "10.12.2021",
      },
      {
        subject: "Kontrola i osiguranje kvalitete",
        note: "1. pisana provjera znanja: Osnove kontrole kvalitete",
        date: "7.12.2021",
      },
      {
        subject: "Strojarske konstrukcije",
        note: "Četvrta pisana provjera znanja",
        date: "6.5.2022",
      },
      {
        subject: "Pneumatika i hidraulika",
        note: "3. Pismena provjera znanja",
        date: "5.5.2022",
      },
    ];
  }
  if (window.devTestMode || (await switchClassIfNeeded(classId))) return false;
  const doc = await authFetch(URLS.exams);
  if (!doc) {
    toast.error("Greška pri dobavljanju ispita za kalendar!");
    return false;
  }
  const classInfo: ClassInfo = store.getters.classInfo(classId);
  const [startYear, endYear] = classInfo.year.split("./").map(Number);
  return [...doc.querySelectorAll(".flex-table.row")].map((row) => {
    const [subject, note, _date] = [...row.children].map(UTILS.getElText);
    const date =
      _date + "20" + (parseInt(_date.split(".")[1]) > 8 ? startYear : endYear);
    return { subject, note, date };
  });
}

async function getSchoolYears() {
  return [
    {
      startingDate: "6.9.2021",
      endingDate: "21.6.2022",
      edgeDays: {
        "6.9.2021": "Počinje prvo polugodište",
        "23.12.2021": "Završava prvo polugodište",
        "10.1.2022": "Počinje drugo polugodište",
        "25.5.2022": "Završava drugo polugodište za maturante",
        "21.6.2022": "Završava drugo polugodište",
      },
      holidays: {
        "1.11.2021": "Svi sveti",
        "18.11.2021": "Dan sjećanja na žrtve Domovinskog rata",
        "25.12.2021": "Božić",
        "26.12.2021": "Sveti Stjepan",
        "1.1.2022": "Nova godina",
        "6.1.2022": "Sveta tri kralja",
        "17.4.2022": "Uskrs",
        "18.4.2022": "Uskrsni ponedjeljak",
        "1.5.2022": "Međunarodni praznik rada",
        "30.5.2022": "Dan državnosti",
        "16.6.2022": "Tijelovo",
        "22.6.2022": "Dan antifašističke borbe",
        "5.8.2022":
          "Dan pobjede i domovinske zahvalnosti i Dan hrvatskih branitelja",
        "15.8.2022": "Velika Gospa",
      },
      vacationRanges: [
        {
          start: "1.9.2021",
          end: "5.9.2021",
          label: "Ljetni praznici",
        },
        {
          start: "2.11.2021",
          end: "3.11.2021",
          label: "Jesenski praznici",
        },
        {
          start: "24.12.2021",
          end: "9.1.2022",
          label: "Prvi dio zimskih praznika",
        },
        {
          start: "21.2.2022",
          end: "27.2.2022",
          label: "Drugi dio zimskih praznika",
        },
        {
          start: "14.4.2022",
          end: "24.4.2022",
          label: "Proljetni praznici",
        },
        {
          start: "23.6.2022",
          end: "31.8.2022",
          label: "Ljetni praznici",
        },
      ],
    },
  ];
}

async function switchClassIfNeeded(classId: string) {
  const user = store.getters.user as User;
  const classUrl = store.getters.classInfo(classId).url as string;
  const lastLoadedClassUrl = user.lastLoadedClassUrl || "";
  if (lastLoadedClassUrl != classUrl) {
    if (!(await authFetch(classUrl))) {
      toast.error("Greška pri dobavljanju razreda!");
      return true;
    }
    store.commit(MutationTypes.UPDATE_LAST_LOADED_CLASS_URL, {
      user,
      url: classUrl,
    });
  }
}

export { login, logout, updateSubjects, getSectionHTML, getExams, getSchoolYears };
