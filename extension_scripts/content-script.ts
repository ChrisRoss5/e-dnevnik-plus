/* { matches: ["*://ocjene.skole.hr/*"], run_at: "document_start" } */

chrome.runtime.sendMessage("GET_ACTIVE_RULES", (ids: string[]) => {
  // This will prevent possible flicker when redirecting to App URL
  if (ids.length) window.stop();
});

const plusColor = "#2296da"; // ALL PAGE MODIFICATIONS

window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("a[href*='logout']")
    .forEach((el) => ((el as HTMLAnchorElement).onclick = onLogout));

  const { href } = window.location;
  if (href.includes("/login")) return autoLogin();
  if (href.includes("/grade")) return addAverageBelowGradesTable();
  if (href.includes("/course")) addAverageOnClass();
});

let logoutCleared = false;
function onLogout(e: MouseEvent) {
  if (logoutCleared) return;
  else e.preventDefault();
  chrome.storage.sync.clear(() => {
    logoutCleared = true;
    (e.target as HTMLAnchorElement).click();
  });
}

function autoLogin() {
  const usernameEl = document.querySelector(
    "input[name='username']",
  ) as HTMLInputElement;
  const passwordEl = document.querySelector(
    "input[name='password']",
  ) as HTMLInputElement;
  const loginBtn = document.querySelector(
    "input[type='submit']",
  ) as HTMLInputElement;

  // Autologin
  chrome.storage.sync.get("login", (res) => {
    if (document.querySelector(".alert-error") || !res.login) {
      const wrapper = document.querySelector("#page-wrapper") as HTMLElement;
      wrapper.style.setProperty("display", "block", "important");
      return;
    }
    usernameEl.value = res.login.username;
    passwordEl.value = res.login.password;
    loginBtn.click();
  });

  // Checkbox
  const cbx = document.createElement("div");
  cbx.style.color = plusColor;
  cbx.style.padding = "10px 0";
  cbx.innerHTML = /* html */ `
    <span style="font-size: 14px">Ostani prijavljen:</span>
    <label class="check" style="float: right; transform: translateY(-8px)">
      <input type="checkbox" class="checkbox" id="cbx" style="display: none;">
      <svg width="23px" height="23px" viewBox="0 0 18 18">
        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
        <polyline points="1 9 7 14 15 4"></polyline>
      </svg>
    </label>`;
  loginBtn.parentElement!.insertBefore(cbx, loginBtn);
  let loginSet = false;
  loginBtn.onclick = (e: MouseEvent) => {
    if (loginSet) return;
    if ((document.querySelector("#cbx") as HTMLInputElement).checked) {
      e.preventDefault();
      const login = { username: usernameEl.value, password: passwordEl.value };
      chrome.storage.sync.set({ login }, () => {
        loginSet = true;
        loginBtn.click();
      });
    }
  };
}

function addAverageBelowGradesTable() {
  const table = document.querySelector(".grades-table");
  if (!table) return;
  const avgEl = document.createElement("div");
  avgEl.style.color = plusColor;
  avgEl.style.float = "right";
  avgEl.textContent = "Prosjek ocjena: " + getSubjectAverage(document);
  table.parentNode!.insertBefore(avgEl, table.nextSibling);
}

function addAverageOnClass() {
  const menu = document.querySelector(".export-menu");
  if (!menu) return;
  const newItemContainer = document.createElement("div");
  const newItem = document.createElement("a");
  newItem.href = "javascript:void(0);";
  newItem.style.color = plusColor;
  newItem.textContent = "prosjeci";
  menu.appendChild(newItemContainer);
  newItemContainer.appendChild(newItem).onclick = () => {
    const parser = new DOMParser();
    const loaderEl = document.createElement("img");
    loaderEl.src = chrome.runtime.getURL("assets/img/spinner.svg");
    loaderEl.style.transform = "scale(1.5)";
    newItem.replaceWith(loaderEl);
    Promise.all(
      [...document.querySelectorAll(".content > .list a[href^='/grade/']")].map(
        (subjectEl) =>
          fetch((subjectEl as HTMLAnchorElement).href)
            .then((response) => response.text())
            .then((html) => {
              const doc = parser.parseFromString(html, "text/html");
              const finalGrade = getSubjectFinalGrade(doc);
              const average = getSubjectAverage(doc);
              const rounded = Math.round(parseFloat(average.replace(",", ".")));
              subjectEl.innerHTML += average;
              (subjectEl as HTMLAnchorElement).style.paddingRight = "17px";
              return finalGrade || (average == "—" ? 0 : rounded);
            }),
      ),
    ).then((result) => {
      const finalAverageEl = document.createElement("a");
      finalAverageEl.title =
        "Prosjek svih zaključnih ocjena (završni uspjeh).\n" +
        "Ako ocjena iz predmeta nije zaključena, zaokružuje se prosjek.\n" +
        "Ako predmet nema ocjena, ne uračunava se u ovaj prosjek.";
      finalAverageEl.innerHTML =
        getAverageFromArray(result.filter((i) => i)) +
        "<sup style='position: absolute; padding-left: 2px'>?</sup>";
      loaderEl.replaceWith(finalAverageEl);
    });
  };
}

function getSubjectFinalGrade(doc: Document): number {
  const finalGradeEl = doc.querySelector(".final-grade > div:last-child");
  if (!finalGradeEl) return 0;
  const finalGrade = finalGradeEl.textContent!.match(/\d/);
  return finalGrade ? parseInt(finalGrade[0]) : 0;
}

function getSubjectAverage(doc: Document): string {
  return getAverageFromArray(
    [...doc.querySelectorAll(".grades-table .grade")].flatMap((cell) =>
      (cell.textContent!.match(/\d/g) || []).map(Number),
    ),
  );
}

function getAverageFromArray(arr: number[]): string {
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  return avg ? avg.toFixed(2).replace(".", ",") : "—";
}
