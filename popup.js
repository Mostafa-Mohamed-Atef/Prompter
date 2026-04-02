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
    textSpan.title = 'Click to copy';
    textSpan.onclick = async () => {
      try {
        await navigator.clipboard.writeText(prompt);
        showToast('Copied to clipboard! ✅');
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    };
    li.appendChild(textSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'item-actions';

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋';
    copyBtn.className = 'copy-btn';
    copyBtn.onclick = async (e) => {
      e.stopPropagation();
      await navigator.clipboard.writeText(prompt);
      showToast('Copied to clipboard! ✅');
    };
    actionsDiv.appendChild(copyBtn);

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'edit-btn';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      toggleEditMode(li, prompt, idx, prompts);
    };
    actionsDiv.appendChild(editBtn);

    // Delete Button
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.className = 'delete-btn';
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      prompts.splice(idx, 1);
      await savePrompts(prompts);
      renderPrompts();
    };
    actionsDiv.appendChild(delBtn);

    li.appendChild(actionsDiv);
    list.appendChild(li);
  });
}

function toggleEditMode(li, oldPrompt, idx, prompts) {
  li.innerHTML = '';
  li.classList.add('editing');

  const input = document.createElement('input');
  input.type = 'text';
  input.value = oldPrompt;
  input.className = 'edit-input';
  input.onkeydown = (e) => {
    if (e.key === 'Enter') saveBtn.click();
    if (e.key === 'Escape') renderPrompts();
  };
  li.appendChild(input);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '✅';
  saveBtn.className = 'save-edit-btn';
  saveBtn.onclick = async () => {
    const newVal = input.value.trim();
    if (newVal) {
      prompts[idx] = newVal;
      await savePrompts(prompts);
    }
    renderPrompts();
  };
  li.appendChild(saveBtn);

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '❌';
  cancelBtn.className = 'cancel-edit-btn';
  cancelBtn.onclick = () => renderPrompts();
  li.appendChild(cancelBtn);

  input.focus();
}


// Add prompt logic
const saveBtn = document.getElementById('savePromptBtn');
const promptInput = document.getElementById('promptInput');

saveBtn.onclick = async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;
  const prompts = await getPrompts();
  prompts.push(prompt);
  await savePrompts(prompts);
  promptInput.value = '';
  renderPrompts();
};

// Enter key to add prompt
promptInput.onkeydown = (e) => {
  if (e.key === 'Enter') {
    saveBtn.click();
  }
};

// Toast notification function
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'show';
  setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 2000);
}

// Initial render
renderPrompts();