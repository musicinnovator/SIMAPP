export type StorageNamespace = 'preferences' | 'progress' | 'arrangements' | 'custom-texts' | 'sessions';

export interface StorageProvider {
  get<T>(namespace: StorageNamespace, key: string): Promise<T | null>;
  set<T>(namespace: StorageNamespace, key: string, value: T): Promise<void>;
  remove(namespace: StorageNamespace, key: string): Promise<void>;
}

const databaseName = 'scripture-in-music';
const databaseVersion = 1;
const storeName = 'records';

function recordKey(namespace: StorageNamespace, key: string) {
  return `${namespace}:${key}`;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);
    request.onerror = () => reject(request.error ?? new Error('Unable to open local storage.'));
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) {
        request.result.createObjectStore(storeName);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

export class IndexedDbStorageProvider implements StorageProvider {
  async get<T>(namespace: StorageNamespace, key: string): Promise<T | null> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName, 'readonly').objectStore(storeName).get(recordKey(namespace, key));
      request.onerror = () => reject(request.error ?? new Error('Unable to read local storage.'));
      request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
    });
  }

  async set<T>(namespace: StorageNamespace, key: string, value: T): Promise<void> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName, 'readwrite').objectStore(storeName).put(value, recordKey(namespace, key));
      request.onerror = () => reject(request.error ?? new Error('Unable to write local storage.'));
      request.onsuccess = () => resolve();
    });
  }

  async remove(namespace: StorageNamespace, key: string): Promise<void> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName, 'readwrite').objectStore(storeName).delete(recordKey(namespace, key));
      request.onerror = () => reject(request.error ?? new Error('Unable to delete local storage.'));
      request.onsuccess = () => resolve();
    });
  }
}

export class ElectronStorageProvider implements StorageProvider {
  async get<T>(namespace: StorageNamespace, key: string): Promise<T | null> {
    if (!window.simappDesktop) return null;
    const result = await window.simappDesktop.getJson(`${namespace}-${key}`);
    return (result.value as T | null) ?? null;
  }

  async set<T>(namespace: StorageNamespace, key: string, value: T): Promise<void> {
    if (!window.simappDesktop) return;
    await window.simappDesktop.saveJson(`${namespace}-${key}`, value);
  }

  async remove(namespace: StorageNamespace, key: string): Promise<void> {
    if (!window.simappDesktop) return;
    await window.simappDesktop.deleteJson(`${namespace}-${key}`);
  }
}

export function createStorageProvider(): StorageProvider {
  if (typeof window !== 'undefined' && window.simappDesktop) return new ElectronStorageProvider();
  if (typeof indexedDB !== 'undefined') return new IndexedDbStorageProvider();
  throw new Error('No local storage provider is available.');
}

export const localStorageProvider = typeof window !== 'undefined' ? createStorageProvider() : null;
