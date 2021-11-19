/*

cd extension_scripts
tsc -w

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
    // const newVersion: string = chrome.runtime.getManifest().version;

    if (cmpVersions(previousVersion, "5.0") < 0) {
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

function cmpVersions(a: string, b: string) {
  /* Return values:
    - a number < 0 if a < b
    - a number > 0 if a > b
    - 0 if a = b */
  const segmentsA = a.replace(/(\.0+)+$/, "").split(".");
  const segmentsB = b.replace(/(\.0+)+$/, "").split(".");
  for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
    const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff) return diff;
  }
  return segmentsA.length - segmentsB.length;
}
