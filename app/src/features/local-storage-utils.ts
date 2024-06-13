export function setLocalStorageItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getParsedLocalStorageItem<T>(key: string, initialValue: T) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : initialValue;
}
