document.getElementById("plus-card").onclick = () =>
  updateRules("enableRulesetIds");
document.getElementById("original-card").onclick = () =>
  updateRules("disableRulesetIds");

/* https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#method-updateEnabledRulesets */

function updateRules(method) {
  const appEnabled = method == "enableRulesetIds";
  const updateRulesetOptions = { [method]: ["ruleset"] };

  chrome.declarativeNetRequest.updateEnabledRulesets(
    updateRulesetOptions,
    () => {
      window.open("https://ocjene.skole.hr/", "_blank");
      chrome.storage.sync.set({ appEnabled });
    },
  );

  chrome.runtime.sendMessage({
    name: "SEND_ANALYTICS_EVENT",
    params: {
      name: "click_button",
      id: appEnabled ? "plus-card" : "original-card",
    },
  });
}

chrome.runtime.sendMessage({
  name: "SEND_ANALYTICS_EVENT",
  params: {
    name: "click_button",
    id: "popup-icon",
  },
});
