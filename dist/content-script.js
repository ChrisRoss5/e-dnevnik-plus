"use strict";
/* { matches: ["*://ocjene.skole.hr/*"], run_at: "document_start" } */
// This will prevent possible flicker when redirecting to App URL
chrome.runtime.sendMessage({ name: "GET_ACTIVE_RULES" }, (ids) => {
    if (ids.length)
        window.stop();
});
window.addEventListener("error", (event) => {
    chrome.runtime.sendMessage({
        name: "SEND_ANALYTICS_EVENT",
        params: {
            name: "error",
            error: event.error,
        },
    });
});
window.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll("a[href*='logout']")
        .forEach((el) => (el.onclick = onLogout));
    const { href } = window.location;
    if (href.includes("/login"))
        return autoLogin();
    initAds();
    if (href.includes("/grade"))
        return customizeSubject();
    if (href.includes("/course"))
        customizeSubjectList();
});
function getUserFullName() {
    const fullNameEl = document.querySelector(".user-name");
    return fullNameEl?.textContent?.trim() || "";
}
const ADS_SOURCE_ENDPOINT = "https://e-dnevnik-plus.firebaseio.com/";
const ADS_FILE = true ? "ads-test-classic.json" : "ogl-classic.json"; // TODO before publishing: Set to false
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
    chrome.storage.sync.get([StorageKeys.adsClassic, adsHiddenKey], async (res) => {
        const ads = (res[StorageKeys.adsClassic] || []);
        const hiddenFloaters = (res[adsHiddenKey] || []);
        checkAndInitAds(ads, hiddenFloaters);
        const adsUpdated = ((await fetch(ADS_URL).then((res) => res.json())) ||
            []);
        const newAds = adsUpdated.filter((ad) => !ads.some((a) => a.id == ad.id));
        const deletedAds = ads.filter((ad) => !adsUpdated.some((a) => a.id == ad.id));
        for (const ad of deletedAds)
            document.querySelector("#ogl-" + ad.id)?.remove();
        chrome.storage.sync.set({ [StorageKeys.adsClassic]: adsUpdated });
        checkAndInitAds(newAds, hiddenFloaters);
    });
    function checkAndInitAds(ads, hiddenFloaters) {
        for (const ad of ads) {
            const checkUserType = !!(ad.targetUserTypes?.length && schoolName);
            const checkClassYear = !!(ad.targetClassYears?.length && classYear);
            if ((checkUserType && !ad.targetUserTypes.includes(userType)) ||
                (checkClassYear && !ad.targetClassYears.includes(classYear)))
                continue;
            const showFloater = !hiddenFloaters.includes(ad.id) &&
                (ad.showFloaterOnce || ad.showFloaterUntilClosed);
            initAd(ad, !!showFloater);
        }
    }
}
function initAd(ad, showFloater) {
    const leftMenuEl = document.querySelector("#left-menu");
    if (!leftMenuEl && window.location.href.includes("/student"))
        return;
    localStorage.hideMenu = "true"; // wtf e-dnevnik?
    leftMenuEl.classList.remove("hide-menu");
    leftMenuEl.classList.add("show-menu");
    // List element
    const listEl = leftMenuEl.querySelector("ul");
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
    if (ad.info)
        adEl2.dataset.info = ad.info;
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
            if (ad.showFloaterUntilClosed)
                hideAd(ad.id);
        };
        if (!ad.showFloaterUntilClosed)
            hideAd(ad.id);
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
                    event: ad.showFloaterOnce ? "once" : "until_closed",
                },
            });
        }
    };
}
function hideAd(id) {
    const adsHiddenKey = getAdsHiddenKey();
    chrome.storage.sync.get(adsHiddenKey, (res) => {
        const hiddenFloaters = res[adsHiddenKey] || [];
        chrome.storage.sync.set({
            [adsHiddenKey]: [...hiddenFloaters, id],
        });
    });
}
function measureHover(el, ad) {
    let timeout;
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
const plusColor = "#2296da"; // ALL PAGE MODIFICATIONS
let logoutCleared = false;
function onLogout(e) {
    if (logoutCleared)
        return;
    else
        e.preventDefault();
    chrome.storage.sync.remove(StorageKeys.login, () => {
        logoutCleared = true;
        e.target.click();
    });
}
function autoLogin() {
    const usernameEl = document.querySelector("input[name='username']");
    const passwordEl = document.querySelector("input[name='password']");
    const loginBtn = document.querySelector("input[type='submit']");
    // Autologin
    chrome.storage.sync.get(StorageKeys.login, (res) => {
        if (document.querySelector(".alert-error") || !res.login) {
            const wrapper = document.querySelector("#page-wrapper");
            wrapper.style.setProperty("display", "block", "important");
            return;
        }
        usernameEl.value = res.login.username;
        passwordEl.value = res.login.password;
        loginBtn.click();
    });
    // Checkbox
    const cbx = document.createElement("div");
    cbx.style.color = plusColor;
    cbx.style.padding = "10px 0";
    cbx.innerHTML = /* html */ `
    <span style="font-size: 14px">Ostani prijavljen:</span>
    <label class="check" style="float: right; transform: translateY(-8px)">
      <input type="checkbox" class="checkbox" id="cbx" style="display: none;">
      <svg width="23px" height="23px" viewBox="0 0 18 18">
        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
        <polyline points="1 9 7 14 15 4"></polyline>
      </svg>
    </label>`;
    loginBtn.parentElement.insertBefore(cbx, loginBtn);
    let loginSet = false;
    loginBtn.onclick = async (e) => {
        if (loginSet)
            return;
        if (document.querySelector("#cbx").checked) {
            e.preventDefault();
            const login = {
                username: usernameEl.value.trim(),
                password: passwordEl.value,
            };
            const userId = await getSHA256Hash(login.username.replace(/@.*/, ""));
            chrome.storage.sync.set({ [StorageKeys.login]: login, [StorageKeys.userId]: userId }, () => {
                loginSet = true;
                loginBtn.click();
            });
        }
    };
}
function customizeSubject() {
    if (document.querySelector(".multiple-grades"))
        return console.error("e-Dnevnik Plus ne podržava uređivanje ocjena na mobilnim uređajima.");
    const cellsNL = document.querySelectorAll(".grade.cell");
    const cells = [...cellsNL];
    const avgEl = document.querySelector(".numbered-average");
    avgEl.dataset.originalValue = avgEl.textContent;
    avgEl.addEventListener("click", resetAll);
    for (const cell of cells) {
        cell.contentEditable = "true";
        cell.dataset.originalValue = getValues(cell).join(", ");
        cell.addEventListener("input", () => handleInputUpdate(cell));
        cell.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            cell.textContent = cell.dataset.originalValue;
            handleInputUpdate(cell);
        });
    }
    function updateAverage() {
        const grades = cells.flatMap((cell) => cell.classList.contains("invalid") ? [] : getValues(cell));
        const avg = getAverageFromArray(grades);
        avgEl.textContent = avg;
        addClass(avgEl, "edited", avg != avgEl.dataset.originalValue);
    }
    function handleInputUpdate(cell) {
        const values = getValues(cell);
        const isInvalid = values.some((v) => !v || v < 1 || v > 5);
        addClass(cell, "invalid", isInvalid);
        addClass(cell, "edited", values.join(", ") != cell.dataset.originalValue);
        updateAverage();
    }
    function getValues(cell) {
        const split = cell.textContent.split(",").map((s) => s.trim());
        return split.filter(Boolean).map(Number);
    }
    function resetAll() {
        for (const cell of cells) {
            cell.textContent = cell.dataset.originalValue;
            cell.classList.remove("edited", "invalid");
        }
        updateAverage();
    }
}
function customizeSubjectList() {
    const menu = document.querySelector(".grades-menu");
    const avgElsNL = document.querySelectorAll(".list-average-grade");
    const avgEls = [...avgElsNL];
    const finalAverageEl = document.createElement("div");
    finalAverageEl.classList.add("button", "editable-avg", "final-avg");
    finalAverageEl.addEventListener("click", resetAll);
    const key = StorageKeys.firstTimeClassicVisitor + getUserFullName();
    chrome.storage.sync.get(key, (res) => {
        if (res[key])
            return;
        finalAverageEl.classList.add("jumping");
        finalAverageEl.addEventListener("mouseenter", () => {
            finalAverageEl.classList.remove("jumping");
            chrome.storage.sync.set({ [key]: true });
        }, { once: true });
    });
    const finalAverageValueEl = document.createElement("span");
    finalAverageValueEl.style.paddingLeft = "0.5rem";
    finalAverageValueEl.style.cursor = "help";
    const helpEl = document.createElement("sup");
    helpEl.style.paddingBottom = "0.5rem";
    helpEl.textContent = "?";
    finalAverageEl.append("Završna ocjena:", finalAverageValueEl, helpEl);
    finalAverageEl.dataset.title =
        "Prosjek zaokruženih prosjeka. Neispravno uneseni prosjeci ne ulaze u izračun.\n" +
            "Tip: Klik ovdje za poništavanje svih izmjena.\n" +
            "Tip: Skrolaj iznad predmetnog prosjeka za povećanje/smanjenje ocjene.\n" +
            "Tip: Desni klik na predmetni prosjek za poništavanje izmjene.\n\n" +
            "U svakom predmetu možeš uređivati i dodavati ocjene te će se prosjek ažurirati.\n" +
            "Tip: Klik na prosjek za poništavanje svih izmjena u predmetu.\n" +
            "Tip: Desni klik na ćeliju za poništavanje izmjena u ćeliji.\n" +
            "Važno: Neispravna ćelija ima crveni okvir i ne ulazi u izračun prosjeka.\n\n" +
            "Sretno s planiranjem! - Proširenje e-Dnevnik Plus.";
    menu.prepend(finalAverageEl);
    for (const el of avgEls) {
        el.closest("a").draggable = false;
        el.classList.add("editable-avg");
        const child = el.firstElementChild;
        el.style.backgroundColor = getComputedStyle(child).backgroundColor;
        el.innerHTML = el.textContent?.replace(",", ".") ?? "";
        el.contentEditable = "true";
        el.dataset.originalValue = el.textContent ? getValue(el) + "" : "";
        el.addEventListener("click", (e) => e.preventDefault());
        el.addEventListener("input", (e) => {
            el.textContent = e.data;
            handleInputUpdate(el);
        });
        el.addEventListener("wheel", (e) => {
            e.preventDefault();
            const value = Math.round(getValue(el));
            const newValue = e.deltaY < 0 ? value + 1 : value - 1;
            el.textContent = Math.max(1, Math.min(newValue, 5)) + "";
            handleInputUpdate(el);
        });
        el.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            el.textContent = el.dataset.originalValue;
            handleInputUpdate(el);
        });
    }
    updateFinalAverage();
    function updateFinalAverage() {
        const avgs = avgEls.flatMap((el) => el.classList.contains("invalid") ? [] : Math.round(getValue(el)));
        const finalAvg = getAverageFromArray(avgs);
        finalAverageValueEl.textContent = finalAvg;
        const { originalValue } = finalAverageEl.dataset;
        if (originalValue === undefined)
            finalAverageEl.dataset.originalValue = finalAvg;
        else
            addClass(finalAverageEl, "edited", finalAvg != originalValue);
    }
    function resetAll() {
        for (const el of avgEls) {
            el.textContent = el.dataset.originalValue;
            el.classList.remove("edited", "invalid");
        }
        updateFinalAverage();
    }
    function handleInputUpdate(el) {
        const value = getValue(el);
        addClass(el, "invalid", !value || value < 1 || value > 5);
        addClass(el, "edited", value != parseFloat(el.dataset.originalValue));
        updateFinalAverage();
    }
    function getValue(el) {
        return parseFloat(el.textContent.replace(",", "."));
    }
}
var StorageKeys;
(function (StorageKeys) {
    StorageKeys["userId"] = "userId";
    StorageKeys["login"] = "login";
    StorageKeys["adsClassic"] = "ads-classic";
    StorageKeys["adsClassicHiddenFloaters"] = "ads-classic-hidden-floaters";
    StorageKeys["firstTimeClassicVisitor"] = "first-time-classic-visitor";
})(StorageKeys || (StorageKeys = {}));
function getAverageFromArray(arr) {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return avg ? avg.toFixed(2) : "—";
}
function addClass(el, className, condition) {
    condition ? el.classList.add(className) : el.classList.remove(className);
}
const getSHA256Hash = async (input) => {
    const textAsBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
    return hash;
};
