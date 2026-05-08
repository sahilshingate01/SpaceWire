const CACHE_PREFIX = 'news_cache_';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in ms

export function saveToCache(category, articles) {
  const payload = {
    articles,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_PREFIX + category, JSON.stringify(payload));
}

export function getFromCache(category) {
  const raw = localStorage.getItem(CACHE_PREFIX + category);
  if (!raw) return null;

  try {
    const { articles, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL) {
      return articles;
    }
    // Cache expired — remove it
    localStorage.removeItem(CACHE_PREFIX + category);
    return null;
  } catch {
    localStorage.removeItem(CACHE_PREFIX + category);
    return null;
  }
}

export function clearCache() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
