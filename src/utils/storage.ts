/**
 * Type-safe local storage utilities
 */

export class StorageError extends Error {
  constructor(message: string, public readonly key: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Set an item in localStorage with JSON serialization
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    throw new StorageError(`Failed to store item: ${error}`, key);
  }
}

/**
 * Get an item from localStorage with JSON deserialization
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Failed to parse stored item "${key}":`, error);
    return null;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    throw new StorageError(`Failed to remove item: ${error}`, key);
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    throw new StorageError('Failed to clear storage', '');
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { used: number; available: number } {
  let used = 0;
  
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
  } catch {
    // Fallback if localStorage is not accessible
  }

  // Most browsers allow ~5-10MB for localStorage
  const available = 5 * 1024 * 1024; // 5MB estimate
  
  return { used, available };
}
