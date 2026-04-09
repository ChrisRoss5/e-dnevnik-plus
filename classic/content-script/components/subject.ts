function customizeSubject() {
  if (document.querySelector(".multiple-grades"))
    return console.error(
      "e-Dnevnik Plus ne podržava uređivanje ocjena na mobilnim uređajima.",
    );

  const cellsNL = document.querySelectorAll(".grade.cell");
  const cells = [...cellsNL] as HTMLElement[];
  const avgEl = document.querySelector(".numbered-average") as HTMLElement;
  avgEl.dataset.originalValue = avgEl.textContent!;
  avgEl.addEventListener("click", resetAll);

  for (const cell of cells) {
    cell.contentEditable = "true";
    cell.dataset.originalValue = getValues(cell).join(", ");
    cell.addEventListener("input", () => handleInputUpdate(cell));
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      cell.textContent = cell.dataset.originalValue!;
      handleInputUpdate(cell);
    });
  }

  function updateAverage() {
    const grades = cells.flatMap((cell) =>
      cell.classList.contains("invalid") ? [] : getValues(cell),
    );
    const avg = getAverageFromArray(grades);
    avgEl.textContent = avg;
    addClass(avgEl, "edited", avg != avgEl.dataset.originalValue);
  }

  function handleInputUpdate(cell: HTMLElement) {
    const values = getValues(cell);
    const isInvalid = values.some((v) => !v || v < 1 || v > 5);
    addClass(cell, "invalid", isInvalid);
    addClass(cell, "edited", values.join(", ") != cell.dataset.originalValue!);
    updateAverage();
  }

  function getValues(cell: HTMLElement) {
    const split = cell.textContent!.split(",").map((s) => s.trim());
    return split.filter(Boolean).map(Number);
  }

  function resetAll() {
    for (const cell of cells) {
      cell.textContent = cell.dataset.originalValue!;
      cell.classList.remove("edited", "invalid");
    }
    updateAverage();
  }
}
