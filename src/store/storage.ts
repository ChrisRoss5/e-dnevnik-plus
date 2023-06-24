/* https://developer.chrome.com/docs/extensions/reference/storage/ */
import { jsonClone } from "@/scripts/utils";
import { State } from "./state";

const defaultState: State = {
  settings: {
    darkTheme: false,
    transitions: true,
    navbarCollapsed: false,
  },
  users: [],
};

function chromeLocalStorage(): Promise<State>;
function chromeLocalStorage(data: State): Promise<void>;
function chromeLocalStorage(data?: State): Promise<State | void> {
  return new Promise((resolve) => {
    if (window.devTestMode) return resolve(testState);
    (chrome.storage.local[data ? "set" : "get"] as any)(
      data ? jsonClone(data) : null,
      (savedState: any) => {
        if (data) resolve();
        else resolve((savedState.users ? savedState : defaultState) as State);
      },
    );
  });
}

export default chromeLocalStorage;

// TODO!: delete testing state

const testState: any = {}