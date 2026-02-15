/**
 * Exercise Demo Cache Service
 * 
 * Fetches exercise images/videos from the Wger API,
 * caches them in Cache Storage for offline PWA use,
 * and tracks metadata in IndexedDB.
 */

import { getSearchTerm } from './exerciseMapping';

const CACHE_NAME = 'exercise-demos-v1';
const DB_NAME = 'exercise-demos';
const DB_VERSION = 1;
const STORE_NAME = 'demos';

export interface CachedDemo {
  exerciseName: string;
  type: 'image' | 'video';
  url: string;         // original URL
  cachedUrl: string;    // blob URL or cache match
  wgerExerciseId?: number;
  fetchedAt: number;
}

// ── IndexedDB helpers ──

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'exerciseName' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFromDB(exerciseName: string): Promise<CachedDemo | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(exerciseName.toLowerCase());
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveToDB(demo: CachedDemo): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ ...demo, exerciseName: demo.exerciseName.toLowerCase() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllFromDB(): Promise<CachedDemo[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function clearDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── Cache Storage helpers ──

async function cacheAsset(url: string): Promise<boolean> {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(url);
    return true;
  } catch {
    return false;
  }
}

async function getCachedAsset(url: string): Promise<Response | undefined> {
  try {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(url) || undefined;
  } catch {
    return undefined;
  }
}

// ── Wger API ──

interface WgerSearchResult {
  suggestions: Array<{
    data: {
      id: number;
      base_id: number;
      name: string;
      category: string;
      image: string | null;
      image_thumbnail: string | null;
    };
  }>;
}

interface WgerImage {
  id: number;
  image: string;
  is_main: boolean;
}

interface WgerVideo {
  id: number;
  video: string;
  exercise_base: number;
}

async function searchExercise(term: string): Promise<{ exerciseBaseId: number; imageUrl?: string } | null> {
  try {
    // Use Wger search API
    const resp = await fetch(
      `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(term)}&language=en&format=json`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!resp.ok) return null;

    const data: WgerSearchResult = await resp.json();
    if (!data.suggestions || data.suggestions.length === 0) return null;

    const best = data.suggestions[0].data;
    return {
      exerciseBaseId: best.base_id,
      imageUrl: best.image || best.image_thumbnail || undefined,
    };
  } catch {
    return null;
  }
}

async function getExerciseVideo(baseId: number): Promise<string | null> {
  try {
    const resp = await fetch(
      `https://wger.de/api/v2/video/?exercise_base=${baseId}&format=json`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].video;
    }
    return null;
  } catch {
    return null;
  }
}

async function getExerciseImages(baseId: number): Promise<string | null> {
  try {
    const resp = await fetch(
      `https://wger.de/api/v2/exerciseimage/?exercise_base=${baseId}&format=json`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.results && data.results.length > 0) {
      // Prefer main image
      const main = data.results.find((img: WgerImage) => img.is_main);
      return (main || data.results[0]).image;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Public API ──

export type DemoResult = {
  type: 'image' | 'video';
  url: string; // blob URL from cache or network URL
} | null;

/**
 * Get exercise demo. Checks cache first, then fetches from Wger.
 * Returns null if offline and not cached, or no demo found.
 */
export async function getExerciseDemo(exerciseName: string): Promise<DemoResult> {
  // 1. Check IndexedDB cache
  const cached = await getFromDB(exerciseName);
  if (cached) {
    // Try to serve from Cache Storage
    const cachedResp = await getCachedAsset(cached.url);
    if (cachedResp) {
      const blob = await cachedResp.blob();
      return { type: cached.type, url: URL.createObjectURL(blob) };
    }
    // Cache miss but we know the URL — try to re-fetch if online
    if (navigator.onLine) {
      const success = await cacheAsset(cached.url);
      if (success) {
        const resp = await getCachedAsset(cached.url);
        if (resp) {
          const blob = await resp.blob();
          return { type: cached.type, url: URL.createObjectURL(blob) };
        }
      }
    }
    return null;
  }

  // 2. If offline, can't fetch
  if (!navigator.onLine) return null;

  // 3. Search Wger
  const searchTerm = getSearchTerm(exerciseName);
  const result = await searchExercise(searchTerm);
  if (!result) return null;

  // 4. Try video first, then images
  let mediaUrl: string | null = null;
  let mediaType: 'video' | 'image' = 'image';

  const videoUrl = await getExerciseVideo(result.exerciseBaseId);
  if (videoUrl) {
    mediaUrl = videoUrl;
    mediaType = 'video';
  } else {
    // Try images from detail endpoint
    const imageUrl = await getExerciseImages(result.exerciseBaseId);
    if (imageUrl) {
      mediaUrl = imageUrl;
      mediaType = 'image';
    } else if (result.imageUrl) {
      // Fallback to search result thumbnail
      mediaUrl = result.imageUrl;
      mediaType = 'image';
    }
  }

  if (!mediaUrl) return null;

  // 5. Cache the asset
  const cacheSuccess = await cacheAsset(mediaUrl);

  // 6. Save metadata to IndexedDB
  await saveToDB({
    exerciseName,
    type: mediaType,
    url: mediaUrl,
    cachedUrl: mediaUrl,
    wgerExerciseId: result.exerciseBaseId,
    fetchedAt: Date.now(),
  });

  // 7. Return
  if (cacheSuccess) {
    const resp = await getCachedAsset(mediaUrl);
    if (resp) {
      const blob = await resp.blob();
      return { type: mediaType, url: URL.createObjectURL(blob) };
    }
  }

  // If caching failed, serve direct URL (won't work offline but works now)
  return { type: mediaType, url: mediaUrl };
}

/**
 * Check if a demo is cached (fast, no network)
 */
export async function isDemoCached(exerciseName: string): Promise<boolean> {
  try {
    const cached = await getFromDB(exerciseName);
    return !!cached;
  } catch {
    return false;
  }
}

/**
 * Get cache stats
 */
export async function getDemoCacheStats(): Promise<{ count: number; sizeEstimate: string }> {
  try {
    const all = await getAllFromDB();
    // Estimate size from Cache Storage
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const est = await navigator.storage.estimate();
      const usedMB = ((est.usage || 0) / (1024 * 1024)).toFixed(1);
      return { count: all.length, sizeEstimate: `${usedMB} MB` };
    }
    return { count: all.length, sizeEstimate: 'unknown' };
  } catch {
    return { count: 0, sizeEstimate: '0 MB' };
  }
}

/**
 * Clear all cached demos
 */
export async function clearDemoCache(): Promise<void> {
  await clearDB();
  try {
    await caches.delete(CACHE_NAME);
  } catch {
    // ignore
  }
}
