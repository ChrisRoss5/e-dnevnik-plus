chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.tabs.onUpdated.addListener(URLchanged);

function URLchanged(tabId, changeInfo, { url }) {
  if (url && /^https?:\/\/ocjene\.skole\.hr/.test(url)) {
    chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL("vue/index.html")
    });
  }
}