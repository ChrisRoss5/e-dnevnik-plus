/*

cd extension_scripts
tsc -w

TODO:
add
  "domains": ["jnejifelmoaaoghdgaoikmblgcbmgcdn"]
to rules.json condition.
real extension ID: bcnccmamhmcabokipgjechdeealcmdbe

*/

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onMessage.addListener(onMessage);

function onInstalled(details: any) {
  if (details.reason == "install") {
    chrome.storage.sync.clear();
    chrome.storage.local.clear();
    chrome.tabs.create({ url: "https://ednevnik.plus/#instaliran" });

  } else if (details.reason == "update") {
    const previousVersion: string = details.previousVersion;
    const newVersion: string = chrome.runtime.getManifest().version;

    if (previousVersion != newVersion) {
      chrome.storage.sync.clear();
      chrome.storage.local.clear();
      chrome.tabs.create({ url: "https://ednevnik.plus/#azuriran" });
    }
  }
}

function onMessage(request: string, sender: any, sendResponse: () => any) {
  if (request == "GET_ACTIVE_RULES") {
    chrome.declarativeNetRequest.getEnabledRulesets(sendResponse);
  }
  return true;
}
