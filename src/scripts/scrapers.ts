import { TYPE, useToast } from "vue-toastification";
import { MutationTypes } from "@/store/mutations";
import { User, ClassInfo, SubjectCache } from "@/store/state";
import { store } from "@/store";
import { CalendarYear, CalendarExam } from "@/views/calendar/interface";
import newUser from "./new-user";
import * as UTILS from "./utils";
import { ToastOptions } from "vue-toastification/dist/types/types";

const toast = useToast();
const URLS = {
  base: "https://ocjene.skole.hr",
  login: "https://ocjene.skole.hr/login",
  logout: "https://ocjene.skole.hr/logout",
  classes: "https://ocjene.skole.hr/class",
  exams: "https://ocjene.skole.hr/exam",
  schoolList: "https://ocjene.skole.hr/school",
  calendarDates:
    "https://raw.githubusercontent.com/ChrisRoss5/e-Dnevnik-Plus/master/src/assets/calendar-dates/calendar-dates.json",
  aboutPage:
    "https://raw.githubusercontent.com/ChrisRoss5/e-Dnevnik-Plus/master/src/assets/about-app/about-app.html",
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
    toastError("Greška u prijavi: Nedostaje CSRF token!");
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
  const isClassChoice = fetch2.url == URLS.classes;
  const classesList = await getClassesList(isClassChoice ? nextDoc : undefined);
  if (!classesList || !classesList.length) {
    toastError("Greška u prijavi: Popis razreda je nedostupan!");
    return false;
  }
  //
  // Old or new user
  const user = store.state.users.find((u) => u.email == email);
  window.gtag("event", "request", {
    event_category: "user auth",
    event_label: (user ? "" : "NEW ") + "user signed in",
    value: classesList.length,
  });
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
        "Automatska prijava je omogućena!\nOpciju promijeni u postavkama ⚙️",
        { timeout: false },
      );
    }, 7000);
    toast("Dobro došli u novi e-Dnevnik Plus!");
  }
  await updateClassesInfo();
  return true;
}

async function logout(): Promise<boolean> {
  const success = (await fetch(URLS.logout)).url.includes("login");
  if (!success) toastError("Greška u odjavi! Pokušajte ponovo.");
  window.gtag("event", "request", {
    event_category: "user auth",
    event_label: "user signed out",
  });
  return success;
}

async function authFetch(url: string): Promise<undefined | Document> {
  let fetch1 = await fetch(url);
  if (fetch1.url.includes("login")) {
    const user = store.getters.user as User | undefined;
    if (!user) return;
    if (!user.settings.autoSignIn) {
      toastError("Odjavljeni ste jer nemate omogućenu automatsku prijavu!");
      store.commit(MutationTypes.UPDATE_USER_STATUS, { user, status: false });
      return;
    }
    if (!(await login(user.email, user.password, fetch1))) {
      const error = `Greška u prijavi: Promijenili ste lozinku za ${user.email}!`;
      toastError(error, { timeout: false });
      store.commit(MutationTypes.UPDATE_USER_STATUS, { user, status: false });
      return;
    }
    fetch1 = await fetch(url);
  }
  return UTILS.parseDoc(await fetch1.text(), fetch1.url);
}

async function getClassesList(
  classesDoc?: Document,
): Promise<ClassInfo[] | undefined> {
  classesDoc = classesDoc || (await authFetch(URLS.classes));
  if (!classesDoc) return;
  const date = new Date();
  const [currentYear, currentMonth] = [date.getFullYear(), date.getMonth() + 1];
  const classMenus = classesDoc.getElementsByClassName("class-menu-vertical");
  const classesList = [] as ClassInfo[];
  for (const menu of classMenus) {
    const url = (menu.querySelector(".school") as HTMLAnchorElement).href;
    const year = UTILS.getElText(menu.querySelector(".class-schoolyear"));
    const [start, end] = year.split("/").map((y) => parseInt("20" + y));
    const finalGrade = UTILS.getElText(
      menu.querySelector(".overall-grade .bold"),
    );

    if (!classesList.length) await authFetch(url); // Must enter the newest class

    classesList.push({
      url,
      name: UTILS.getElText(menu.querySelector(".class > .bold")),
      year: start + "./" + end + ".",
      isYearCompleted:
        currentYear > end || (currentYear == end && currentMonth > 7),
      finalGrade: finalGrade || undefined,
    });
    if (finalGrade)
      window.gtag("event", "user info", {
        event_category: "grade",
        event_label: "finalGradeOriginal",
        value: finalGrade,
      });
  }
  return classesList;
}

async function updateSubjects(
  classInfo: ClassInfo,
  forceUpdate?: boolean,
): Promise<boolean> {
  if (window.devTestMode) return true;
  const cachedSubjects = classInfo.cachedSubjects || [];
  const { lastUpdated, isYearCompleted } = classInfo;
  const timestamp = Date.now() / 1000;
  const updateAllSubjects = timestamp - (lastUpdated || 0) > 1800;
  const promises: Promise<boolean>[] = [];
  const saveSubject = (updatedSubject: SubjectCache | false) => {
    if (!updatedSubject) return false;
    updatedSubject.lastUpdated = timestamp;
    const commit = { classInfo, updatedSubject };
    store.commit(MutationTypes.UPDATE_SUBJECT, commit);
    return true;
  };

  if (isYearCompleted && classInfo.cachedSubjects && !forceUpdate) return true;
  if (updateAllSubjects || forceUpdate) {
    classInfo.lastUpdated = timestamp;

    // Default: 30 minutes; TODO: add settings
    const classDoc = await authFetch(classInfo.url);
    if (!classDoc) {
      toastError("Greška pri dobavljanju razreda!");
      return false;
    }

    store.commit(MutationTypes.UPDATE_LAST_LOADED_CLASS_URL, {
      user: store.getters.user as User,
      url: classInfo.url,
    });

    classDoc.querySelectorAll(".content a[href^='/grade/']").forEach((anchor) =>
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

async function updateSubject(
  subject: SubjectCache,
): Promise<false | SubjectCache> {
  const subjectDoc = await authFetch(subject.url);
  if (!subjectDoc) {
    toastError("Greška: Predmet ne postoji!");
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

async function updateClassesInfo(): Promise<void> {
  const user = store.getters.user as User;
  const classesList = store.getters.user.classesList as ClassInfo[];
  //
  // Because the class response is 302, requests must go 1 by 1
  for (const classInfo of classesList) {
    const { school, schoolUrl, headTeacher, url } = classInfo;
    if (school && schoolUrl && headTeacher) continue;
    //
    // Enter class
    const classDoc = await authFetch(classInfo.url);
    if (!classDoc) {
      toastError("Greška pri dobavljanju razreda!");
      continue;
    }
    store.commit(MutationTypes.UPDATE_LAST_LOADED_CLASS_URL, { user, url });
    //
    // Find class head teacher
    if (!headTeacher) {
      const headTeacherEl = classDoc.querySelector(".schoolyear .black");
      store.commit(MutationTypes.UPDATE_CLASS_PROPERTY, {
        classInfo,
        property: "headTeacher",
        value: headTeacherEl ? UTILS.getElText(headTeacherEl) : "/",
      });
    }
    //
    // Find school name
    let _school = "";
    if (!school) {
      const schoolEl = classDoc.querySelector(".school-name");
      _school = schoolEl ? UTILS.getElText(schoolEl.firstElementChild) : "/";
      store.commit(MutationTypes.UPDATE_CLASS_PROPERTY, {
        classInfo,
        property: "school",
        value: _school,
      });
    }
    //
    // Find school website URL
    if (!schoolUrl) {
      const _url = (await findSchoolUrl(school || _school, classesList)) || "/";
      const thisWebsiteInfo = { name: school || _school, url: _url };
      const websiteSettings = user.settings.websitesSettings.find(
        (w) => w.name == "Školska stranica",
      );
      if (
        websiteSettings &&
        !websiteSettings.urls.some((w) => w.name == thisWebsiteInfo.name)
      )
        websiteSettings.urls.push(thisWebsiteInfo);
      store.commit(MutationTypes.UPDATE_CLASS_PROPERTY, {
        classInfo,
        property: "schoolUrl",
        value: _url,
      });
    }
  }
}

async function findSchoolUrl(
  school: string,
  classesList: ClassInfo[],
): Promise<string | undefined> {
  for (const classInfo of classesList)
    if (classInfo.school == school && classInfo.schoolUrl)
      return classInfo.schoolUrl;
  const schoolListDoc = await authFetch(URLS.schoolList);
  if (!schoolListDoc) {
    toastError("Greška pri dobavljanju popisa škola!");
    return;
  }
  const _school = school.toLowerCase().replaceAll(";", ",");
  const row = [...schoolListDoc.querySelectorAll(".list a")].find(
    (r) =>
      UTILS.getElText(r)
        .toLowerCase()
        .replaceAll(";", ",") == _school,
  ) as HTMLAnchorElement | undefined;
  if (!(row && row.href) || row.href.includes("/skole.hr/")) return;
  return row.href;
}

async function getOriginalSectionPage(
  classId: string,
  sectionUrl: string,
): Promise<{content: Element, styleURL: string} | false> {
  if (window.devTestMode || (await switchClassIfNeeded(classId))) return false;
  const doc = await authFetch(sectionUrl);
  if (!doc) {
    toastError("Greška pri dobavljanju stranice razreda!");
    return false;
  }
  const link = doc.querySelector("link[rel='stylesheet']");
  return {
    content: doc.querySelector(".content")!,
    styleURL: (link as HTMLLinkElement).href,
  };
}

async function getExams(classId: string): Promise<false | CalendarExam[]> {
  if (window.devTestMode) {
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
    toastError("Greška pri dobavljanju ispita za kalendar!");
    return false;
  }
  const classInfo: ClassInfo = store.getters.classInfo(classId);
  const [startYear, endYear] = classInfo.year.split("./").map(Number);
  return [...doc.querySelectorAll(".flex-table.row")].map((row) => {
    const [subject, note, _date] = [...row.children].map(UTILS.getElText);
    const date =
      _date + (parseInt(_date.split(".")[1]) > 8 ? startYear : endYear);
    return { subject, note, date };
  });
}

async function getCalendarDates(): Promise<CalendarYear[] | false> {
  const response = await fetch(URLS.calendarDates);
  if (!response.ok) {
    toastError("Greška pri dobavljanju datuma za kalendar!");
    return false;
  }
  return JSON.parse(await response.text());
}

async function getAboutPage(): Promise<string | false> {
  const response = await fetch(URLS.aboutPage);
  if (!response.ok) {
    toastError("Greška pri dobavljanju stranice o aplikaciji!");
    return false;
  }
  return response.text();
}

async function switchClassIfNeeded(classId: string): Promise<true | undefined> {
  const user = store.getters.user as User;
  const classUrl = store.getters.classInfo(classId).url as string;
  const lastLoadedClassUrl = user.lastLoadedClassUrl || "";
  if (lastLoadedClassUrl != classUrl) {
    if (!(await authFetch(classUrl))) {
      toastError("Greška pri dobavljanju razreda!");
      return true;
    }
    store.commit(MutationTypes.UPDATE_LAST_LOADED_CLASS_URL, {
      user,
      url: classUrl,
    });
  }
}

function toastError(
  reason: string,
  config?: ToastOptions & { type?: TYPE.ERROR },
) {
  toast.error(reason, config);
  window.gtag("event", "error", {
    event_category: "scrapers",
    event_label: reason,
  });
}

export {
  login,
  logout,
  updateSubjects,
  getOriginalSectionPage,
  getExams,
  getCalendarDates,
  getAboutPage,
};
