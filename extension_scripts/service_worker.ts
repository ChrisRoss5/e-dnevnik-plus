// cd extension_scripts
// tsc -w
// todo: add "domains": ["jnejifelmoaaoghdgaoikmblgcbmgcdn"] to rules.json condition

chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onMessage.addListener(onMessage);

function onMessage(
  request: { message: string; payload: any },
  sender,
  sendResponse,
) {
  return true;
}
