declare namespace chrome.runtime {
  interface Message {
    name: "SEND_ANALYTICS_EVENT" | "GET_ACTIVE_RULES";
    params?: any;
  }

  function sendMessage(
    message: Message,
    sendResponse: (...args: any[]) => any,
  ): void;
}