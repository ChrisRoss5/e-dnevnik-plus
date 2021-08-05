import { useToast } from "vue-toastification";
import { MutationTypes } from "@/store/mutations";
import { User, ClassInfo, SubjectCache } from "@/store/state";
import { store } from "@/store";
import newUser from "./new-user";

const toast = useToast();
const parser = new DOMParser();
const URLS = {
  login: "https://ocjene.skole.hr/login",
  logout: "https://ocjene.skole.hr/logout",
  classes: "https://ocjene.skole.hr/class",
};

function formEncodedBody(obj: Record<string, string>): string {
  return Object.keys(obj)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
    .join("&");
}

function getElText(el: Element | null): string {
  return el ? (el.textContent as string).trim() : "";
}

function parseNum(num: string): number {
  return parseFloat(num.replace(",", "."));
}

function updateClassesTeacher(user: User) {
  user.classesList.forEach(async (classInfo) => {
    if (classInfo.headTeacher) return;
    const classDoc = await authFetch(classInfo.url);
    if (!classDoc) return;
    const teacher = classDoc.querySelector(".schoolyear .black");
    teacher &&
      store.commit(MutationTypes.UPDATE_CLASS_TEACHER, {
        classInfo,
        teacher,
      });
  });
}

async function authFetch(url: string): Promise<undefined | Document> {
  const fetch1 = await fetch(url);
  if (fetch1.url.includes("login")) {
    const user = store.getters.user as User | undefined;
    if (!user) return;
    if (!(await login(user.email, user.password, fetch1))) {
      toast.error("Greška u prijavi: Promijenili ste lozinku!");
      return;
    }
  }
  return parser.parseFromString(await fetch1.text(), "text/html");
}

export async function login(
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
  const loginDoc = parser.parseFromString(await fetch1.text(), "text/html");
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
    body: formEncodedBody({ username: email, password, csrf_token }),
  });
  const loggedIn = !fetch2.url.includes("login");
  if (!loggedIn) return false;
  //
  // Either /class or /course
  const nextDoc = parser.parseFromString(await fetch2.text(), "text/html");
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
    const fullName = getElText(nextDoc.querySelector(".user-name"));
    store.commit(
      MutationTypes.ADD_USER,
      newUser({ email, password, fullName, classesList }),
    );
  }
  user && updateClassesTeacher(user);
  return true; // Login successful
}

export async function logout(): Promise<boolean> {
  const success = (await fetch(URLS.logout)).url.includes("login");
  if (!success) toast.error("Greška u odjavi! Pokušajte ponovo.");
  return success;
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
      name: getElText(menu.querySelector(".class > .bold")),
      year: getElText(menu.querySelector(".class-schoolyear")),
      school: getElText(menu.querySelector(".school-name")),
    };
    const [start, end] = classInfo.year.split("/");
    if (start && end) classInfo.year = "20" + start + "./20" + end + ".";
    const finalGrade = menu.querySelector(".overall-grade .bold");
    if (finalGrade) classInfo.finalGrade = parseNum(getElText(finalGrade));
    classesList.push(classInfo);
  }
  return classesList;
}

export async function updateSubjects(classInfo: ClassInfo): Promise<boolean> {
  const cache = classInfo.cache || [];
  const lastUpdated = classInfo.lastUpdated;
  const timestamp = Date.now() / 1000;
  const updateAllSubjects = !lastUpdated || timestamp - lastUpdated > 1800;
  const promises: Promise<boolean>[] = [];

  if (updateAllSubjects) {
    classInfo.lastUpdated = timestamp;

    // Default: 30 minutes; TODO: add settings
    const classDoc = await authFetch(classInfo.url);
    if (!classDoc) {
      toast.error("Greška pri dobavljanju razreda!");
      return false;
    }

    classDoc
      .querySelectorAll(".content a[href^='/grade/']")
      .forEach((anchor) => {
        promises.push(
          updateSubject({
            url: (anchor as HTMLAnchorElement).href,
            name: getElText(anchor.children[0]),
            teachers: getElText(anchor.children[1]),
          }).then((updatedSubject) => {
            if (!updatedSubject) return false;
            updatedSubject.lastUpdated = timestamp;
            store.commit(MutationTypes.UPDATE_SUBJECT, {
              classInfo,
              updatedSubject,
            });
            return true;
          }),
        );
      });
  } else {
    classInfo.cache;
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
  subject.grades = [];
  subjectDoc.querySelectorAll(".grades-table > .row").forEach((rowEl) => {
    if (rowEl.classList.contains("final-grade")) {
      const finalGrade = getElText(rowEl.lastElementChild).match(/\d/);
      if (finalGrade) subject.finalGrade = parseInt(finalGrade[0]);
      return;
    }
    const grades = [];
    for (let i = 1; i < rowEl.children.length; i++) {
      grades.push(
        (getElText(rowEl.children[i]).match(/\d/g) || []).map(Number),
      );
    }
    subject.grades?.push({
      name: getElText(rowEl.firstElementChild),
      grades,
    });
  });
  const lastNoteEl = subjectDoc.querySelector(".notes-table > .row");
  if (lastNoteEl) {
    const info = [...lastNoteEl.children].map(getElText);
    subject.lastNote = { note: info[0], date: info[1], grade: info[2] };
  }
  return subject;
}
