document.getElementById("plus-card").onclick = () =>
  updateRules("enableRulesetIds");
document.getElementById("original-card").onclick = () =>
  updateRules("disableRulesetIds");

/* https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#method-updateEnabledRulesets */

function updateRules(method) {
  /* if (method == "enableRulesetIds") {
    chrome.permissions.request({
      origins: ['all urls pls']  // Optional origins not supported yet :(
    }, (granted) => {
      console.log(granted);
    });
  } */
  const updateRulesetOptions = { [method]: ["ruleset"] };
  chrome.declarativeNetRequest.updateEnabledRulesets(updateRulesetOptions, () =>
    window.open("https://ocjene.skole.hr/", "_blank"),
  );
}
