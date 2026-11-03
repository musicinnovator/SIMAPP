export {};

declare global {
  interface Window {
    simappDesktop?: {
      saveJson(key: string, value: unknown): Promise<{ ok: boolean; key?: string }>;
      getJson(key: string): Promise<{ ok: boolean; value: unknown | null }>;
      deleteJson(key: string): Promise<{ ok: boolean }>;
      saveRecording(payload: { filename: string; bytes: number[] }): Promise<{ ok: boolean; canceled?: boolean; path?: string }>;
    };
  }
}
