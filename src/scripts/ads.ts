import $emitter from "@/main";
import { store } from "@/store";
import { MutationTypes } from "@/store/mutations";
import {
  Ad,
  GradesByCategory,
  SubjectCache,
  User,
  UserType,
} from "@/store/state";
import { authFetch } from "./scrapers/auth";
import { shuffleArray } from "./utils";

export default async function getAds(): Promise<void> {
  const adsFile = window.devTestMode ? "ads-test.json" : "ads.json";
  const url = "https://e-dnevnik-plus.firebaseio.com/" + "ads-test.json"; // todo!
  const user = store.getters.user as User;
  const latestClass = user.classesList[0];
  const schoolName = latestClass.school?.toLowerCase() || "-";
  const classYear = parseInt(latestClass.name);
  const userType: UserType = schoolName.includes("osnovna")
    ? "osnovnoškolac"
    : "srednjoškolac";
  const finalGradeLastClass =
    user.classesList.length >= 2
      ? parseFloat(user.classesList[1].finalGrade?.replace(",", ".") || "0")
      : 0;

  /* const subjects = latestClass.cachedSubjects!;
  console.log(latestClass);
  subjects.forEach((subject) =>
    console.log(subject.name + ": " + getSubjectAvg(subject.gradesByCategory!)),
  );
  console.log(getFinalAvg(subjects)); */

  window.gtag("event", "request", {
    event_category: "user auth type",
    event_label: userType,
    value: classYear,
    schoolName,
  });
  let ads = ((await fetch(url).then((res) => res.json())) || []) as Ad[];

  console.log("userType: " + userType + ", classYear: " + classYear);
  console.log("finalGradeLastClass: " + finalGradeLastClass);
  console.log("schoolName: " + schoolName);
  ads = ads.filter((ad) => {
    if (
      ad.goalComplete ||
      (ad.targetUserTypes && !ad.targetUserTypes.includes(userType)) ||
      (ad.targetClassYears && !ad.targetClassYears.includes(classYear)) ||
      (ad.targetSchoolNames &&
        !ad.targetSchoolNames.some((name) => schoolName.includes(name))) ||
      ((ad.targetMinGradePrevClass || ad.targetMaxGradePrevClass) &&
        (!finalGradeLastClass ||
          (ad.targetMinGradePrevClass || 0) > finalGradeLastClass ||
          (ad.targetMaxGradePrevClass || 5) < finalGradeLastClass))
    )
      return false;
    if (ad.targetMinGradeCurrClass || ad.targetMaxGradeCurrClass) {
      if (!latestClass.cachedSubjects) return false;
      const avg = getFinalAvg(latestClass.cachedSubjects);
      console.log("final avg", avg);
      if (
        (ad.targetMinGradeCurrClass || 0) > avg ||
        (ad.targetMaxGradeCurrClass || 5) < avg
      )
        return false;
    }
    if (ad.targetSubjectGrades) {
      const targetedSubject = latestClass.cachedSubjects?.find((subject) =>
        subject.name.toLowerCase().includes(ad.targetSubjectGrades!.name),
      );
      if (!targetedSubject?.gradesByCategory) return false;
      const avg = getSubjectAvg(targetedSubject.gradesByCategory);
      console.log("subject avg", avg);
      if (
        (ad.targetSubjectGrades?.minGrade || 0) > avg ||
        (ad.targetSubjectGrades?.maxGrade || 5) < avg
      )
        return false;
    }
    return true;
  });
  if (ads.some((ad) => ad.targetSchoolPrograms)) {
    const schoolProgram = await getSchoolProgram();
    console.log("school program", schoolProgram);
    ads = ads.filter(
      (ad) =>
        !ad.targetSchoolPrograms ||
        ad.targetSchoolPrograms.some((program) =>
          schoolProgram.includes(program),
        ),
    );
  }
  ads.splice(2); // just in case
  ads.length ? showAds(user, ads) : removeAds();
}

async function getSchoolProgram(): Promise<string> {
  const url = "https://ocjene.skole.hr/personal_data";
  const doc = await authFetch(url);
  if (!doc) return adError("/personal_data failed to load");
  const programLabelKeyEl = [
    ...doc.querySelectorAll(".column.bold.t-right"),
  ].find((el) => el.textContent?.trim().toLowerCase() == "program");
  if (!programLabelKeyEl) return adError("school program label not found");
  const program = programLabelKeyEl.nextElementSibling!.textContent?.trim();
  if (!program) return adError("school program label empty");
  return program.toLowerCase() || "";
}

function showAds(user: User, ads: Ad[]) {
  $emitter.emit("show-banners", ads);
  if (!window.devTestMode) chrome.storage.sync.set({ ads });
  for (const ad of ads) {
    window.gtag("event", "ad", {
      event_category: "banner",
      event_label: ad.id,
      value: "saved",
    });
  }
  if (!user.adsShown) user.adsShown = [];
  for (const ad of shuffleArray(ads)) {
    if (user.adsShown.includes(ad.id) || !ad.showPopup) continue;
    $emitter.emit("show-popup", ad);
    store.commit(MutationTypes.UPDATE_USER_ADS, {
      user,
      adsShown: [...user.adsShown, ad.id],
    });
    window.gtag("event", "ad", {
      event_category: "popup",
      value: "displayed",
    });
    break;
  }
}

function removeAds() {
  $emitter.emit("show-banners", []);
  chrome.storage.sync.remove("ads");
}

function getSubjectGradesCount(g?: GradesByCategory[]) {
  return (g || []).reduce((a, row) => a + row.grades.flat().length, 0);
}

function getSubjectAvg(g: GradesByCategory[]) {
  return (
    g.reduce(
      (a, row) => a + row.grades.flat().reduce((b, grade) => b + grade, 0),
      0,
    ) / getSubjectGradesCount(g)
  );
}

function getFinalAvg(subjects: SubjectCache[]) {
  const subjectsWithGrades = subjects.filter(
    (subject) => getSubjectGradesCount(subject.gradesByCategory) > 0,
  );
  return (
    subjectsWithGrades.reduce((a, subject) => {
      const avg = getSubjectAvg(subject.gradesByCategory!);
      return a + (subject.finalGrade || Math.round(avg));
    }, 0) / subjectsWithGrades.length
  );
}

function adError(label: string) {
  window.gtag("event", "error", {
    event_category: "ads",
    event_label: label,
  });
  return "";
}
