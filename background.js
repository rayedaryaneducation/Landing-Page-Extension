chrome.runtime.onStartup.addListener(() => {
  const pageUrl = chrome.runtime.getURL("index.html");
  chrome.tabs.query({ url: pageUrl }, (tabs) => {
    if (tabs.length === 0) {
      chrome.tabs.create({ url: pageUrl });
    }
  });
});

chrome.windows.onCreated.addListener((window) => {
  const pageUrl = chrome.runtime.getURL("index.html");
  chrome.tabs.query({ url: pageUrl }, (tabs) => {
    if (tabs.length === 0) {
      chrome.tabs.create({ url: pageUrl, windowId: window.id });
    }
  });
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    const pageUrl = chrome.runtime.getURL("index.html");
    chrome.tabs.create({ url: pageUrl });
  }
});
