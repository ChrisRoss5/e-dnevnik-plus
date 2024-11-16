async function update501() {
  chrome.storage.sync.set({ newUpdates: true, updateNotif: true });
  return new Promise<void>((resolve) => {
    chrome.storage.local.get((null as unknown) as undefined, (state) => {
      if (!state || !state.users) return resolve();
      state.users.forEach((user: any) => {
        const subjectsSettings = user.settings.subjectsSettings;
        const showColors: boolean = subjectsSettings.subjectColors;
        delete subjectsSettings.subjectColors;
        user.settings.subjectsSettings = {
          ...subjectsSettings,
          subjectLineColors: showColors,
          subjectColumnColors: showColors,
        };
      });
      chrome.storage.local.set(state, resolve);
    });
  });
}

function update502() {
  chrome.storage.sync.set({ newUpdates: true, updateNotif: true });
  return new Promise<void>((resolve) => {
    chrome.storage.local.get((null as unknown) as undefined, (state) => {
      if (!state || !state.users) return resolve();
      state.users.forEach((user: any) => {
        user.settings.websitesSettings = user.settings.websitesSettings.filter(
          (website: any) =>
            !["Srednja.hr", "Školski e-Rudnik"].includes(website.name),
        );
      });
      chrome.storage.local.set(state, resolve);
    });
  });
}

function update51() {
  return new Promise<void>((resolve) => {
    chrome.storage.local.get((null as unknown) as undefined, (state) => {
      if (!state || !state.users) return;
      state.users.forEach((user: any) => {
        user.settings.classTabsOrder = (user.settings
          .classTabsOrder as string[]).filter((t) => t != "Vladanja");
      });
      chrome.storage.local.set(state, resolve);
    });
  });
}

function update52() {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.get("login", (state) => {
      const username = state.login?.username?.trim();
      if (!username) return;
      getSHA256Hash(username.replace(/@.*/, "")).then((userId) => {
        chrome.storage.sync.set({ userId }, resolve);
      });
    });
  });
}
