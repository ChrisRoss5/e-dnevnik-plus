import { MutationTypes } from "@/store/mutations";
import { User, ClassInfo } from "@/store/state";
import { store } from "@/store";
import { useToast } from "vue-toastification";
import newUser from "./new-user";

const toast = useToast();
const parser = new DOMParser();
const urls = {
  login: "https://ocjene.skole.hr/login",
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

async function authFetch(url: string): Promise<undefined | Document> {
  const fetch1 = await fetch(url);
  if (fetch1.url.includes("login")) {
    const user = store.getters.user as User | undefined;
    if (!user) return;
    const loggedIn = await login(user.email, user.password, fetch1);
    if (!loggedIn) {
      toast.error("Greška u prijavi: Promijenili ste lozinku!");
      return;
    }
  }
  const page = await fetch1.text();
  return parser.parseFromString(page, "text/html");
}

export async function login(
  email: string,
  password: string,
  fetch1?: Response,
): Promise<boolean> {
  // Login GET
  fetch1 = fetch1 || (await fetch(urls.login));
  if (!fetch1.url.includes("login")) return true; // User is already signed in
  const loginPage = await fetch1.text();
  const loginDoc = parser.parseFromString(loginPage, "text/html");
  const csrfElement = loginDoc.getElementsByName("csrf_token")[0];
  if (!csrfElement) {
    toast.error("Greška u prijavi: Nedostaje CSRF token!");
    return false;
  }
  const csrf_token = (csrfElement as HTMLInputElement).value;

  // Login POST
  const fetch2 = await fetch(urls.login, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formEncodedBody({ email, password, csrf_token }),
  });
  const loggedIn = !fetch2.url.includes("login");
  if (!loggedIn) return false;
  const nextPage = await fetch2.text(); // Either /class or /course
  const fullName = getElText(
    parser.parseFromString(nextPage, "text/html").querySelector(".user-name"),
  );
  const user = store.state.users.find((u) => u.email == email);
  if (user) {
    user.signedIn = true;
    //store.commit(MutationTypes.SET_USER_SIGNIN, true);
  } else {
    // NEW USER
    const classesList = await getClassesList();
    if (!classesList) {
      toast.error("Greška u prijavi: Popis razreda je nedostupan!");
      return false;
    }
    store.commit(
      MutationTypes.ADD_USER,
      newUser({ email, password, fullName, classesList }),
    );
  }
  return true;
}

export async function getClassesList(): Promise<ClassInfo[] | undefined> {
  const classesDoc = await authFetch(urls.classes);
  if (!classesDoc) return;
  const classMenus = classesDoc.getElementsByClassName("class-menu-vertical");
  const classesInfo = [] as ClassInfo[];
  for (const menu of classMenus) {
    const classInfo: ClassInfo = {
      url: (menu.querySelector(".school") as HTMLAnchorElement).href,
      name: getElText(menu.querySelector(".class > .bold")),
      year: getElText(menu.querySelector(".class-schoolyear")),
      school: getElText(menu.querySelector(".school-name")),
    };
    let finalGrade = menu.querySelector(".overall-grade");
    finalGrade = finalGrade && finalGrade.querySelector(".bold");
    if (finalGrade) classInfo.finalGrade = parseNum(getElText(finalGrade));
    classesInfo.push(classInfo);
  }
  return classesInfo;
}

export async function getSubjects() {
  return "hi";
}
