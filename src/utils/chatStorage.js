const STORAGE_KEY = 'chat_messages';
const MAX_MESSAGES = 30;

export function saveMessages(messages) {
  const trimmed = messages.slice(-MAX_MESSAGES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function loadMessages() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function clearMessages() {
  localStorage.removeItem(STORAGE_KEY);
}
