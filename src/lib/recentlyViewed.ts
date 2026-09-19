const STORAGE_KEY = 'nfa-recently-viewed';
const LIMIT = 8;

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(id: string) {
  try {
    const next = [id, ...getRecentlyViewed().filter((x) => x !== id)].slice(0, LIMIT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('nfa:recently-viewed'));
  } catch {
    /* storage unavailable — skip tracking */
  }
}
