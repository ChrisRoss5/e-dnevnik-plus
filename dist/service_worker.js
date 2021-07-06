chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.tabs.onUpdated.addListener(URLchanged);
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("from the extension");
    sendResponse("goodbye");
  }
);

function URLchanged(tabId, changeInfo, { url }) {
  if (url && /^https?:\/\/ocjene\.skole\.hr/.test(url)) {
    chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL("vue/index.html")
      /* state: "fullscreen" */
    });
  }
}