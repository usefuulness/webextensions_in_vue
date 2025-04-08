// This file contains global type definitions for the extension environment

// For the browser variable used in some extensions (Firefox compatibility)
declare var browser: typeof chrome;

// For import.meta extensions used in Vite and HMR
interface ImportMeta {
  readonly hot?: {
    readonly data: any;

    accept(): void;
    accept(cb: (newModule: any) => void): void;
    accept(dep: string, cb: (newModule: any) => void): void;
    accept(deps: readonly string[], cb: (newModules: any[]) => void): void;

    prune(cb: () => void): void;
    dispose(cb: (data: any) => void): void;
    decline(): void;
    invalidate(): void;

    on(event: string, cb: (...args: any[]) => void): void;
  };

  readonly env: {
    [key: string]: string | boolean | undefined;
    BASE_URL: string;
    MODE: string;
    DEV: boolean;
    PROD: boolean;
  };
}
