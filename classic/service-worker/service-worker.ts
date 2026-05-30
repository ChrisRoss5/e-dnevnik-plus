chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onMessage.addListener(onMessage);

const FRAME_RULE_ID = 1001;

async function onInstalled(details: any) {
  const newVersion: string = chrome.runtime.getManifest().version;

  if (details.reason == "install") {
    chrome.storage.sync.clear();
    chrome.storage.local.clear();
    chrome.tabs.create({ url: "https://ednevnik.plus/#instaliran" });
    sendAnalyticsEvent(
      { name: "extension_install", version: newVersion },
      "service_worker",
    );
    return;
  }
  if (details.reason == "update") {
    const previousVersion: string = details.previousVersion;

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
      updateFrameRule(true);
    });

    if (cmpVersions(previousVersion, "5.2") < 0) await update52();

    if (previousVersion != newVersion)
      sendAnalyticsEvent(
        {
          name: "extension_update",
          previous_version: previousVersion,
          new_version: newVersion,
        },
        "service_worker",
      );
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
      sendAnalyticsEvent(message.params, sender);
      break;
  }
}

function updateFrameRule(enabled: boolean, callback?: () => void) {
  chrome.declarativeNetRequest.updateDynamicRules(
    enabled
      ? {
          removeRuleIds: [FRAME_RULE_ID],
          addRules: [getFrameRule()],
        }
      : { removeRuleIds: [FRAME_RULE_ID] },
    callback,
  );
}

function getFrameRule(): chrome.declarativeNetRequest.Rule {
  return {
    id: FRAME_RULE_ID,
    priority: 2,
    action: {
      type: "modifyHeaders",
      responseHeaders: [
        { header: "x-frame-options", operation: "remove" },
        { header: "frame-options", operation: "remove" },
      ],
    },
    condition: {
      initiatorDomains: [new URL(chrome.runtime.getURL("")).hostname],
      resourceTypes: ["sub_frame"],
    },
  };
}

function sendAnalyticsEvent(eventParams = {} as any, sender: any) {
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
