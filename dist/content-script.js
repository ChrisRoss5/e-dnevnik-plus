"use strict";
/* { matches: ["*://ocjene.skole.hr/*"], run_at: "document_start" } */
chrome.runtime.sendMessage("GET_ACTIVE_RULES", (ids) => {
    // This will prevent possible flicker when redirecting to App URL
    if (ids.length)
        window.stop();
});
const plusColor = "#2296da"; // ALL PAGE MODIFICATIONS
window.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll("a[href*='logout']")
        .forEach((el) => (el.onclick = onLogout));
    const { href } = window.location;
    if (href.includes("/login"))
        return autoLogin();
    if (href.includes("/grade"))
        return customizeSubject();
    if (href.includes("/course"))
        customizeSubjectList();
});
let logoutCleared = false;
function onLogout(e) {
    if (logoutCleared)
        return;
    else
        e.preventDefault();
    chrome.storage.sync.remove("login", () => {
        logoutCleared = true;
        e.target.click();
    });
}
function autoLogin() {
    const usernameEl = document.querySelector("input[name='username']");
    const passwordEl = document.querySelector("input[name='password']");
    const loginBtn = document.querySelector("input[type='submit']");
    // Autologin
    chrome.storage.sync.get("login", (res) => {
        if (document.querySelector(".alert-error") || !res.login) {
            const wrapper = document.querySelector("#page-wrapper");
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
    loginBtn.parentElement.insertBefore(cbx, loginBtn);
    let loginSet = false;
    loginBtn.onclick = (e) => {
        if (loginSet)
            return;
        if (document.querySelector("#cbx").checked) {
            e.preventDefault();
            const login = { username: usernameEl.value, password: passwordEl.value };
            chrome.storage.sync.set({ login }, () => {
                loginSet = true;
                loginBtn.click();
            });
        }
    };
}
function customizeSubject() {
    if (document.querySelector(".multiple-grades"))
        return console.error("e-Dnevnik Plus ne podržava uređivanje ocjena na mobilnim uređajima.");
    const cellsNL = document.querySelectorAll(".grade.cell");
    const cells = [...cellsNL];
    const avgEl = document.querySelector(".numbered-average");
    avgEl.dataset.originalValue = avgEl.textContent;
    avgEl.addEventListener("click", resetAll);
    for (const cell of cells) {
        cell.contentEditable = "true";
        cell.dataset.originalValue = getValues(cell).join(", ");
        cell.addEventListener("input", () => handleInputUpdate(cell));
        cell.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            cell.textContent = cell.dataset.originalValue;
            handleInputUpdate(cell);
        });
    }
    function updateAverage() {
        const grades = cells.flatMap((cell) => cell.classList.contains("invalid") ? [] : getValues(cell));
        const avg = getAverageFromArray(grades);
        avgEl.textContent = avg;
        addClass(avgEl, "edited", avg != avgEl.dataset.originalValue);
    }
    function handleInputUpdate(cell) {
        const values = getValues(cell);
        const isInvalid = values.some((v) => !v || v < 1 || v > 5);
        addClass(cell, "invalid", isInvalid);
        addClass(cell, "edited", values.join(", ") != cell.dataset.originalValue);
        updateAverage();
    }
    function getValues(cell) {
        const split = cell.textContent.split(",").map((s) => s.trim());
        return split.filter(Boolean).map(Number);
    }
    function resetAll() {
        for (const cell of cells) {
            cell.textContent = cell.dataset.originalValue;
            cell.classList.remove("edited", "invalid");
        }
        updateAverage();
    }
}
function customizeSubjectList() {
    const menu = document.querySelector(".grades-menu");
    const avgElsNL = document.querySelectorAll(".list-average-grade");
    const avgEls = [...avgElsNL];
    const finalAverageEl = document.createElement("div");
    finalAverageEl.classList.add("button", "editable-avg", "final-avg");
    finalAverageEl.addEventListener("click", resetAll);
    const finalAverageValueEl = document.createElement("span");
    finalAverageValueEl.style.paddingLeft = "0.5rem";
    finalAverageValueEl.style.cursor = "help";
    const helpEl = document.createElement("sup");
    helpEl.style.paddingBottom = "0.5rem";
    helpEl.textContent = "?";
    finalAverageEl.append("Završna ocjena:", finalAverageValueEl, helpEl);
    finalAverageEl.title =
        "Prosjek zaokruženih prosjeka. Neispravno uneseni prosjeci ne ulaze u izračun. \n" +
            "Tip: Klik ovdje za poništavanje svih izmjena.\n" +
            "Tip: Skrolaj iznad predmetnog prosjeka za povećanje/smanjenje vrijednosti.\n" +
            "Tip: Desni klik na predmetni prosjek za poništavanje izmjene.";
    menu.prepend(finalAverageEl);
    for (const el of avgEls) {
        el.closest("a").draggable = false;
        el.classList.add("editable-avg");
        const child = el.firstElementChild;
        el.style.backgroundColor = getComputedStyle(child).backgroundColor;
        el.innerHTML = el.textContent?.replace(",", ".") ?? "";
        el.contentEditable = "true";
        el.dataset.originalValue = el.textContent ? getValue(el) + "" : "";
        el.addEventListener("click", (e) => e.preventDefault());
        el.addEventListener("input", (e) => {
            el.textContent = e.data;
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
            el.textContent = el.dataset.originalValue;
            handleInputUpdate(el);
        });
    }
    updateFinalAverage();
    function updateFinalAverage() {
        const avgs = avgEls.flatMap((el) => el.classList.contains("invalid") ? [] : Math.round(getValue(el)));
        const finalAvg = getAverageFromArray(avgs);
        finalAverageValueEl.textContent = finalAvg;
        const { originalValue } = finalAverageEl.dataset;
        if (originalValue === undefined)
            finalAverageEl.dataset.originalValue = finalAvg;
        else
            addClass(finalAverageEl, "edited", finalAvg != originalValue);
    }
    function resetAll() {
        for (const el of avgEls) {
            el.textContent = el.dataset.originalValue;
            el.classList.remove("edited", "invalid");
        }
        updateFinalAverage();
    }
    function handleInputUpdate(el) {
        const value = getValue(el);
        addClass(el, "invalid", !value || value < 1 || value > 5);
        addClass(el, "edited", value != parseFloat(el.dataset.originalValue));
        updateFinalAverage();
    }
    function getValue(el) {
        return parseFloat(el.textContent.replace(",", "."));
    }
}
// UTILS
function getAverageFromArray(arr) {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return avg ? avg.toFixed(2) : "—";
}
function addClass(el, className, condition) {
    condition ? el.classList.add(className) : el.classList.remove(className);
}
