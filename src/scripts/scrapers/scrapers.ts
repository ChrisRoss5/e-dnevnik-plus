import { store } from "@/store";
import { MutationTypes } from "@/store/mutations";
import { ClassInfo, ClassNews, SubjectCache, User } from "@/store/state";
import { CalendarExam, CalendarYear } from "@/views/calendar/interface";
import getAds from "../ads";
import * as UTILS from "../utils";
import { authFetch, toastError, URLS } from "./auth";

async function updateClassesList(): Promise<void> {
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

    // Default: 30 minutes; TODO?: add settings
    const classDoc = await authFetch(classInfo.url);
    if (!classDoc) {
      toastError("Greška pri dobavljanju razreda!");
      return false;
    }
    if (classDoc.querySelector("a[href*='grade/new']")) await updateClassNews();

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
  if (window.isNewUser) {
    window.isNewUser = false;
    getAds();
  }
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
    subject.gradesByCategory!.push({
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
  elQuery = ".content",
): Promise<{ content: Element; styleURL: string } | false> {
  if (window.devTestMode || (await switchClassIfNeeded(classId))) return false;
  const doc = await authFetch(sectionUrl);
  if (!doc) {
    toastError("Greška pri dobavljanju stranice razreda!");
    return false;
  }
  const link = doc.querySelector("link[rel='stylesheet']");
  return {
    content: doc.querySelector(elQuery)!,
    styleURL: (link as HTMLLinkElement).href,
  };
}

async function getExams(classId: string): Promise<false | CalendarExam[]> {
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

async function updateClassNews(): Promise<void | false> {
  const user = store.getters.user as User;
  const doc = await authFetch(URLS.classNews);
  if (!doc) {
    toastError("Greška pri dobavljanju novih razrednih zapisa!");
    return false;
  }
  const subjects = [...doc.querySelectorAll(".new-grades-table")];
  const classNews: ClassNews[] = subjects.map((subject) => {
    const rows = [...subject.querySelectorAll(".flex-table.row")];
    return {
      subjectName: UTILS.getElText(subject.firstElementChild),
      subjectNews: rows.map((row) => {
        const { children } = row;
        const date = "[" + UTILS.getElText(children[0]) + "] ";
        const note = date + UTILS.getElText(children[1]);
        const grade = UTILS.getElText(children[children.length - 1]);
        return { note, grade: grade ? parseInt(grade) : null };
      }),
    };
  });
  store.commit(MutationTypes.UPDATE_CLASS_NEWS, { user, classNews });
}

export {
  updateClassesList,
  getClassesList,
  updateSubjects,
  getOriginalSectionPage,
  getExams,
  getCalendarDates,
  getAboutPage,
};
