<template>
  <div id="donations-content" class="card content-card">
    <div class="thanks">
      Hvala na donaciji! Vaša donacija pojavit će se ispod vrlo uskoro.
    </div>
    <div class="two-boxes">
      <div class="box donationBox" style="order: 1">
        <div class="boxTitle">Kava za programera ☕</div>
        <div style="margin-top: 15px">
          <div class="amount quantity">
            Ukupno:
            <div id="totalContainer">
              <span id="total">10</span><span>kn</span>
            </div>
          </div>
          <div class="amount total">
            <span class="stepUp">➕</span>
            <span class="stepDown">➖</span>
            <div id="amount" contenteditable="true">1</div>
          </div>
        </div>
        <textarea
          id="comment"
          rows="5"
          placeholder="Vaša poruka... (nije obavezno)"
        ></textarea>
        <textarea
          id="username"
          rows="1"
          placeholder="Ime (nije obavezno)"
        ></textarea>
        <div class="donate">
          DONIRAJ
          <div class="paymentMethod">
            <div id="donate" style="margin-top: 10px">
              <img src="@/assets/img/paypal.png" alt="Paypal" title="PayPal" />
            </div>
            <div id="iban">Kopiraj IBAN<!-- HR1123400093112950706 --></div>
          </div>
        </div>
      </div>
      <div class="box whyDonate">
        <div class="boxTitle">Zašto donirati?</div>
        <div>
          Donacijom omogućujete održavanje<sup
            >?
            <div class="moreSup">dev-fee + hosting + domena</div></sup
          >i nastavak razvoja proširenja.
        </div>
        <div>
          Ako sam vam uštedio vrijeme, olakšao školovanje ili pomogao u nevolji,
          možda ste poželjeli počastiti me kavom :)
        </div>
        <div>
          Donacije su jedini izvor prihoda za nastavak rada. Hvala vam na
          korištenju proširenja i donaciji!
        </div>
        <div style="font-style: italic; font-size: 12px; text-align: left">
          Kristijan Rosandić, 4. razred ETŠ Zagreb
        </div>
      </div>
    </div>
    <div class="box donations">
      <div class="boxTitle">Donacije</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Donations",
  mounted() {
    main();
    function main() {
      let stepDown = document.getElementsByClassName("stepDown")[0] as any;
      let stepUp = document.getElementsByClassName("stepUp")[0] as any;
      let amount = document.getElementById("amount") as any;
      let total = document.getElementById("total") as any;
      let totalContainer = document.getElementById("totalContainer") as any;
      let comment = document.getElementById("comment") as any;
      let username = document.getElementById("username") as any;
      let donationsContainer = document.getElementsByClassName(
        "donations",
      )[0] as any;
      let donatePaypal = document.getElementById("donate") as any;
      let donateIBAN = document.getElementById("iban") as any;
      let quantity = 1;

      stepDown.onclick = stepClicked;
      stepUp.onclick = stepClicked;
      amount.oninput = amountEdited;
      donatePaypal.onclick = donate;
      donateIBAN.onclick = copyIban;

      if (location.hash.includes("hvala")) {
        let ty = document.getElementsByClassName("thanks")[0] as HTMLElement;
        ty.style.display = "block";
        setTimeout(() => {
          ty.classList.add("thanksVisible");
        }, 50);
      }

      let donationsXhr = new XMLHttpRequest();
      donationsXhr.open(
        "GET",
        "https://storage.googleapis.com/e-dnevnik-plus.appspot.com/donacije.json",
      );
      donationsXhr.send();
      donationsXhr.onload = donationsLoaded;

      function donationsLoaded() {
        let donations =
          donationsXhr.response && JSON.parse(donationsXhr.response);
        let keys = donations && Object.keys(donations).sort().reverse(),
          i = 0;
        if (!keys) {
          let empty = document.createElement("div");
          empty.classList.add("emptyDonations");
          empty.textContent = "Nema donacija, budite prvi!";
          donationsContainer.appendChild(empty);
          return false;
        }

        (function addDonation() {
          let key = keys[i];
          let data = donations[key];
          let username = data.username
            ? data.username + " je donirao/la"
            : "Anonimna osoba je donirala";
          let date = new Date(parseInt(key));
          let donation = document.createElement("div");
          let title = document.createElement("div") as any;
          let titleUser = document.createElement("div") as any;
          let dateContainer = document.createElement("div");
          let comment = document.createElement("div");

          donation.className = "donation";
          title.className = "boxTitle";
          titleUser.className = "titleUser";
          comment.className = "comment";
          dateContainer.className = "donationDate";

          titleUser.innerHTML =
            username + " &nbsp" + "☕".repeat(parseInt(data.coffees));
          dateContainer.textContent =
            [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(
              ". ",
            ) + ".";
          comment.textContent = data.comment;

          title.appendChild(dateContainer);
          title.appendChild(titleUser);
          donation.appendChild(title);

          if (data.comment) {
            donation.appendChild(comment);
          } else {
            title.style.border = title.style.padding = "none";
            title.style.margin = titleUser.style.margin = 0;
          }

          donationsContainer.appendChild(donation);

          ++i != keys.length && i < 10 && setTimeout(addDonation, 250);
        })();
      }

      function amountEdited(this: any) {
        let newAmount = parseInt(this.textContent.replace(/\D+/g, ""));
        newAmount = (newAmount <= 10000 && newAmount) || 10000;
        this.textContent = newAmount;
        total.textContent = (newAmount * 10).toFixed(0);
      }

      function stepClicked(this: any) {
        let raise = this == stepUp;
        let currentAmount = parseInt(amount.textContent);

        quantity = parseInt(amount.textContent) + (raise ? 1 : -1);

        if (currentAmount > 9999 && raise) {
          return false;
        }
        if (!raise && quantity < 1) {
          quantity = 1;
          return false;
        }

        totalContainer.style.opacity = amount.style.opacity = 0;
        totalContainer.style.transform =
          "translateY(" + (raise ? "" : "-") + "10px)";
        amount.style.transform = "translateX(" + (raise ? "-" : "") + "10px)";

        setTimeout(() => {
          let newAmount = quantity;
          amount.textContent = newAmount;
          total.textContent = (newAmount * 10).toFixed(0);
          totalContainer.style.transition = amount.style.transition = "0ms";
          totalContainer.style.transform =
            "translateY(" + (raise ? "-" : "") + "10px)";
          amount.style.transform = "translateX(" + (raise ? "" : "-") + "10px)";
          setTimeout(() => {
            totalContainer.style.transition = amount.style.transition = "350ms";
            totalContainer.style.transform = "translateY(0)";
            amount.style.transform = "translateX(0)";
            totalContainer.style.opacity = amount.style.opacity = 1;
          }, 50);
        }, 350);
      }

      function sendInputs() {
        let mailUrl =
          "https://script.google.com/macros/s/AKfycbw5Fs3Y-Ht3Cs3PMdQhpUW_-Xd_poar4w5C3ae1SmNnfTIUKbwm/exec";
        let mailXhr = new XMLHttpRequest();
        let data = URIencoder({
          "Ime: ": username.value,
          "Komentar: ": comment.value,
          "Kava: ": amount.textContent,
          formDataNameOrder: '["Kava: ","Komentar: ","Ime: "]',
          formGoogleSend: "",
          formGoogleSheetName: "responses",
        });

        mailXhr.open("POST", mailUrl);
        mailXhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded",
        );
        mailXhr.send(data);
      }

      function copyIban() {
        const iban = "HR1123400093112950706";

        if (!navigator.clipboard) {
          var textArea = document.createElement("textarea");
          textArea.value = iban;

          // Avoid scrolling to bottom
          textArea.style.top = "0";
          textArea.style.left = "0";
          textArea.style.position = "fixed";

          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          try {
            var successful = document.execCommand("copy");
            var msg = successful ? "successful" : "unsuccessful";
            console.log("Fallback: Copying text command was " + msg);
          } catch (err) {
            console.error("Fallback: Oops, unable to copy", err);
          }

          document.body.removeChild(textArea);
          return;
        }

        navigator.clipboard.writeText(iban).then(
          function () {
            console.log("Async: Copying to clipboard was successful!");
          },
          function (err) {
            console.error("Async: Could not copy text: ", err);
          },
        );

        donateIBAN.textContent = "Kopirano!";
        donateIBAN.style.color = "green";
        setTimeout(() => {
          donateIBAN.textContent = "Kopiraj IBAN";
          donateIBAN.style.color = "black";
        }, 2000);

        sendInputs();
      }

      function donate() {
        donatePaypal.removeEventListener("click", donate);

        let timestamp = Date.now();
        let overlay = document.createElement("div");
        overlay.className = "overlay";
        document.body.appendChild(overlay);

        /* https://developer.paypal.com/docs/paypal-payments-standard/integration-guide/Appx-websitestandard-htmlvariables/ */

        let queryStringParams = {
          image_url: "https://ednevnik.plus/assets/images/paypal-logo.png",
          cmd: "_xclick",
          business: "kristijan.ros@gmail.com",
          amount: parseFloat(total.textContent) / 6.6,
          currency_code: "USD",
          item_name: "Broj kava: " + quantity,
          lc: "en-HR",
          custom: timestamp,
          charset: "utf-8",
          no_shipping: 1,
          no_note: 1,
          return: "https://ednevnik.plus/donacije#hvala",
          notify_url: "https://e-dnevnik-plus.firebaseapp.com/paypal-success",
          cancel_return: "https://ednevnik.plus/donacije",
        };

        //location.href = "https://www.paypal.com/cgi-bin/webscr?" + URIencoder(queryStringParams);

        /* Firebase */
        let userInfoUrl =
          "https://e-dnevnik-plus.firebaseapp.com/pending-donations";
        let userInfoXhr = new XMLHttpRequest();
        let userInfo = URIencoder({
          ime: username.value,
          komentar: comment.value,
          coffees: amount.textContent,
          id: timestamp,
        });
        userInfoXhr.open("POST", userInfoUrl);
        userInfoXhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded",
        );
        userInfoXhr.send(userInfo);

        sendInputs();

        setTimeout(() => {
          location.href =
            "https://www.paypal.com/cgi-bin/webscr?" +
            URIencoder(queryStringParams);
        }, 500);
      }
    }

    function URIencoder(data: any) {
      return Object.keys(data)
        .map((k) => {
          return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        })
        .join("&");
    }
  },
});
</script>

<style lang="scss">
#donations-content {
  .two-boxes .box {
    width: calc(50% - 15px);
  }

  .quantity {
    float: right;
    width: 45%;
    text-align: center;
  }

  .amount.total {
    width: 50%;
    text-align: center;
  }

  .box {
    border-radius: 10px;
    padding: 35px 15px;
    color: #555;
    line-height: 25px;
    @extend .card;
  }

  .boxTitle {
    font-size: 18px;
    color: #463e3e;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .box div:not(:first-of-type) {
    margin-bottom: 10px;
  }

  sup {
    position: relative;
    padding: 6px 7px 12px 3px;
    font-size: 12px;
    line-height: 0;
  }

  sup:hover {
    cursor: default;
    text-decoration: underline;
  }

  sup:hover .moreSup {
    visibility: visible;
    opacity: 1;
    top: -25px;
    transition: opacity 250ms, 250ms top;
  }

  .moreSup {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    border-radius: 10px;
    box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
    background: #fff;
    transform: translateX(-50%);
    top: -10px;
    left: 0;
    padding: 12px;
    min-width: 200px;
    text-align: center;
    transition: opacity 250ms, 250ms top, visibility 1ms 250ms;
  }

  #amount {
    outline: none;
    width: 45%;
    margin: 0 auto;
    transition: 350ms;
  }

  .amount {
    border-radius: 50px;
    box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
    user-select: none;
  }

  .amount:first-of-type {
    padding: 0 15px;
  }

  .stepDown,
  .stepUp {
    font-size: 10px;
    padding: 0 10%;
  }

  .stepDown:hover,
  .stepUp:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.062);
    transition: background-color 250ms;
  }

  .stepUp {
    float: right;
    border-left: 1px solid #ccc;
    border-radius: 0 50px 50px 0;
  }

  .stepDown {
    float: left;
    border-right: 1px solid #ccc;
    border-radius: 50px 0 0 50px;
  }

  #totalContainer {
    display: inline-block;
    font-weight: bold;
    transition: 350ms;
  }

  #total {
    padding-right: 3px;
  }

  textarea {
    border-radius: 10px;
    box-sizing: border-box;
    border: none;
    resize: vertical;
    box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
    outline: none;
    margin: 10px 0 3px;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px !important;
    font-style: italic;
    font-family: "Trebuchet MS", "Helvetica", sans-serif;
  }

  #username {
    width: 50%;
  }

  .donate {
    position: relative;
    background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(0, 0, 0, 0.4) 100%
      ),
      linear-gradient(to right, #2296da 0%, #235694 50%, #2296da 100%);
    background-position: 0 0;
    background-size: 200% 100%;
    border-radius: 10px;
    color: #fff;
    padding: 5px 65px 5px 15px;
    text-shadow: 1px 1px 5px #666;
    margin-top: 10px;
    transition: 800ms;
    letter-spacing: 1px;
    float: right;
    width: 40%;
  }

  .donate:after {
    color: #003527;
    content: "❤";
    font-size: 18px;
    padding: 10px 0;
    padding-left: 15px;
    position: absolute;
    right: 15px;
    top: -5px;
    transition: 600ms 200ms;
  }

  .donate:hover {
    background-position: -100% 0;
    cursor: pointer;
  }

  .donate:hover:after {
    color: #ff2626;
    text-shadow: 0 0 10px #000;
  }

  .emptyDonations {
    border-radius: 10px;
    text-align: center;
    font-size: 25px;
    color: #ccc;
    border: 2px dashed #ccc;
    padding: 50px;
    transform: scale(0.3);
    opacity: 0;
    animation: emptyDonors 500ms forwards;
  }

  @keyframes emptyDonors {
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .donations {
    min-height: 185px;
    margin-bottom: 70px;
  }

  .donation {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    animation: showAnimation 1s forwards;
  }

  @keyframes showAnimation {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  .comment {
    font-style: italic;
    columns: gray;
  }

  .titleUser {
    max-width: 85%;
  }

  .donationDate {
    font-size: 12px;
    color: gray;
    float: right;
  }

  .donation .boxTitle {
    padding: 0;
  }

  .thanks {
    display: none;
    opacity: 0;
    transform: scale(0.1);
    background: #e4ffe4;
    border: 2px dashed #5eb95e;
    color: #008000;
    border-radius: 10px;
    padding: 15px;
    margin-top: 35px;
    text-align: center;
    font-size: 18px;
  }

  .thanksVisible {
    opacity: 1;
    transform: scale(1);
    transition: 2s;
  }

  .overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    animation: 500ms disappear forwards;
  }

  @keyframes disappear {
    100% {
      background-color: white;
    }
  }

  .paymentMethod div {
    padding: 8px;
    color: black;
    text-shadow: none;
    transition: 250ms;
  }

  .paymentMethod div:hover {
    background-color: gainsboro;
  }

  .donate:hover .paymentMethod {
    visibility: visible;
    opacity: 1;
    transition: opacity 250ms;
    transform: scaleY(1);
  }

  .paymentMethod {
    text-align: center;
    visibility: hidden;
    opacity: 0;
    transform-origin: top;
    transform: scaleY(0);
    position: absolute;
    border-radius: 10px;
    box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
    min-width: 150px;
    background: #fff;
    right: 0;
    top: 35px;
    transition: opacity 250ms, visibility 1ms 250ms, transform 350ms;
  }

  .two-boxes {
    display: flex;
    justify-content: space-between;
    margin: 35px 0 50px;
  }
}
</style>
