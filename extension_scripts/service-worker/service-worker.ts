chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onMessage.addListener(onMessage);

async function onInstalled(details: any) {
  if (details.reason == "install") {
    chrome.storage.sync.clear();
    chrome.storage.local.clear();
    chrome.tabs.create({ url: "https://ednevnik.plus/#instaliran" });
    return;
  }
  if (details.reason == "update") {
    const previousVersion: string = details.previousVersion;
    // const newVersion: string = chrome.runtime.getManifest().version;

    if (cmpVersions(previousVersion, "5.0") < 0) {
      chrome.storage.sync.clear();
      chrome.storage.local.clear();
      chrome.tabs.create({ url: "https://ednevnik.plus/#azuriran" });
      return;
    }
    if (previousVersion == "5.0") await update501();
    if (["5.0", "5.0.1"].includes(previousVersion)) await update502();
    if (cmpVersions(previousVersion, "5.1") < 0) await update51();

    // Each update resets rules so we need to enable them again
    chrome.storage.sync.get("appEnabled", (state) => {
      if (!state.appEnabled) return;
      chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ["ruleset"],
      });
    });

    update52();
  }
}

function onMessage(
  message: { name: string; params?: any },
  sender: any,
  sendResponse: () => any,
) {
  switch (message.name) {
    case "GET_ACTIVE_RULES":
      chrome.declarativeNetRequest.getEnabledRulesets(sendResponse);
      return true; // Important to indicate that it will respond asynchronously
    case "SEND_ANALYTICS_EVENT":
      message.params = message.params || {};
      message.params.sender = sender.url.endsWith("popup.html")
        ? "popup"
        : sender.url.startsWith("http")
        ? "classic"
        : "app";
      chrome.storage.sync.get("userId", (res) => {
        const eventName = message.params.name;
        delete message.params.name;
        analytics.fireEvent(res.userId, eventName, message.params);
      });
      break;
  }
}
