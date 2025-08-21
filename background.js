chrome.runtime.onStartup.addListener(() => {
  // Use `chrome.runtime.getURL` to get the full URL of your extension page.
  const pageUrl = chrome.runtime.getURL("index.html");

  // Create a new tab with your extension's landing page.
  chrome.tabs.create({ url: pageUrl });
});