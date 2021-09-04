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

async function updateSubjects( // NOSONAR: Cognitive Complexity from 18 to the 15 allowed
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

async function updateSubject(
  subject: SubjectCache,
): Promise<SubjectCache | false> {
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

async function getSectionHTML(
  classId: string,
  sectionUrl: string,
): Promise<Element | false> {
  if (window.devTestMode) return false;

  const user = store.getters.user as User;
  const classUrl = store.getters.classInfo(classId).url as string;
  const lastLoadedClassUrl = user.lastLoadedClassUrl || "";
  if (lastLoadedClassUrl != classUrl) {
    if (!(await authFetch(classUrl))) {
      toast.error("Greška pri dobavljanju razreda!");
      return false;
    }
    store.commit(MutationTypes.UPDATE_LAST_LOADED_CLASS_URL, {
      user,
      url: classUrl,
    });
  }
  const doc = await authFetch(sectionUrl);
  if (!doc) {
    toast.error("Greška pri dobavljanju stranice razreda!");
    return false;
  }
  return doc.querySelector(".content") || false;
}

export { login, logout, updateSubjects, getSectionHTML };
