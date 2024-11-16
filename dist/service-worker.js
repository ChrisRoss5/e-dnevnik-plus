"use strict";
chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onMessage.addListener(onMessage);
async function onInstalled(details) {
    const newVersion = chrome.runtime.getManifest().version;
    if (details.reason == "install") {
        chrome.storage.sync.clear();
        chrome.storage.local.clear();
        chrome.tabs.create({ url: "https://ednevnik.plus/#instaliran" });
        sendAnalyticsEvent({ name: "extension_install", version: newVersion }, "service_worker");
        return;
    }
    if (details.reason == "update") {
        const previousVersion = details.previousVersion;
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
        if (cmpVersions(previousVersion, "5.1") < 0)
            await update51();
        // Each update resets rules so we need to enable them again
        chrome.storage.sync.get("appEnabled", (state) => {
            if (!state.appEnabled)
                return;
            chrome.declarativeNetRequest.updateEnabledRulesets({
                enableRulesetIds: ["ruleset"],
            });
        });
        if (cmpVersions(previousVersion, "5.2") < 0)
            await update52();
        if (previousVersion != newVersion)
            sendAnalyticsEvent({
                name: "extension_update",
                previous_version: previousVersion,
                new_version: newVersion,
            }, "service_worker");
    }
}
function onMessage(message, sender, sendResponse) {
    switch (message.name) {
        case "GET_ACTIVE_RULES":
            chrome.declarativeNetRequest.getEnabledRulesets(sendResponse);
            return true; // Important to indicate that it will respond asynchronously
        case "SEND_ANALYTICS_EVENT":
            sendAnalyticsEvent(message.params, sender);
            break;
    }
}
function sendAnalyticsEvent(eventParams = {}, sender) {
    eventParams.sender =
        sender == "service_worker"
            ? sender
            : sender.url.endsWith("popup.html")
                ? "popup"
                : sender.url.startsWith("http")
                    ? "classic"
                    : "app";
    chrome.storage.sync.get("userId", (res) => {
        const eventName = eventParams.name.replaceAll("-", "_");
        delete eventParams.name;
        analytics.fireEvent(res.userId, eventName, eventParams);
    });
}
/*
OFFICIAL RECOMMENDATION:
https://developer.chrome.com/docs/extensions/how-to/integrate/google-analytics-4#debugging

MEASUREMENT PROTOCOL:
https://developers.google.com/analytics/devguides/collection/protocol/ga4

EXAMPLE FROM:
https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/tutorial.google-analytics/scripts/google-analytics.js

CONVERTED TO TYPESCRIPT & ADDED MORE PARAMS
*/
const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const GA_DEBUG_ENDPOINT = "https://www.google-analytics.com/debug/mp/collect";
// Get via https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
const MEASUREMENT_ID = "G-YM0ZN005N7";
const API_SECRET = "cuphSSrgSquPlU0oJl1Jww";
const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;
// Duration of inactivity after which a new session is created
const SESSION_EXPIRATION_IN_MIN = 30;
class Analytics {
    useDebugEndpoint;
    useDebugMode;
    constructor(useDebugEndpoint = false, useDebugMode = false) {
        this.useDebugEndpoint = useDebugEndpoint;
        this.useDebugMode = useDebugMode;
    }
    // Returns the client id, or creates a new one if one doesn't exist.
    // Stores client id in local storage to keep the same client id as long as
    // the extension is installed.
    async getOrCreateClientId() {
        let { clientId } = await chrome.storage.local.get("clientId");
        if (!clientId) {
            // Generate a unique client ID, the actual value is not relevant
            clientId = self.crypto.randomUUID();
            await chrome.storage.local.set({ clientId });
        }
        return clientId;
    }
    // Returns the current session id, or creates a new one if one doesn't exist or
    // the previous one has expired.
    async getOrCreateSessionId() {
        // Use storage.session because it is only in memory
        // SESSION STORAGE IS NOT SUPPORTED IN CONTENT SCRIPTS
        let { sessionData } = await chrome.storage.session.get("sessionData");
        const currentTimeInMs = Date.now();
        // Check if session exists and is still valid
        if (sessionData?.timestamp) {
            // Calculate how long ago the session was last updated
            const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
            // Check if last update lays past the session expiration threshold
            if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
                // Clear old session id to start a new session
                sessionData = null;
            }
            else {
                // Update timestamp to keep session alive
                sessionData.timestamp = currentTimeInMs;
                await chrome.storage.session.set({ sessionData });
            }
        }
        if (!sessionData) {
            // Create and store a new session
            sessionData = {
                session_id: currentTimeInMs.toString(),
                timestamp: currentTimeInMs.toString(),
            };
            await chrome.storage.session.set({ sessionData });
        }
        return sessionData.session_id;
    }
    // Fires an event with optional params. Event names must only include letters and underscores.
    async fireEvent(userId, name, params = {}) {
        // Configure session id and engagement time if not present, for more details see:
        // https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
        if (!params.session_id)
            params.session_id = await this.getOrCreateSessionId();
        if (!params.engagement_time_msec)
            params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
        if (this.useDebugMode)
            params.debug_mode = true; // ADDED THIS LINE
        try {
            if (this.useDebugMode) {
                console.log("Firing event: ", name, " for user ID: ", userId);
                console.log("Params:", params);
            }
            const response = await fetch(`${this.useDebugEndpoint ? GA_DEBUG_ENDPOINT : GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
                method: "POST",
                body: JSON.stringify({
                    client_id: await this.getOrCreateClientId(),
                    user_id: userId, // ADDED THIS LINE
                    user_data: {}, // https://www.weltpixel.com/blog/post/google-analytics-4-how-to-fix-events-not-being-tracked-when-using-measurement-protocol
                    events: [
                        {
                            name,
                            params,
                        },
                    ],
                }),
            });
            if (!this.useDebugEndpoint)
                return;
            console.log(await response.text());
        }
        catch (e) {
            console.error("Google Analytics request failed with an exception", e);
        }
    }
}
const analytics = new Analytics(false, false); // TODO before publishing: Set all params to false
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
function update52() {
    return new Promise((resolve) => {
        chrome.storage.sync.get("login", (state) => {
            const username = state.login?.username?.trim();
            if (!username)
                return;
            getSHA256Hash(username.replace(/@.*/, "")).then((userId) => {
                chrome.storage.sync.set({ userId }, resolve);
            });
        });
    });
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
const getSHA256Hash = async (input) => {
    const textAsBuffer = new TextEncoder().encode(input);
    // window is not defined in the service worker!
    const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
    return hash;
};
