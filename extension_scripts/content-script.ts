chrome.runtime.sendMessage("GET_ACTIVE_RULES", (ids: string[]) => {
  if (ids.length) window.stop();
});

document.onload = () => {
  if (window.location.href.includes("/grade/")) addAverageBelowGradesTable();
}

function addAverageBelowGradesTable() {
  console.log(2);

  const gradesTable = document.querySelector(".grades-table");
  if (!gradesTable) return;

  const grades = [] as number[];
  for (const gradeCell of gradesTable.querySelectorAll(".grade")) {
    const numbers = gradeCell.textContent.match(/\d/g);
    if (numbers) grades.push(...numbers.map(Number));
  }

  const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
  const avgEl = document.createElement("div");
  avgEl.style.float = "right";
  avgEl.title = "Ukupno ocjena: " + grades.length;
  avgEl.textContent =
    "Prosjek ocjena: " +
    avg
      .toFixed(2)
      .toString()
      .replace(".", ",");
  gradesTable.parentNode.insertBefore(avgEl, gradesTable.nextSibling);
}
