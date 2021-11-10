export type FetchedInfo = {
  html: string;
  url: string;
};

function chromeMessanger(message: "fetch", payload: any): Promise<FetchedInfo>;
function chromeMessanger(message: string, payload: any): any {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ message, payload }, resolve);
  });
}

export default chromeMessanger;
