// Progress store: earned trophies live in localStorage, never leave the browser.
// Export downloads them as JSON; import reads a file back and validates it.

export const STORE_KEY = 'gta6-trophy-guide-progress-v1';
export const SPOILER_KEY = 'gta6-trophy-guide-spoilers-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSpoilerSetting() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

export function saveSpoilerSetting(on) {
  localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
}

export function exportProgress(earned) {
  const payload = { game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function parseImportFile(text) {
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('not a progress file');
  const clean = ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55);
  if (clean.length === 0 && ids.length > 0) throw new Error('no valid trophy ids');
  return new Set(clean);
}

export function resetProgress() {
  localStorage.removeItem(STORE_KEY);
  return new Set();
}
