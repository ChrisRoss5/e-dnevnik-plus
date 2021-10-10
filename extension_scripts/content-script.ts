/* { matches: ["*://ocjene.skole.hr/*"], run_at: "document_start" } */

chrome.runtime.sendMessage("GET_ACTIVE_RULES", (ids: string[]) => {

  // This will prevent possible flicker when redirecting to App URL
  if (ids.length) window.stop();
});

window.addEventListener("DOMContentLoaded", () => {
  const { href } = window.location;
  if (href.includes("/grade")) return addAverageBelowGradesTable();
  if (href.includes("/course")) addAverageOnClass();
});

const plusColor = "#2296da";

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
