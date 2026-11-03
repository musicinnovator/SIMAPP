import type { StorageNamespace } from './storage';

export interface SyncProvider {
  isAvailable(): boolean;
  push(namespace: StorageNamespace, key: string, value: unknown): Promise<void>;
  pull<T>(namespace: StorageNamespace, key: string): Promise<T | null>;
}

export class NoopSyncProvider implements SyncProvider {
  isAvailable() {
    return false;
  }

  async push() {
    // Local-first mode intentionally does nothing until the user enables sync.
  }

  async pull<T>(): Promise<T | null> {
    return null;
  }
}

export function createOptionalSyncProvider(): SyncProvider {
  return new NoopSyncProvider();
}
