import localforage from 'localforage';

const STORE = localforage;
const NAMESPACE = 'leer.im';

async function getItem(key) {
	return await STORE.getItem(`${NAMESPACE}:${key}`);
}

async function setItem(key, val) {
  key = `${NAMESPACE}:${key}`;
  if (val) {
    return await STORE.setItem(key, val);
  }
	return await STORE.removeItem(key);
}

export async function getFavorites() {
  const favoriteIds = await getItem('favorites');
  if (favoriteIds != null) {
    const favorites = [];
    for (const id of favoriteIds) {
      const favorite = await getItem(id);
      favorites.push(favorite);
    }
    return favorites;
  }
  return [];
}

export async function toggleFavorite(place) {
  const favoriteIds = await getItem('favorites');
  if (favoriteIds != null) {
    const index = favoriteIds.indexOf(place.place_id);
    if (index === -1) {
      await setItem('favorites', [...favoriteIds, place.place_id]);
      await setItem(place.place_id, { ...place, week: null, now: null });
      return true;
    } else {
      await setItem('favorites', [...favoriteIds.slice(0, index), ...favoriteIds.slice(index + 1)]);
      await setItem(place.place_id);
      return false;
    }
  }
  await setItem('favorites', [place.place_id]);
  await setItem(place.place_id, { ...place, week: null, now: null });
  return true;
}
