chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'inputPrompt') {
    inputPromptToChat(request.prompt);
  }
});

function inputPromptToChat(prompt) {
  // For ChatGPT (chat.openai.com)
  const textarea = document.querySelector('textarea');
  if (!textarea) return;
  textarea.value = prompt;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));

  // Try to find the send button and click it
  const sendBtn = textarea.parentElement.querySelector('button');
  if (sendBtn) {
    sendBtn.click();
  } else {
    // Fallback: simulate Enter key
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
  }
} 