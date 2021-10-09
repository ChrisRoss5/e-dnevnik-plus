// cd extension_scripts
// tsc -w
// TODO: add "domains": ["jnejifelmoaaoghdgaoikmblgcbmgcdn"] to rules.json condition

chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onMessage.addListener(onMessage);

function onMessage(request: string, sender, sendResponse) {
  if (request == "GET_ACTIVE_RULES") {
    chrome.declarativeNetRequest.getEnabledRulesets(sendResponse);
  }

  return true;
}
