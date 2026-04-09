import $emitter from "@/main";
import { store } from "@/store";
import { MutationTypes } from "@/store/mutations";
import { Ad, SubjectCache, User, UserType } from "@/store/state";
import { authFetch } from "./scrapers/auth";
import { shuffleArray } from "./utils";

export default async function getAds(): Promise<void> {
  const adsFile = window.devTestMode ? "ads-app-test.json" : "ads-app.json";
  const url = "https://e-dnevnik-plus.firebaseio.com/" + adsFile;
  const user = store.getters.user as User | undefined;
  if (!user) return;
  const latestClass = user.classesList[0];
  const schoolName = (latestClass.school || "-")
    .replaceAll(";", ",")
    .toLowerCase();
  const classYear = parseInt(latestClass.name) || -1;
  const userType: UserType = schoolName.includes("osnovna")
    ? "osnovnoškolac"
    : "srednjoškolac";
  const finalGradePrevClass =
    user.classesList.length >= 2
      ? parseFloat(user.classesList[1].finalGrade?.replace(",", ".") || "-1")
      : -1;
  const cachedSubjects = latestClass.cachedSubjects || [];
  const finalGradeCurrClass = getFinalAvg(cachedSubjects) || -1;
  const subjectAvgs = {} as Record<string, number>;
  const subjectNames = [
    "matematika",
    "hrvatski",
    "engleski",
    "fizika",
    "kemija",
    "biologija",
    "informatika",
  ];
  for (const subjectName of subjectNames) {
    const subject = findSubject(cachedSubjects, subjectName);
    subjectAvgs[subjectName] = subject ? getSubjectAvg(subject) : -1;
  }

  window.analyticsInfo = {
    schoolName: latestClass.school || "-",
    classYearFull: latestClass.name,
    classYear,
    userType,
  };

  let ads = ((await fetch(url).then((res) => res.json())) || []) as Ad[];
  if ((ads as any).fallback)
    ads = await fetch((ads as any).fallback).then((res) => res.json() || []);
  ads = ads.filter((ad) => {
    if (
      ad.goalComplete ||
      (ad.targetUserTypes && !ad.targetUserTypes.includes(userType)) ||
      (ad.targetClassYears && !ad.targetClassYears.includes(classYear)) ||
      (ad.targetSchoolNames &&
        !ad.targetSchoolNames.some((name) => schoolName.includes(name))) ||
      ((ad.targetMinGradePrevClass || ad.targetMaxGradePrevClass) &&
        (finalGradePrevClass == -1 ||
          (ad.targetMinGradePrevClass || 0) > finalGradePrevClass ||
          (ad.targetMaxGradePrevClass || 5) < finalGradePrevClass)) ||
      ((ad.targetMinGradeCurrClass || ad.targetMaxGradeCurrClass) &&
        (finalGradeCurrClass == -1 ||
          (ad.targetMinGradeCurrClass || 0) > finalGradeCurrClass ||
          (ad.targetMaxGradeCurrClass || 5) < finalGradeCurrClass))
    )
      return false;
    if (ad.targetSubjectGrades) {
      const subjectName = ad.targetSubjectGrades.name;
      let avg = subjectAvgs[subjectName];
      if (avg == -1) return false;
      if (!avg) {
        const subject = findSubject(cachedSubjects, subjectName);
        avg = subject ? getSubjectAvg(subject) : -1;
      }
      if (
        avg == -1 ||
        (ad.targetSubjectGrades?.minGrade || 0) > avg ||
        (ad.targetSubjectGrades?.maxGrade || 5) < avg
      )
        return false;
    }
    return true;
  });
  if (ads.some((ad) => ad.targetSchoolPrograms) && !window.devTestMode) {
    const schoolProgram = await getSchoolProgram();
    ads = ads.filter(
      (ad) =>
        !ad.targetSchoolPrograms ||
        ad.targetSchoolPrograms.some((program) =>
          schoolProgram.includes(program),
        ),
    );
  }
  ads = spreadAds(shuffleArray(ads));
  ads.length ? showAds(user, ads) : removeAds();
}
function spreadAds(ads: Ad[]) {
  for (let i = ads.length - 1; i > -1; i--) {
    for (const key in ads[i])
      if (key.startsWith("target")) delete ads[i][key as keyof Ad];
    const banners = ads[i].images.banner as string | string[] | undefined;
    if (!banners || typeof banners == "string") continue;
    const _ads = banners.map((banner) => {
      return { ...ads[i], images: { ...ads[i].images, banner } };
    });
    ads.splice(i, 1, ..._ads);
  }
  return ads;
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
  const withBanner = ads.filter((ad) => ad.images.banner);
  $emitter.emit("show-banners", withBanner);
  if (!window.devTestMode) chrome.storage.sync.set({ ads: withBanner });
  if (!user.adsShown) user.adsShown = [];
  for (const ad of ads) {
    if (user.adsShown.includes(ad.id) || !ad.showPopup) continue;
    $emitter.emit("show-popup", ad);
    store.commit(MutationTypes.UPDATE_USER_ADS, {
      user,
      adsShown: [...user.adsShown, ad.id],
    });
    chrome.runtime.sendMessage({
      name: "SEND_ANALYTICS_EVENT",
      params: {
        name: "view_ad",
        id: "ad-popup",
        ad_id: ad.id,
      },
    });
    break;
  }
}
function removeAds() {
  $emitter.emit("show-banners", []);
  if (!window.devTestMode) chrome.storage.sync.remove("ads");
}
function findSubject(subjects: SubjectCache[], subjectName: string) {
  subjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(subjectName),
  );
  return subjects.length
    ? subjects.reduce((a, b) => (a.name.length <= b.name.length ? a : b))
    : null;
}
function getFinalAvg(subjects: SubjectCache[]) {
  const subjectsWithGrades = subjects.filter(
    (subject) => getSubjectGradesCount(subject) > 0,
  );
  return (
    subjectsWithGrades.reduce((a, subject) => {
      const avg = getSubjectAvg(subject);
      return a + (subject.finalGrade || Math.round(avg));
    }, 0) / subjectsWithGrades.length
  );
}
function getSubjectAvg(subject: SubjectCache) {
  if (!subject.gradesByCategory) return -1;
  return (
    subject.gradesByCategory.reduce(
      (a, row) => a + row.grades.flat().reduce((b, grade) => b + grade, 0),
      0,
    ) / getSubjectGradesCount(subject)
  );
}
function getSubjectGradesCount(subject: SubjectCache) {
  return (subject.gradesByCategory || []).reduce(
    (a, row) => a + row.grades.flat().length,
    0,
  );
}
function adError(label: string) {
  // removed gtag
  return "";
}
