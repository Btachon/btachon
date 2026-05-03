import { useState, useEffect } from 'react';

function readItem<T>(prefixedKey: string, initialValue: T): T {
  try {
    const raw = window.localStorage.getItem(prefixedKey);
    if (raw === null) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Stored without JSON.stringify (legacy) — return raw string as-is
      return raw as unknown as T;
    }
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const prefixedKey = `btachon:${key}`;

  const [storedValue, setStoredValue] = useState<T>(() =>
    readItem(prefixedKey, initialValue),
  );

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
      window.dispatchEvent(new Event(`local-storage-${prefixedKey}`));
    } catch {
      // silently ignore write failures (e.g. private mode storage full)
    }
  };

  useEffect(() => {
    const handleChange = () => setStoredValue(readItem(prefixedKey, initialValue));
    const handleStorage = (e: StorageEvent) => {
      if (e.key === prefixedKey) handleChange();
    };
    window.addEventListener(`local-storage-${prefixedKey}`, handleChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(`local-storage-${prefixedKey}`, handleChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [prefixedKey]);

  return [storedValue, setValue] as const;
}
