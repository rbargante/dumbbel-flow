/**
 * Exercise Demo Cache Service
 * Fetches exercise demos from wger.de API with Cache Storage + IndexedDB for offline support.
 */

const CACHE_NAME = 'exercise-demos-v1';
const DB_NAME = 'exercise-demos';
const DB_STORE = 'demos';
const DB_VERSION = 1;

export interface CachedDemo {
  exerciseName: string;
  type: 'image' | 'video';
  url: string;       // original URL
  cachedUrl?: string; // blob URL from cache
  fetchedAt: number;
}

// ── IndexedDB helpers ──

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'exerciseName' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getFromDB(key: string): Promise<CachedDemo | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const store = tx.objectStore(DB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch { return null; }
}

async function saveToDB(entry: CachedDemo): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(entry);
  } catch {}
}

async function getAllFromDB(): Promise<CachedDemo[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch { return []; }
}

async function clearDB(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).clear();
  } catch {}
}

// ── Cache Storage helpers ──

async function cacheAsset(url: string): Promise<boolean> {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(url);
    return true;
  } catch { return false; }
}

async function getCachedAssetUrl(url: string): Promise<string | null> {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (!response) return null;
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch { return null; }
}

// ── Exercise name normalization for API search ──

const SEARCH_TERM_MAP: Record<string, string> = {
  'flat dumbbell bench press': 'dumbbell bench press',
  'incline dumbbell bench press': 'incline dumbbell press',
  'seated dumbbell shoulder press': 'dumbbell shoulder press',
  'dumbbell overhead triceps extension': 'triceps extension dumbbell',
  'one-arm dumbbell row': 'one arm dumbbell row',
  'chest-supported dumbbell row': 'chest supported row',
  'dumbbell rear delt raise': 'rear delt fly',
  'standing dumbbell calf raise': 'standing calf raise',
  'dumbbell romanian deadlift': 'romanian deadlift dumbbell',
  'dumbbell hip thrust': 'hip thrust',
  'ez bar floor press': 'floor press',
  'close-grip ez bar press': 'close grip bench press',
  'ez bar skullcrusher': 'skull crusher',
  'ez bar bent-over row': 'bent over barbell row',
  'ez bar curl': 'barbell curl',
  'reverse ez bar curl': 'reverse curl',
  'ez bar romanian deadlift': 'romanian deadlift',
  'cable triceps pushdown': 'triceps pushdown',
  'chin-ups / pull-ups': 'pull ups',
  'one-arm cable row': 'cable row',
  'cable face pull': 'face pull',
  'dumbbell / ez bar curl': 'biceps curl',
  'leg extension': 'leg extension',
  'leg curl': 'leg curl',
  'cable row': 'seated cable row',
  'goblet squat': 'goblet squat',
  'bulgarian split squat': 'bulgarian split squat',
  'posterior pelvic tilt hold': 'pelvic tilt',
  'dead bug': 'dead bug',
  'glute bridge hold': 'glute bridge',
  'wall slides': 'wall slides',
  'chin tucks': 'chin tuck',
  'single-leg stand': 'single leg stand',
  'farmer carry': 'farmer walk',
  'bird dog': 'bird dog',
  'cat–cow spinal mobility': 'cat cow stretch',
  'hip flexor stretch': 'hip flexor stretch',
  'front plank': 'plank',
  'side plank': 'side plank',
  'incline dumbbell press': 'incline dumbbell press',
  'standing dumbbell overhead press': 'overhead press dumbbell',
};

function getSearchTerm(exerciseName: string): string {
  const key = exerciseName.toLowerCase().trim();
  return SEARCH_TERM_MAP[key] || key;
}

// ── Wger API ──

interface WgerImage {
  image: string;
  is_main: boolean;
}

interface WgerVideo {
  video: string;
}

interface WgerExercise {
  id: number;
  name: string;
}

async function searchWgerExercise(term: string): Promise<number | null> {
  try {
    const res = await fetch(`https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(term)}&language=english&format=json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const suggestions = data?.suggestions || [];
    if (suggestions.length > 0 && suggestions[0]?.data?.id) {
      return suggestions[0].data.id;
    }
    return null;
  } catch { return null; }
}

async function getWgerImages(exerciseId: number): Promise<string | null> {
  try {
    const res = await fetch(`https://wger.de/api/v2/exerciseimage/?exercise_base=${exerciseId}&format=json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.results || [];
    // Prefer main image
    const main = results.find((r: WgerImage) => r.is_main);
    const img = main || results[0];
    return img?.image || null;
  } catch { return null; }
}

async function getWgerVideos(exerciseId: number): Promise<string | null> {
  try {
    const res = await fetch(`https://wger.de/api/v2/video/?exercise_base=${exerciseId}&format=json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.results || [];
    return results[0]?.video || null;
  } catch { return null; }
}

// ── Main API ──

export async function getExerciseDemo(exerciseName: string): Promise<CachedDemo | null> {
  const normalizedKey = exerciseName.toLowerCase().trim();

  // 1. Check IndexedDB cache first
  const cached = await getFromDB(normalizedKey);
  if (cached) {
    // Try to get cached blob URL
    const blobUrl = await getCachedAssetUrl(cached.url);
    if (blobUrl) {
      return { ...cached, cachedUrl: blobUrl };
    }
    // Cache Storage miss but we have the URL, return it for direct use
    return cached;
  }

  // 2. Search wger API
  try {
    const searchTerm = getSearchTerm(exerciseName);
    const exerciseId = await searchWgerExercise(searchTerm);
    if (!exerciseId) return null;

    // Try video first, then image
    let mediaUrl = await getWgerVideos(exerciseId);
    let mediaType: 'video' | 'image' = 'video';
    
    if (!mediaUrl) {
      mediaUrl = await getWgerImages(exerciseId);
      mediaType = 'image';
    }

    if (!mediaUrl) return null;

    // 3. Cache the asset
    const entry: CachedDemo = {
      exerciseName: normalizedKey,
      type: mediaType,
      url: mediaUrl,
      fetchedAt: Date.now(),
    };

    // Cache in both IndexedDB and Cache Storage
    await saveToDB(entry);
    const cacheSuccess = await cacheAsset(mediaUrl);
    
    if (cacheSuccess) {
      const blobUrl = await getCachedAssetUrl(mediaUrl);
      if (blobUrl) entry.cachedUrl = blobUrl;
    }

    return entry;
  } catch {
    return null;
  }
}

export async function getDemoCacheStats(): Promise<{ count: number; sizeKB: number }> {
  const entries = await getAllFromDB();
  let sizeKB = 0;
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.clone().blob();
        sizeKB += blob.size / 1024;
      }
    }
  } catch {}
  return { count: entries.length, sizeKB: Math.round(sizeKB) };
}

export async function clearDemoCache(): Promise<void> {
  await clearDB();
  try { await caches.delete(CACHE_NAME); } catch {}
}
