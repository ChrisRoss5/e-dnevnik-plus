let logoutCleared = false;

function onLogout(e: MouseEvent) {
  if (logoutCleared) return;
  else e.preventDefault();
  chrome.storage.sync.remove(StorageKeys.login, () => {
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
  chrome.storage.sync.get(StorageKeys.login, (res) => {
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
  loginBtn.onclick = async (e: MouseEvent) => {
    if (loginSet) return;
    if ((document.querySelector("#cbx") as HTMLInputElement).checked) {
      e.preventDefault();
      const login = {
        username: usernameEl.value.trim(),
        password: passwordEl.value,
      };
      const userId = await getSHA256Hash(login.username.replace(/@.*/, ""));
      chrome.storage.sync.set(
        { [StorageKeys.login]: login, [StorageKeys.userId]: userId },
        () => {
          loginSet = true;
          loginBtn.click();
        },
      );
    }
  };
}
