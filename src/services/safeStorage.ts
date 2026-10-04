type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

const memory = new Map<string, string>();
let native: StorageLike | null | undefined;

const getNative = (): StorageLike | null => {
  if (native !== undefined) return native;
  try {
    const mod = require('@react-native-async-storage/async-storage');
    native = (mod.default ?? mod) as StorageLike;
  } catch {
    native = null;
  }
  return native;
};

export const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const store = getNative();
      if (store) return await store.getItem(key);
    } catch {
      native = null;
    }
    return memory.get(key) ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    memory.set(key, value);
    try {
      const store = getNative();
      if (store) await store.setItem(key, value);
    } catch {
      native = null;
    }
  },
};
