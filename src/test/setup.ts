import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

if (typeof window.localStorage.clear !== 'function') {
  const values = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };

  Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
}

beforeEach(() => {
  window.localStorage.clear();
});
