import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const prefixedKey = `btachon:${key}`;
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${prefixedKey}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
      
      // Dispatch a custom event so other instances can update
      window.dispatchEvent(new Event(`local-storage-${prefixedKey}`));
    } catch (error) {
      console.warn(`Error setting localStorage key "${prefixedKey}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      try {
        const item = window.localStorage.getItem(prefixedKey);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(error);
      }
    };
    
    // Also listen to standard storage events for cross-tab sync
    const handleStandardStorage = (e: StorageEvent) => {
      if (e.key === prefixedKey && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener(`local-storage-${prefixedKey}`, handleStorageChange);
    window.addEventListener('storage', handleStandardStorage);
    
    return () => {
      window.removeEventListener(`local-storage-${prefixedKey}`, handleStorageChange);
      window.removeEventListener('storage', handleStandardStorage);
    };
  }, [prefixedKey]);

  return [storedValue, setValue] as const;
}