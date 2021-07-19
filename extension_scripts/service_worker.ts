// cd extension_scripts
// tsc -w

// todo: add "domains": ["jnejifelmoaaoghdgaoikmblgcbmgcdn"] to rules.json condition

chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("from the extension");
  sendResponse("goodbye");
});