<template>
  <div class="card content-card">
    <h2>Deinstalacija je završena</h2>
    Hvala vam što ste koristili e-Dnevnik Plus.
    <div class="bye">
      <div class="messageSent">Poslano!</div>
      <form
        action="https://script.google.com/macros/s/AKfycbw5Fs3Y-Ht3Cs3PMdQhpUW_-Xd_poar4w5C3ae1SmNnfTIUKbwm/exec"
        method="POST"
      >
        <div style="padding-top: 30px">
          <label class="radio">
            <input type="radio" name="Option: " value="PERFECT" />
            <span>Školovanje je završeno i više mi ne treba.</span>
          </label>
          <label class="radio">
            <input type="radio" name="Option: " value="NOT GOOD" />
            <span>Ne sviđa mi se, očekivao sam više.</span>
          </label>
          <label class="radio">
            <input type="radio" name="Option: " value="ERROR" />
            <span>Ne radi ispravno.</span>
          </label>
        </div>
        <div class="msgNsubmit">
          <textarea class="card message" name="Comment: " type="text"></textarea>
          <a class="submit" type="submit">Pošalji</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck - copied from previous version
import { defineComponent } from "vue";

export default defineComponent({
  name: "Uninstalled",
  mounted() {
/*     window.onbeforeunload = function (e) {
      return "Molim ispunite upitnik.";
    };
 */
    window.onload = function () {
      let radios = document.getElementsByName("Option: ");
      let message = document.getElementsByClassName("message")[0];
      let submitButton = document.getElementsByClassName("submit")[0];
      let msgNsubmit = document.getElementsByClassName("msgNsubmit")[0];
      let needComment = false;
      let msgNsubmitOpened = false;

      for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("click", showCommentAndSubmitButton);
      }

      submitButton.addEventListener("click", handleFormSubmit, false);
      message.addEventListener("input", changeSubmitButton);

      function changeSubmitButton() {
        if (message.value || !needComment) {
          submitButton.classList.add("enabled");
        } else {
          submitButton.classList.remove("enabled");
        }
      }

      function showCommentAndSubmitButton() {
        if (!msgNsubmitOpened) {
          msgNsubmit.style.display = "block";
          setTimeout(() => {
            msgNsubmit.style.height = "250px";
            setTimeout(() => {
              msgNsubmit.style.opacity = 1;
            }, 250);
          }, 10);
          msgNsubmitOpened = true;
        }
        if (this.value == "PERFECT") {
          message.placeholder = "Dodaj komentar...";
          needComment = false;
        } else if (this.value == "NOT GOOD") {
          message.placeholder = "Dodaj prijedlog...";
          needComment = true;
        } else {
          message.placeholder = "Objasni što nije ispravno...";
          needComment = true;
        }
        changeSubmitButton();
      }
    };

    function getFormData(form) {
      var elements = form.elements;
      var honeypot;

      var fields = Object.keys(elements)
        .filter(function (k) {
          if (elements[k].name === "honeypot") {
            honeypot = elements[k].value;
            return false;
          }
          return true;
        })
        .map(function (k) {
          if (elements[k].name !== undefined) {
            return elements[k].name;
          } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
          }
        })
        .filter(function (item, pos, self) {
          return self.indexOf(item) == pos && item;
        });

      var formData = {};
      fields.forEach(function (name) {
        var element = elements[name];
        formData[name] = element.value;
        if (element.length) {
          var data = [];
          for (var i = 0; i < element.length; i++) {
            var item = element.item(i);
            if (item.checked || item.selected) {
              data.push(item.value);
            }
          }
          formData[name] = data.join(", ");
        }
      });

      formData.formDataNameOrder = JSON.stringify(fields);
      formData.formGoogleSheetName = form.dataset.sheet || "responses";
      formData.formGoogleSend = form.dataset.email || "";
      return {
        data: formData,
        honeypot: honeypot,
      };
    }

    function handleFormSubmit(event) {
      let contactForm = document.getElementsByTagName("form")[0];
      let formSubmited = document.getElementsByClassName("messageSent")[0];
      contactForm.style.opacity = contactForm.style.maxHeight = 0;
      setTimeout(() => {
        formSubmited.style.height = formSubmited.style.width = "auto";
        formSubmited.style.padding = "70px 0 70px";
        formSubmited.style.opacity = 1;
        contactForm.remove();
        window.onbeforeunload = function () {
          null;
        };
      }, 500);

      event.preventDefault();
      var formData = getFormData(contactForm);
      var data = formData.data;

      if (formData.honeypot) {
        return false;
      }

      var url = contactForm.action;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      var encoded = Object.keys(data)
        .map(function (k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        })
        .join("&");
      xhr.send(encoded);
    }

    window.addEventListener(
      "keydown",
      function (e) {
        if (
          e.keyIdentifier == "U+000A" ||
          e.keyIdentifier == "Enter" ||
          e.keyCode == 13
        ) {
          if (e.target.nodeName == "INPUT" && e.target.type == "text") {
            e.preventDefault();
            return false;
          }
        }
      },
      true,
    );
  },
});
</script>

<style lang="scss" scoped>
.radio {
  margin: 16px 10px 25px;
  display: block;
  cursor: pointer;
}

.radio input {
  display: none;
}

.radio input + span {
  line-height: 35px;
  height: 35px;
  padding-left: 60px;
  display: block;
  position: relative;
}

.radio input + span:before,
.radio input + span:after {
  content: "";
  width: 35px;
  height: 35px;
  display: block;
  border-radius: 50%;
  left: 0;
  top: 0;
  position: absolute;
}

.radio input + span:before {
  background: #d1d7e3;
  transition: background-color 0.2s ease,
    transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 2);
}

.radio input + span:after {
  background: #fff;
  transform: scale(0.78);
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.4);
}

.radio input:checked + span:before {
  transform: scale(1.04);
  background: $plus-color;
}

.radio input:checked + span:after {
  transform: scale(0.4);
  transition: transform 0.3s ease;
}

.radio:hover input + span:before {
  transform: scale(0.82);
}

.radio:hover input + span:after {
  transform: scale(0.74);
}

.radio:hover input:checked + span:after {
  transform: scale(0.4);
}

.bye {
  text-align: left;
  font-weight: 100;
  line-height: 30px;
}

form {
  max-height: 1000px;
  transition: 500ms;
}

.message {
  width: 95%;
  height: 150px;
  margin: 15px 0 15px 0;
  padding: 15px;
}

form textarea {
  font-size: 18px;
  resize: none;
  border: none;
}

form textarea:hover {
  cursor: text;
}

form *:focus {
  outline: none;
  border-color: #235694;
}

.submit.enabled {
  font-size: 25px;
  padding: 5px 20px 5px 20px;
  border: 2px solid #999;
  color: #555555;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  margin: 5px;
}

.submit.enabled:hover {
  cursor: pointer;
  border-color: #46a246;
  color: #46a246;
}

.submit:not(.enabled) {
  color: gray;
  pointer-events: none;
}

.msgNsubmit {
  display: none;
  text-align: center;
  opacity: 0;
  height: 0;
  transition: 250ms;
}

.messageSent {
  width: 0;
  height: 0;
  opacity: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  transition: 500ms;
}

#footer {
  line-height: 1.5;
  font-weight: bold;
  text-align: center;
  padding-top: 25px;
  padding-bottom: 25px;
}
</style>
