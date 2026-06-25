import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORES_FILE = join(__dirname, '../../data/stores.json');
const SEARCH_RADIUS_KM = 5.0;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dlat = ((lat2 - lat1) * Math.PI) / 180;
  const dlon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dlon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function loadStores() {
  try {
    return JSON.parse(readFileSync(STORES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function findStoresByLocation(lat, lon, radiusKm = SEARCH_RADIUS_KM) {
  const stores = loadStores();
  const results = [];
  for (const store of stores) {
    if (store.lat == null || store.lon == null) continue;
    const dist = haversine(lat, lon, parseFloat(store.lat), parseFloat(store.lon));
    if (dist <= radiusKm) {
      results.push({ ...store, distance_km: Math.round(dist * 100) / 100 });
    }
  }
  results.sort((a, b) => a.distance_km - b.distance_km);
  return results.slice(0, 5);
}

export function findNearestStore(lat, lon) {
  const stores = loadStores();
  let nearest = null;
  let minDist = Infinity;
  for (const store of stores) {
    if (store.lat == null || store.lon == null) continue;
    const dist = haversine(lat, lon, parseFloat(store.lat), parseFloat(store.lon));
    if (dist < minDist) {
      minDist = dist;
      nearest = { ...store, distance_km: Math.round(dist * 100) / 100 };
    }
  }
  return nearest;
}

export function findStoresByRegion(region) {
  const stores = loadStores();
  return stores.filter((s) => (s.region || '').toLowerCase().includes(region.toLowerCase()));
}
