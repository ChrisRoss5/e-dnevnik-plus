// https://ocjene.skole.hr/build/js/pages/potvrde/home.66ea6a41.js
// @ts-nocheck
import { useToast } from "vue-toastification";
const toast = useToast();
const base = "https://ocjene.skole.hr";

// Modificiran createModalMessage i dodan downloadURI

export default (document) => {
  function downloadURI(uri) {
    const link = document.createElement("a");
    link.download = "Potvrda";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
  }

  let form = document.querySelector("#new-certificate");
  let fetchDataUrl = document.querySelector("#fetch-data-url").value;
  let certUrl = document.querySelector("#certificate-url").value;
  let tabButton = document.querySelector(".button");
  let table = document.querySelector("#certificates-table");
  let header = table.querySelector(".header");
  let downloadUrl = document.querySelector("#download-url").value;
  let isMobile = document.querySelector("#is-mobile").value;

  let schoolFetched = false;

  tabButton.addEventListener("click", function(event) {
    if (table.classList.contains("hide")) {
      table.classList.remove("hide");
      form.classList.add("hide");
      tabButton.querySelector("span").innerHTML = "Generiraj";
    } else {
      form.classList.remove("hide");
      table.classList.add("hide");
      tabButton.querySelector("span").innerHTML = "Moje potvrde";
    }
  });

  document.querySelector("#oib").addEventListener("change", function(ev) {
    document.querySelector("#school-select-container").classList.add("hide");
    document.querySelector("#school-select-label").classList.add("hide");
    document.querySelector("#school-select").innerHTML = "";

    document.querySelector("#class-select-container").classList.add("hide");
    document.querySelector("#class-select-label").classList.add("hide");
    document.querySelector("#class-select").innerHTML = "";

    schoolFetched = false;
    document.querySelector("#school-select").disabled = false;
    document.querySelector("#class-select").disabled = false;
  });

  let chooseSchool = function chooseSchool(data) {
    let schoolCount = 0;
    let classCount = 0;

    document.querySelector("#school-select").innerHTML = "";
    document.querySelector("#class-select").innerHTML = "";

    document
      .querySelector("#school-select")
      .appendChild(new Option("-- odaberite školu --", ""));
    document
      .querySelector("#class-select")
      .appendChild(new Option("-- odaberite razred --", ""));

    for (let [schoolID, school] of Object.entries(data)) {
      for (let [schoolName, schoolClass] of Object.entries(school)) {
        let schoolOption = new Option(schoolName, schoolID);

        if (Object.entries(data).length == 1) {
          schoolOption.selected = true;
          document.querySelector("#school-select").disabled = true;
        }

        schoolCount++;
        document.querySelector("#school-select").appendChild(schoolOption);

        for (let [className, classType] of Object.entries(schoolClass)) {
          let classOption = new Option(classType, className);

          if (Object.entries(schoolClass).length == 1) {
            classOption.selected = true;
            document.querySelector("#class-select").disabled = true;
          }

          classOption.setAttribute("data-school-id", schoolID);
          document.querySelector("#class-select").appendChild(classOption);
          classCount++;
        }
      }
    }

    schoolFetched = true;

    if (schoolCount === 1 && classCount === 1) {
      getDataFromTemplateAndCreateCert();
    } else {
    }

    document.querySelector("#school-select-container").classList.remove("hide");
    document.querySelector("#school-select-label").classList.remove("hide");

    document.querySelector("#class-select-container").classList.remove("hide");
    document.querySelector("#class-select-label").classList.remove("hide");
  };

  function getDataFromTemplateAndCreateCert() {
    let reasonID = document.querySelector("#reason").value;
    let oib = document.querySelector("#oib").value;
    let schoolID = document.querySelector("#school-select").value;
    let classID = document.querySelector("#class-select").value;

    if (schoolFetched) {
      if (reasonID === "" || schoolID === "" || classID === "") {
        if (reasonID === "")
          createModalMessage(
            "<span> Molimo odaberite razlog izdavanja! </span>",
          );
        if (schoolFetched === true && schoolID === "")
          createModalMessage("<span> Molimo odaberite školu. </span>");
        if (schoolFetched === true && classID === "")
          createModalMessage("<span> Molimo odaberite razred. </span>");
      } else {
        createModalMessage(
          '<span> Potvrda se generira. </span> <span> Molimo pričekajte nekoliko trenutaka. </span> <div class="icon-wrapper"> <div class="loader"></div></div>',
        );
        createCert(reasonID, oib, schoolID, classID);
      }
    } else {
      if (oib === "") {
        createModalMessage("<span> Molimo odaberite učenika! </span>");
      } else {
        createModalMessage(
          '<span> Dohvaćamo podatke iz e-Matice. </span> <span> Molimo pričekajte nekoliko trenutaka.</span> <div class="icon-wrapper"> <div class="loader"></div></div>',
        );
        fetchSchoolData(oib);
      }
    }
  }

  document
    .querySelector("#school-select")
    .addEventListener("change", function(ev) {
      let selectedScool = document.querySelector("#school-select").value;
      let classes = document.querySelector("#class-select");
      let selectedSchoolClasses = classes.querySelectorAll(
        '[data-school-id="' + selectedScool + '"]',
      );

      if (selectedSchoolClasses.length === 1) {
        for (let index = 0; index < selectedSchoolClasses.length; ++index) {
          selectedSchoolClasses[index].selected = true;
          classes.disabled = true;
        }
      } else {
        classes.disabled = false;
        classes[0].selected = true;
        for (let index = 0; index < classes.length; ++index) {
          if (classes[index].getAttribute("data-school-id") == selectedScool) {
            classes[index].removeAttribute("hidden");
          } else {
            classes[index].setAttribute("hidden", "true");
          }
        }
      }

      document
        .querySelector("#class-select-container")
        .classList.remove("hide");
      document.querySelector("#class-select-label").classList.remove("hide");
    });

  let fetchSchoolData = function fetchSchoolData(oib) {
    let csrf = document.querySelector("#csrf").value;

    let params = {
      _token: csrf,
      oib: oib,
    };

    fetch(base + fetchDataUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error == true) {
          throw new Error();
        }

        chooseSchool(data);
      })
      .catch((error) => {
        createModalMessage(
          "<span> Došlo je do greške prilikom dohvaćanja škole. </span><span> Molimo pokušajte opet generirati potvrdu. </span>",
        );
      });
  };

  const createCert = function createCert(reasonID, oib, schoolID, classID) {
    let csrf = document.querySelector("#csrf").value;

    let params = {
      _token: csrf,
      oib: oib,
      reasonID: reasonID,
      schoolID: schoolID,
      classID: classID,
    };

    fetch(base + certUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error == true) {
          throw new Error();
        }
        let date = new Date(data.date);

        let downloadLink = downloadUrl + "/" + data.id;
        downloadURI(downloadLink);

        let downloadButton = document.createElement("a");
        downloadButton.classList.add("download-button");
        downloadButton.setAttribute("href", downloadLink);

        let downloadIcon = document.createElement("i");
        downloadIcon.classList.add("icon-file-pdf");
        downloadButton.appendChild(downloadIcon);

        let newRow = document.createElement("div");
        newRow.classList.add("flex-table");
        newRow.classList.add("row");
        newRow.classList.add("potvrde");

        let newName = document.createElement("div");
        newName.classList.add("flex-row");
        newName.innerHTML = data.fullName;

        let newReason = document.createElement("div");
        newReason.classList.add("flex-row");
        newReason.innerHTML = data.reason;

        let newDate = document.createElement("div");
        newDate.classList.add("flex-row");
        newDate.innerHTML = data.date;

        let newDownloadButtonWrapper = document.createElement("div");
        newDownloadButtonWrapper.classList.add("flex-row");
        newDownloadButtonWrapper.appendChild(downloadButton);

        newRow.appendChild(newName);
        newRow.appendChild(newReason);
        newRow.appendChild(newDate);
        newRow.appendChild(newDownloadButtonWrapper);
        header.insertAdjacentElement("afterend", newRow);

        if (isMobile == true) {
          document
            .querySelector("#school-select-container")
            .classList.add("hide");
          document.querySelector("#school-select-label").classList.add("hide");
          document.querySelector("#school-select").innerHTML = "";

          document
            .querySelector("#class-select-container")
            .classList.add("hide");
          document.querySelector("#class-select-label").classList.add("hide");
          document.querySelector("#class-select").innerHTML = "";

          schoolFetched = false;
          document.querySelector("#school-select").disabled = false;
          document.querySelector("#class-select").disabled = false;

          document.querySelector("#oib").selectedIndex = 0;
          document.querySelector("#reason").selectedIndex = 0;
        }
      })
      .catch((error) => {
        createModalMessage(
          "<span> Došlo je do greške prilikom kreiranja potvrde. </span> <span> Molimo pokušajte ponovo. </span>",
        );
      });
  };

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    getDataFromTemplateAndCreateCert();
  });

  function createModalMessage(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    if (html.includes("grešk"))
      toast.error(tmp.textContent, { timeout: false });
    else toast.info(tmp.textContent);
  }
};
