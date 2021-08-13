// @ts-nocheck

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
  //
  // Login GET
  console.log("LOGGING IN");
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
    }, 1000);
  }
  await updateClassesHeadteacher(classesList, !user);
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
  const classMenus = classesDoc.getElementsByClassName("class-menu-vertical");
  const classesList = [] as ClassInfo[];
  for (const menu of classMenus) {
    const classInfo: ClassInfo = {
      url: (menu.querySelector(".school") as HTMLAnchorElement).href,
      name: UTILS.getElText(menu.querySelector(".class > .bold")),
      year: UTILS.getElText(menu.querySelector(".class-schoolyear")),
      school: UTILS.getElText(menu.querySelector(".school-name")),
    };
    const [start, end] = classInfo.year.split("/");
    if (start && end) classInfo.year = "20" + start + "./20" + end + ".";
    const finalGrade = menu.querySelector(".overall-grade .bold");
    if (finalGrade) classInfo.finalGrade = UTILS.getElText(finalGrade);
    classesList.push(classInfo);
  }
  return classesList;
}

async function updateSubjects(
  classInfo: ClassInfo,
  forceUpdate?: true,
): Promise<boolean> {
  return true;

  const cachedSubjects = classInfo.cachedSubjects || [];
  const lastUpdated = classInfo.lastUpdated;
  const timestamp = Date.now() / 1000;
  const updateAllSubjects = !lastUpdated || timestamp - lastUpdated > 1800;
  const promises: Promise<boolean>[] = [];
  const saveSubject = (updatedSubject: SubjectCache | false) => {
    updatedSubject &&
      store.commit(MutationTypes.UPDATE_SUBJECT, {
        classInfo,
        updatedSubject,
      });
    return !!updatedSubject;
  };

  if (updateAllSubjects || forceUpdate) {
    classInfo.lastUpdated = timestamp;

    // Default: 30 minutes; TODO: add settings
    const classDoc = await authFetch(classInfo.url);
    if (!classDoc) {
      toast.error("Greška pri dobavljanju razreda!");
      return false;
    }

    // TODO: delete slice
    [...classDoc.querySelectorAll(".content a[href^='/grade/']")]
      .slice(0, 3)
      .forEach((anchor) =>
        promises.push(
          updateSubject({
            url: (anchor as HTMLAnchorElement).href,
            name: UTILS.getElText(anchor.children[0]),
            teachers: UTILS.getElText(anchor.children[1]),
            lastUpdated: timestamp,
          }).then(saveSubject),
        ),
      );
  } else {
    for (const subject of cachedSubjects) {
      timestamp - subject.lastUpdated > 1800 &&
        promises.push(updateSubject(subject).then(saveSubject));
    }
  }

  const success = await Promise.allSettled(promises);
  console.log(success);
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

async function updateClassesHeadteacher(
  classesList: ClassInfo[],
  firstLogin: boolean,
) {
  firstLogin && toast("Prva prijava može potrajati malo duže.");

  // Because the class response is 302, requests must go 1 by 1
  // prettier-ignore
  for (let i = 0; i < classesList.length; i++) { // nosonar: for of
    if (classesList[i].headTeacher) continue;
    const classDoc = await authFetch(classesList[i].url);
    if (!classDoc) {
      toast.error("Greška pri dobavljanju razreda!");
      return;
    }
    const headteacher = classDoc.querySelector(".schoolyear .black");
    headteacher &&
      store.commit(MutationTypes.UPDATE_CLASS_HEADTEACHER, {
        classInfo: classesList[i],
        headteacher: UTILS.getElText(headteacher),
      });
  }
}

export { login, logout, updateSubjects };
