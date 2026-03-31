// Helper to get prompts from storage
function getPrompts() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['prompts'], (result) => {
      resolve(result.prompts || []);
    });
  });
}

// Helper to save prompts to storage
function savePrompts(prompts) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ prompts }, resolve);
  });
}

// Render prompts list
async function renderPrompts() {
  const prompts = await getPrompts();
  const list = document.getElementById('promptsList');
  list.innerHTML = '';
  prompts.forEach((prompt, idx) => {
    const li = document.createElement('li');
    li.className = 'prompt-item';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = prompt;
    textSpan.className = 'prompt-text';
    textSpan.onclick = () => sendPrompt(prompt);
    li.appendChild(textSpan);

    // Copy to clipboard button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋';
    copyBtn.className = 'copy-btn';
    copyBtn.title = 'Copy prompt to clipboard';
    copyBtn.onclick = async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(prompt);
      } catch (err) {
        console.error('Failed to copy prompt to clipboard:', err);
      }
    };
    li.appendChild(copyBtn);

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'edit-btn';
    editBtn.onclick = async (e) => {
      e.stopPropagation();
      const newPrompt = promptEdit(prompt);
      if (newPrompt !== null && newPrompt.trim() !== '') {
        prompts[idx] = newPrompt.trim();
        await savePrompts(prompts);
        renderPrompts();
      }
    };
    li.appendChild(editBtn);

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.className = 'delete-btn';
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      prompts.splice(idx, 1);
      await savePrompts(prompts);
      renderPrompts();
    };
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

// Add prompt
document.getElementById('savePromptBtn').onclick = async () => {
  const input = document.getElementById('promptInput');
  const prompt = input.value.trim();
  if (!prompt) return;
  const prompts = await getPrompts();
  prompts.push(prompt);
  await savePrompts(prompts);
  input.value = '';
  renderPrompts();
};

// Edit prompt (inline prompt)
function promptEdit(oldPrompt) {
  return prompt('Edit prompt:', oldPrompt);
}

// Close sidebar
document.getElementById('closeSidebarBtn').onclick = () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' });
    }
  });
};

// Send prompt to content script
function sendPrompt(prompt) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'inputPrompt', prompt });
    } else {
      console.error('No active tab found.');
    }
  });
}

// Initial render
renderPrompts();