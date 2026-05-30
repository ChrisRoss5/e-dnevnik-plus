document.getElementById("plus-card").onclick = () =>
  updateRules("enableRulesetIds");
document.getElementById("original-card").onclick = () =>
  updateRules("disableRulesetIds");

/* https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#method-updateEnabledRulesets */

const FRAME_RULE_ID = 1001;

function updateRules(method) {
  const appEnabled = method == "enableRulesetIds";
  const updateRulesetOptions = { [method]: ["ruleset"] };

  chrome.declarativeNetRequest.updateEnabledRulesets(
    updateRulesetOptions,
    () => {
      updateFrameRule(appEnabled, () => {
        window.open("https://ocjene.skole.hr/", "_blank");
        chrome.storage.sync.set({ appEnabled });
      });
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

function updateFrameRule(enabled, callback) {
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

function getFrameRule() {
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

chrome.runtime.sendMessage({
  name: "SEND_ANALYTICS_EVENT",
  params: {
    name: "click_button",
    id: "popup-icon",
  },
});
