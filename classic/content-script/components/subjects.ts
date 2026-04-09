function customizeSubjectList() {
  const menu = document.querySelector(".grades-menu")!;
  const avgElsNL = document.querySelectorAll(".list-average-grade");
  const avgEls = [...avgElsNL] as HTMLElement[];

  const finalAverageEl = document.createElement("div");
  finalAverageEl.classList.add("button", "editable-avg", "final-avg");
  finalAverageEl.addEventListener("click", resetAll);

  const key = StorageKeys.firstTimeClassicVisitor + getUserFullName();
  chrome.storage.sync.get(key, (res) => {
    if (res[key]) return;
    finalAverageEl.classList.add("jumping");
    finalAverageEl.addEventListener(
      "mouseenter",
      () => {
        finalAverageEl.classList.remove("jumping");
        chrome.storage.sync.set({ [key]: true });
      },
      { once: true },
    );
  });

  const finalAverageValueEl = document.createElement("span");
  finalAverageValueEl.style.paddingLeft = "0.5rem";
  finalAverageValueEl.style.cursor = "help";
  const helpEl = document.createElement("sup");
  helpEl.style.paddingBottom = "0.5rem";
  helpEl.textContent = "?";
  finalAverageEl.append("Završna ocjena:", finalAverageValueEl, helpEl);
  finalAverageEl.dataset.title =
    "Prosjek zaokruženih prosjeka. Neispravno uneseni prosjeci ne ulaze u izračun.\n" +
    "Tip: Klik ovdje za poništavanje svih izmjena.\n" +
    "Tip: Skrolaj iznad predmetnog prosjeka za povećanje/smanjenje ocjene.\n" +
    "Tip: Desni klik na predmetni prosjek za poništavanje izmjene.\n\n" +
    "U svakom predmetu možeš uređivati i dodavati ocjene te će se prosjek ažurirati.\n" +
    "Tip: Klik na prosjek za poništavanje svih izmjena u predmetu.\n" +
    "Tip: Desni klik na ćeliju za poništavanje izmjena u ćeliji.\n" +
    "Važno: Neispravna ćelija ima crveni okvir i ne ulazi u izračun prosjeka.\n\n" +
    "Sretno s planiranjem! - Proširenje e-Dnevnik Plus.";

  menu.prepend(finalAverageEl);

  for (const el of avgEls) {
    el.closest("a")!.draggable = false;
    el.classList.add("editable-avg");
    const child = el.firstElementChild as HTMLElement;
    el.style.backgroundColor = getComputedStyle(child).backgroundColor;
    el.innerHTML = el.textContent?.replace(",", ".") ?? "";
    el.contentEditable = "true";
    el.dataset.originalValue = el.textContent ? getValue(el) + "" : "";
    el.addEventListener("click", (e) => e.preventDefault());
    el.addEventListener("input", (e) => {
      el.textContent = (e as InputEvent).data;
      handleInputUpdate(el);
    });
    el.addEventListener("wheel", (e) => {
      e.preventDefault();
      const value = Math.round(getValue(el));
      const newValue = e.deltaY < 0 ? value + 1 : value - 1;
      el.textContent = Math.max(1, Math.min(newValue, 5)) + "";
      handleInputUpdate(el);
    });
    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      el.textContent = el.dataset.originalValue!;
      handleInputUpdate(el);
    });
  }

  updateFinalAverage();

  function updateFinalAverage() {
    const avgs = avgEls.flatMap((el) =>
      el.classList.contains("invalid") ? [] : Math.round(getValue(el)),
    );
    const finalAvg = getAverageFromArray(avgs);
    finalAverageValueEl.textContent = finalAvg;
    const { originalValue } = finalAverageEl.dataset;
    if (originalValue === undefined)
      finalAverageEl.dataset.originalValue = finalAvg;
    else addClass(finalAverageEl, "edited", finalAvg != originalValue);
  }

  function resetAll() {
    for (const el of avgEls) {
      el.textContent = el.dataset.originalValue!;
      el.classList.remove("edited", "invalid");
    }
    updateFinalAverage();
  }

  function handleInputUpdate(el: HTMLElement) {
    const value = getValue(el);
    addClass(el, "invalid", !value || value < 1 || value > 5);
    addClass(el, "edited", value != parseFloat(el.dataset.originalValue!));
    updateFinalAverage();
  }

  function getValue(el: HTMLElement) {
    return parseFloat(el.textContent!.replace(",", "."));
  }
}
