const STORAGE_KEY = 'chip8-rom-history';
const MAX_HISTORY_ITEMS = 10;

export interface RomHistoryEntry {
  name: string;
  data: string; // base64 encoded
  timestamp: number;
}

export function getHistory(): RomHistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addToHistory(name: string, data: Uint8Array): void {
  const history = getHistory();
  const base64 = uint8ArrayToBase64(data);

  // Remove existing entry with same name
  const filtered = history.filter(entry => entry.name !== name);

  // Add new entry at the beginning
  filtered.unshift({
    name,
    data: base64,
    timestamp: Date.now()
  });

  // Keep only the most recent entries
  const trimmed = filtered.slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage might be full, try removing oldest items
    if (trimmed.length > 1) {
      trimmed.pop();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
  }
}

export function getRomData(entry: RomHistoryEntry): Uint8Array {
  return base64ToUint8Array(entry.data);
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
