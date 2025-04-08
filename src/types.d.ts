// Type definitions for the extension

// Extension message types
export interface ExtensionMessage {
  type: string;
  [key: string]: any;
}

// Response from background script
export interface BackgroundResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// User preferences stored in extension storage
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  updateInterval: number;
}

// Extension data stored in storage
export interface ExtensionData {
  lastUsed: string;
  lastUpdated?: string;
}

// Page info collected by content script
export interface PageInfo {
  title: string;
  url: string;
  headings: {
    level: string;
    text: string;
  }[];
  links: number;
  images: number;
}

// Declare global HMR interface for TypeScript
declare global {
  interface ImportMeta {
    hot?: {
      accept: (callback?: (modules: any) => void) => void;
      dispose: (callback: (data: any) => void) => void;
      data: any;
      on: (event: string, callback: (...args: any[]) => void) => void;
    };
    env: {
      MODE: string;
      PROD: boolean;
      DEV: boolean;
    };
  }
}