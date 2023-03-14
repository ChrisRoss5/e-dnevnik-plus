import $emitter from "@/main";
import { store } from "@/store";
import { MutationTypes } from "@/store/mutations";
import { Ad, User, UserType } from "@/store/state";
import { authFetch } from "./scrapers/auth";
import { shuffleArray } from "./utils";

export default async function getAds(): Promise<void> {
  const adsFile = window.devTestMode ? "ads-test.json" : "ads.json";
  const url = "https://e-dnevnik-plus.firebaseio.com/" + adsFile;
  const user = store.getters.user as User;
  const schoolName = user.classesList[0].school?.toLowerCase() || "-";
  const userYear = parseInt(user.classesList[0].name);
  const userType: UserType = schoolName.includes("osnovna")
    ? "osnovnoškolac"
    : "srednjoškolac";
  const userFinalGradeLastClass =
    user.classesList.length >= 2
      ? parseFloat(user.classesList[1].finalGrade?.replace(",", ".") || "9")
      : 9;
  window.gtag("event", "request", {
    event_category: "user auth type",
    event_label: userType,
    value: userYear,
    schoolName,
  });
  let ads = ((await fetch(url).then((res) => res.json())) || []) as Ad[];
  ads = ads.filter(
    (ad) =>
      !ad.goalComplete &&
      (!ad.targetUserTypes || ad.targetUserTypes.includes(userType)) &&
      (!ad.targetClassYears || ad.targetClassYears.includes(userYear)) &&
      (!ad.targetMinGradeLastClass ||
        ad.targetMinGradeLastClass <= userFinalGradeLastClass) &&
      (!ad.targetMaxGradeLastClass ||
        ad.targetMaxGradeLastClass >= userFinalGradeLastClass) &&
      (!ad.targetSchoolNames || ad.targetSchoolNames.includes(schoolName)),
  );
  if (ads.some((ad) => ad.targetSchoolPrograms?.length)) {
    const schoolProgram = await getSchoolProgram();
    ads = ads.filter(
      (ad) =>
        !ad.targetSchoolPrograms!.length ||
        ad.targetSchoolPrograms!.includes(schoolProgram),
    );
  }
  if (ads.length == 0) {
    $emitter.emit("show-banners", []);
    chrome.storage.sync.remove("ads");
    return;
  }
  ads.splice(2);
  if (!window.devTestMode) chrome.storage.sync.set({ ads });
  revealAds(user, ads);
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
  return program.toLocaleLowerCase() || "";
}

function revealAds(user: User, ads: Ad[]) {
  $emitter.emit("show-banners", ads);
  user.adsShown ||= [];
  for (const ad of shuffleArray(ads)) {
    window.gtag("event", "ad", {
      event_category: "banner",
      event_label: ad.id,
      value: "saved",
    });
    if (user.adsShown.includes(ad.id) || !ad.showPopup) continue;
    $emitter.emit("show-popup", ad);
    store.commit(MutationTypes.UPDATE_USER_ADS, {
      user,
      adsShown: [...user.adsShown, ad.id],
    });
    window.gtag("event", "ad", {
      event_category: "popup",
      event_label: ad.id,
      value: "displayed",
    });
    break;
  }
}

function adError(label: string) {
  window.gtag("event", "error", {
    event_category: "ads",
    event_label: label,
  });
  return "";
}
