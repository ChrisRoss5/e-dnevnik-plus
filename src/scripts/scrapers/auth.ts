import { store } from "@/store";
import { MutationTypes } from "@/store/mutations";
import { User } from "@/store/state";
import { TYPE, useToast } from "vue-toastification";
import { ToastOptions } from "vue-toastification/dist/types/types";
import newUser from "../new-user";
import * as UTILS from "../utils";
import { getClassesList, updateClassesList } from "./scrapers";

const toast = useToast();
const URLS = {
  base: "https://ocjene.skole.hr",
  login: "https://ocjene.skole.hr/login",
  logout: "https://ocjene.skole.hr/logout",
  classes: "https://ocjene.skole.hr/class",
  exams: "https://ocjene.skole.hr/exam",
  schoolList: "https://ocjene.skole.hr/school",
  classNews: "https://ocjene.skole.hr/grade/new",
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
    user.password = password;
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
  await updateClassesList();
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

function toastError(
  reason: string,
  config?: ToastOptions & { type?: TYPE.ERROR },
): void {
  toast.error(reason, config);
  window.gtag("event", "error", {
    event_category: "scrapers",
    event_label: reason,
  });
}

export { URLS, login, logout, authFetch, toastError };

