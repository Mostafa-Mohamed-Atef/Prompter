chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch((error) => console.error(error));

async function updateUIBehavior(tabId, windowId) {
  try {
    const window = await chrome.windows.get(windowId);
    if (window.type === 'app' || window.type === 'popup') {
      // For PWAs or popups, use popup UI
      await chrome.action.setPopup({ tabId, popup: 'popup.html' });
    } else {
      // For normal browser windows, clear popup so onClicked fires
      await chrome.action.setPopup({ tabId, popup: '' });
    }
  } catch (err) {
    console.error("Error setting UI behavior:", err);
  }
}

// Update behavior on tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateUIBehavior(activeInfo.tabId, activeInfo.windowId);
});

// Update behavior on window focus change
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  chrome.tabs.query({ active: true, windowId }, (tabs) => {
    if (tabs.length > 0) {
      updateUIBehavior(tabs[0].id, windowId);
    }
  });
});

// Update behavior on tab creation/update
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    updateUIBehavior(tabId, tab.windowId);
  }
});

// Initial setup for existing tabs to ensure correct state after extension reload
chrome.tabs.query({ active: true }, (tabs) => {
  tabs.forEach(tab => {
    updateUIBehavior(tab.id, tab.windowId);
  });
});

// Handle action click for normal windows to open the side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
