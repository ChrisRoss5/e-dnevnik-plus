const ADS_SOURCE_ENDPOINT = "https://e-dnevnik-plus.firebaseio.com/";
const ADS_FILE = false ? "ads-test-classic.json" : "ogl-classic.json"; // TODO before publishing: Set to false
const ADS_URL = `${ADS_SOURCE_ENDPOINT}${ADS_FILE}`;

async function initAds() {
  const schoolNameEl = document.querySelector(".school-name");
  const classYearEl = document.querySelector(".school-data .class > .bold");
  const schoolName = schoolNameEl?.textContent?.trim();
  const classYearFull = classYearEl?.textContent?.trim() ?? "-";
  const classYear = parseInt(classYearFull) || -1;
  const userType = schoolName?.toLowerCase().includes("osnovna")
    ? "osnovnoškolac"
    : "srednjoškolac";

  chrome.runtime.sendMessage({
    name: "SEND_ANALYTICS_EVENT",
    params: {
      name: "page_view",
      page_url: document.location.href,
      school_name: schoolName,
      class_year_full: classYearFull,
      class_year: classYear,
      user_type: userType,
    },
  });

  const adsHiddenKey = getAdsHiddenKey();
  chrome.storage.sync.get(
    [StorageKeys.adsClassic, adsHiddenKey],
    async (res) => {
      const ads = (res[StorageKeys.adsClassic] || []) as Ad[];
      const hiddenFloaters = (res[adsHiddenKey] || []) as string[];
      checkAndInitAds(ads, hiddenFloaters);

      const adsUpdated = ((await fetch(ADS_URL).then((res) => res.json())) ||
        []) as Ad[];
      const newAds = adsUpdated.filter((ad) => !ads.some((a) => a.id == ad.id));
      const deletedAds = ads.filter(
        (ad) => !adsUpdated.some((a) => a.id == ad.id),
      );
      for (const ad of deletedAds)
        document.querySelector("#ogl-" + ad.id)?.remove();

      chrome.storage.sync.set({ [StorageKeys.adsClassic]: adsUpdated });
      checkAndInitAds(newAds, hiddenFloaters);
    },
  );

  function checkAndInitAds(ads: Ad[], hiddenFloaters: string[]) {
    for (const ad of ads) {
      const checkUserType = !!(ad.targetUserTypes?.length && schoolName);
      const checkClassYear = !!(ad.targetClassYears?.length && classYear);
      if (
        (checkUserType && !ad.targetUserTypes!.includes(userType)) ||
        (checkClassYear && !ad.targetClassYears!.includes(classYear))
      )
        continue;
      const showFloater =
        !hiddenFloaters.includes(ad.id) &&
        (ad.showFloaterOnce || ad.showFloaterUntilClosed);
      initAd(ad, !!showFloater);
    }
  }
}

function initAd(ad: Ad, showFloater: boolean) {
  const leftMenuEl = document.querySelector("#left-menu") as HTMLElement;
  if (!leftMenuEl && window.location.href.includes("/student")) return;
  localStorage.hideMenu = "true"; // wtf e-dnevnik?
  leftMenuEl.classList.remove("hide-menu");
  leftMenuEl.classList.add("show-menu");

  // List element
  const listEl = leftMenuEl.querySelector("ul") as HTMLElement;
  const adEl1 = document.createElement("li");
  const aEl = document.createElement("a");
  const imgEl = document.createElement("img");
  adEl1.id = "ogl-" + ad.id;
  adEl1.classList.add("ogl-navbar");
  adEl1.style.backgroundColor = ad.backgroundColor;
  adEl1.appendChild(aEl).href = ad.url;
  aEl.target = "_blank";
  aEl.appendChild(imgEl).src = ad.imgListUrl;
  aEl.appendChild(document.createElement("div")).className = "shine";
  aEl.onclick = () => {
    chrome.runtime.sendMessage({
      name: "SEND_ANALYTICS_EVENT",
      params: {
        name: "click_ad",
        id: "ogl-navbar",
        ad_id: ad.id,
      },
    });
  };
  measureHover(aEl, ad);

  // Floating element
  const adEl2 = document.createElement("div");
  const imgEl2 = document.createElement("img");
  const closeBtn = document.createElement("div");
  if (ad.info) adEl2.dataset.info = ad.info;
  adEl2.classList.add("ogl-floating");
  adEl2.onclick = (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      name: "SEND_ANALYTICS_EVENT",
      params: {
        name: "click_ad",
        id: "ogl-floater",
        ad_id: ad.id,
      },
    });
  };

  if (showFloater) {
    adEl1.classList.add("new");
    adEl2.classList.add("new");
    closeBtn.textContent = "×";
    closeBtn.classList.add("close-btn");
    adEl2.append(closeBtn);
    closeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      adEl1.classList.remove("new");
      adEl2.classList.remove("new");
      adEl2.style.display = "none";
      adEl2.offsetHeight; // nosonar
      adEl2.style.display = "";
      if (ad.showFloaterUntilClosed) hideAd(ad.id);
    };
    if (!ad.showFloaterUntilClosed) hideAd(ad.id);
  }
  adEl2.appendChild(imgEl2);
  imgEl2.src = ad.imgFloaterUrl;
  aEl.append(adEl2);

  // Append to UI
  imgEl2.onload = (e) => {
    adEl2.style.setProperty("width", imgEl2.naturalWidth + "px", "important");
    adEl2.style.setProperty("height", imgEl2.naturalHeight + "px", "important");
    listEl.appendChild(adEl1);
    chrome.runtime.sendMessage({
      name: "SEND_ANALYTICS_EVENT",
      params: {
        name: "view_ad",
        id: "ogl-navbar",
        ad_id: ad.id,
      },
    });
    if (showFloater) {
      chrome.runtime.sendMessage({
        name: "SEND_ANALYTICS_EVENT",
        params: {
          name: "view_ad",
          id: "ogl-floater",
          ad_id: ad.id,
          event: ad.showFloaterUntilClosed ? "until_closed" : "once",
        },
      });
    }
  };
}

function hideAd(id: string) {
  const adsHiddenKey = getAdsHiddenKey();
  chrome.storage.sync.get(adsHiddenKey, (res) => {
    const hiddenFloaters = res[adsHiddenKey] || [];
    chrome.storage.sync.set({
      [adsHiddenKey]: [...hiddenFloaters, id],
    });
  });
}

function measureHover(el: HTMLElement, ad: Ad) {
  let timeout: number;
  el.onmouseenter = () => {
    timeout = window.setTimeout(() => {
      chrome.runtime.sendMessage({
        name: "SEND_ANALYTICS_EVENT",
        params: {
          name: "view_ad",
          id: "ogl-floater",
          ad_id: ad.id,
          event: "hover",
        },
      });
    }, 500);
  };
  el.onmouseleave = () => {
    window.clearTimeout(timeout);
  };
}

function getAdsHiddenKey() {
  return StorageKeys.adsClassicHiddenFloaters + getUserFullName();
}
