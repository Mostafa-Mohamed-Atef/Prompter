let sidebar = null;
let toggleButton = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidebar') {
    toggleSidebar();
  } else if (request.action === 'inputPrompt') {
    inputPromptToChat(request.prompt);
  }
});

function createToggleButton() {
  if (toggleButton) return;
  toggleButton = document.createElement('button');
  toggleButton.id = 'prompter-toggle-btn';
  toggleButton.innerHTML = '⚡';
  toggleButton.style.cssText = `
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 32px;
    height: 48px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px 0 0 8px;
    cursor: pointer;
    z-index: 999999;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: -2px 0 5px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;
  toggleButton.onclick = toggleSidebar;
  document.body.appendChild(toggleButton);
}

function toggleSidebar() {
  if (!sidebar) {
    sidebar = document.createElement('iframe');
    sidebar.src = chrome.runtime.getURL('popup.html');
    sidebar.id = 'prompter-sidebar';
    sidebar.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 320px;
      height: 100vh;
      border: none;
      z-index: 1000000;
      box-shadow: -2px 0 10px rgba(0,0,0,0.1);
      background: white;
      transition: transform 0.3s ease-in-out;
      transform: translateX(100%);
    `;
    document.body.appendChild(sidebar);
    setTimeout(() => {
      sidebar.style.transform = 'translateX(0)';
      if (toggleButton) toggleButton.style.display = 'none';
    }, 10);
  } else {
    const isHidden = sidebar.style.transform === 'translateX(100%)';
    sidebar.style.transform = isHidden ? 'translateX(0)' : 'translateX(100%)';
    if (toggleButton) {
      toggleButton.style.display = isHidden ? 'none' : 'flex';
    }
  }
}

// Create toggle button on load
if (document.readyState === 'complete') {
  createToggleButton();
} else {
  window.addEventListener('load', createToggleButton);
}

function inputPromptToChat(prompt) {
  // Try finding common textareas on AI chat sites
  const textarea = document.querySelector('textarea, [contenteditable="true"]');
  if (!textarea) return;

  if (textarea.isContentEditable) {
    textarea.innerText = prompt;
  } else {
    textarea.value = prompt;
  }
  
  textarea.dispatchEvent(new Event('input', { bubbles: true }));

  // Find the button (usually next to or inside the container)
  setTimeout(() => {
    const sendBtn = textarea.parentElement?.querySelector('button') || document.querySelector('button[data-testid*="send"], button[aria-label="Send message"]');
    if (sendBtn) {
      sendBtn.click();
    }
  }, 100);
}