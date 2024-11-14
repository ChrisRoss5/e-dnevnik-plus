/* { matches: ["*://ocjene.skole.hr/*"], run_at: "document_start" } */

// This will prevent possible flicker when redirecting to App URL
chrome.runtime.sendMessage({ name: "GET_ACTIVE_RULES" }, (ids: string[]) => {
  if (ids.length) window.stop();
});

window.addEventListener("error", (event) => {
  chrome.runtime.sendMessage({
    name: "SEND_ANALYTICS_EVENT",
    params: {
      name: "error",
      error: event.error,
    },
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("a[href*='logout']")
    .forEach((el) => ((el as HTMLAnchorElement).onclick = onLogout));

  const { href } = window.location;

  if (href.includes("/login")) return autoLogin();

  initAds();

  if (href.includes("/grade")) return customizeSubject();

  if (href.includes("/course")) customizeSubjectList();
});

function getUserFullName() {
  const fullNameEl = document.querySelector(".user-name");
  return fullNameEl?.textContent?.trim() || "";
}
