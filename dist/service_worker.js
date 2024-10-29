"use strict";
/*

cd extension_scripts
tsc -w

*/
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onMessage.addListener(onMessage);
async function onInstalled(details) {
    if (details.reason == "install") {
        chrome.storage.sync.clear();
        chrome.storage.local.clear();
        chrome.tabs.create({ url: "https://ednevnik.plus/#instaliran" });
        return;
    }
    if (details.reason == "update") {
        const previousVersion = details.previousVersion;
        // const newVersion: string = chrome.runtime.getManifest().version;
        if (cmpVersions(previousVersion, "5.0") < 0) {
            chrome.storage.sync.clear();
            chrome.storage.local.clear();
            chrome.tabs.create({ url: "https://ednevnik.plus/#azuriran" });
            return;
        }
        if (previousVersion == "5.0")
            await update501();
        if (["5.0", "5.0.1"].includes(previousVersion))
            await update502();
        if (cmpVersions(previousVersion, "5.1") < 0) {
            await update51();
            chrome.storage.sync.get("appEnabled", (state) => {
                if (!state.appEnabled)
                    return;
                chrome.declarativeNetRequest.updateEnabledRulesets({
                    enableRulesetIds: ["ruleset"],
                });
            });
        }
    }
}
async function update501() {
    chrome.storage.sync.set({ newUpdates: true, updateNotif: true });
    return new Promise((resolve) => {
        chrome.storage.local.get(null, (state) => {
            if (!state || !state.users)
                return resolve();
            state.users.forEach((user) => {
                const subjectsSettings = user.settings.subjectsSettings;
                const showColors = subjectsSettings.subjectColors;
                delete subjectsSettings.subjectColors;
                user.settings.subjectsSettings = {
                    ...subjectsSettings,
                    subjectLineColors: showColors,
                    subjectColumnColors: showColors,
                };
            });
            chrome.storage.local.set(state, resolve);
        });
    });
}
function update502() {
    chrome.storage.sync.set({ newUpdates: true, updateNotif: true });
    return new Promise((resolve) => {
        chrome.storage.local.get(null, (state) => {
            if (!state || !state.users)
                return resolve();
            state.users.forEach((user) => {
                user.settings.websitesSettings = user.settings.websitesSettings.filter((website) => !["Srednja.hr", "Školski e-Rudnik"].includes(website.name));
            });
            chrome.storage.local.set(state, resolve);
        });
    });
}
function update51() {
    return new Promise((resolve) => {
        chrome.storage.local.get(null, (state) => {
            if (!state || !state.users)
                return;
            state.users.forEach((user) => {
                user.settings.classTabsOrder = user.settings
                    .classTabsOrder.filter((t) => t != "Vladanja");
            });
            chrome.storage.local.set(state, resolve);
        });
    });
}
function onMessage(request, sender, sendResponse) {
    if (request == "GET_ACTIVE_RULES") {
        chrome.declarativeNetRequest.getEnabledRulesets(sendResponse);
    }
    return true;
}
function cmpVersions(a, b) {
    /* Return values:
      - a number < 0 if a < b
      - a number > 0 if a > b
      - 0 if a = b */
    const segmentsA = a.replace(/(\.0+)+$/, "").split(".");
    const segmentsB = b.replace(/(\.0+)+$/, "").split(".");
    for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
        const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff)
            return diff;
    }
    return segmentsA.length - segmentsB.length;
}
