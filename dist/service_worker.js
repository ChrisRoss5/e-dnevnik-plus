// cd extension_scripts
// tsc -w
chrome.runtime.setUninstallURL("https://ednevnik.plus/deinstalacija");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("from the extension");
    sendResponse("goodbye");
});
//chrome.tabs.onUpdated.addListener(URLchanged);
function URLchanged(tabId, changeInfo, tab) {
    var url = tab.url;
    if (url && /^https?:\/\/ocjene\.skole\.hr/.test(url)) {
        chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL("app/index.html"),
            /* state: "fullscreen" */
        });
    }
}
