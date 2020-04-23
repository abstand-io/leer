const STORE = localStorage;
const NAMESPACE = 'leer.im';

function getItem(key, d) {
	let val = STORE.getItem(`${NAMESPACE}:${key}`);
	return val ? JSON.parse(val) : d;
}

function setItem(key, val) {
	key = `${NAMESPACE}:${key}`;
	val ? STORE.setItem(key, JSON.stringify(val)) : STORE.removeItem(key);
}

export function getFavorites() {
  const favoriteIds = getItem('favorites', []);
  if (favoriteIds != null) {
    return favoriteIds.map(f => getItem(f));
  }
  return [];
}

export function toggleFavorite(place) {
  const favoriteIds = getItem('favorites', []);
  const index = favoriteIds.indexOf(place.place_id);
  if (index === -1) {
    setItem('favorites', [...favoriteIds, place.place_id]);
    setItem(place.place_id, { ...place, week: null, now: null });
    return true;
  } else {
    setItem('favorites', [...favoriteIds.slice(0, index), ...favoriteIds.slice(index + 1)]);
    setItem(place.place_id);
    return false;
  }
}
