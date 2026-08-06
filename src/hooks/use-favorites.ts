import { useCallback, useSyncExternalStore } from "react";

const KEY = "docify:favorites";

let favorites: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    favorites = read();
  }
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      favorites = read();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  return favorites;
}

const EMPTY: string[] = [];
function getServerSnapshot() {
  return EMPTY;
}

function persist(next: string[]) {
  favorites = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  emit();
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: string) => {
    const current = favorites;
    persist(current.includes(id) ? current.filter((f) => f !== id) : [...current, id]);
  }, []);

  const remove = useCallback((id: string) => {
    persist(favorites.filter((f) => f !== id));
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { favorites: ids, toggle, remove, isFavorite };
}
