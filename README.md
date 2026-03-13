## Prompter

Prompter is a Chrome extension that lets you store, manage, and quickly reuse prompts for AI chat models. It streamlines your workflow by keeping your favorite prompts one click away in a simple popup.

### Features

- **Save prompts**: Add any prompt to your personal library.
- **Copy to clipboard**: Use the 📋 button to copy a prompt to your clipboard with one click.
- **Quickly input prompts**: Click a prompt in the list to send it to the active AI chat tab (via the content script), or copy it and paste wherever you like.
- **Edit & delete**: Update prompts with the ✏️ button or remove them with the 🗑️ button.
- **Local storage**: All prompts are stored locally in your browser using `chrome.storage.local`.

### Installation

1. Clone or download this repository to your computer.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right).
4. Click **Load unpacked** and select the project directory.
5. You should now see the **Prompter** extension in your extensions bar.

### Usage

1. Navigate to any supported AI chat page (for example, ChatGPT or another model you use).
2. Click the **Prompter** extension icon in your browser toolbar to open the popup.
3. Type a prompt in the input field and click **Save** to add it to your list.
4. In the prompts list:
   - Click the **prompt text** to send it directly to the active tab (handled by the content script).
   - Click **📋** to copy the prompt text to your clipboard.
   - Click **✏️** to edit the prompt.
   - Click **🗑️** to delete the prompt.

### Permissions

- **`storage`**: Save prompts locally using `chrome.storage.local`.
- **`activeTab`**, **`scripting`** (or equivalent): Communicate with and inject scripts into the active tab so prompts can be sent into the chat box.

### Development

- Popup behavior and prompt management are implemented in `popup.js`.
- Prompts are stored as a simple array of strings under the `prompts` key in `chrome.storage.local`.
- The popup uses a small list UI with buttons for copy, edit, and delete actions.

### License

This project is licensed under the MIT License. See `LICENSE` for details.