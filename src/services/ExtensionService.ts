/**
 * Service for communicating between different parts of the extension
 */

import { ExtensionMessage, BackgroundResponse, UserPreferences, ExtensionData, PageInfo } from '@/types';

/**
 * Send a message to the background script
 */
export const sendMessageToBackground = async <T = any>(
  message: ExtensionMessage
): Promise<BackgroundResponse<T>> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response: BackgroundResponse<T>) => {
      resolve(response || { success: false, error: 'No response from background script' });
    });
  });
};

/**
 * Send a message to the active tab's content script
 */
export const sendMessageToContentScript = async <T = any>(
  message: ExtensionMessage
): Promise<BackgroundResponse<T>> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: string | any[]) => {
      if (tabs.length === 0) {
        resolve({ success: false, error: 'No active tab found' });
        return;
      }
      
      const tabId = tabs[0].id;
      if (!tabId) {
        resolve({ success: false, error: 'Active tab has no ID' });
        return;
      }
      
      chrome.tabs.sendMessage(tabId, message, (response: BackgroundResponse<T>) => {
        resolve(response || { success: false, error: 'No response from content script' });
      });
    });
  });
};

/**
 * Get user preferences from storage
 */
export const getUserPreferences = async (): Promise<UserPreferences> => {
  const defaultPreferences: UserPreferences = {
    theme: 'light',
    notifications: true,
    updateInterval: 15
  };
  
  return new Promise((resolve) => {
    chrome.storage.local.get(['preferences'], (result: { [key: string]: any }) => {
      resolve(result.preferences ? { ...defaultPreferences, ...result.preferences } : defaultPreferences);
    });
  });
};

/**
 * Save user preferences to storage
 */
export const saveUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ preferences }, () => {
      resolve();
    });
  });
};

/**
 * Get extension data from storage
 */
export const getExtensionData = async (): Promise<ExtensionData> => {
  const defaultData: ExtensionData = {
    lastUsed: new Date().toISOString()
  };
  
  return new Promise((resolve) => {
    chrome.storage.local.get(['data'], (result: { [key: string]: any }) => {
      resolve(result.data ? { ...defaultData, ...result.data } : defaultData);
    });
  });
};

/**
 * Analyze the current page using the content script
 */
export const analyzePage = async (): Promise<PageInfo | null> => {
  const response = await sendMessageToContentScript<PageInfo>({
    type: 'ANALYZE_PAGE'
  });
  
  return response.success && response.data ? response.data : null;
};
/**
 * Update extension data in storage
 */
export const updateExtensionData = async (data: Partial<ExtensionData>): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({
      data: {
        ...data,
        lastUpdated: new Date().toISOString()
      } as ExtensionData
    }, () => {
      resolve();
    });
  });
}
/**
 * Clear extension data in storage
 */
export const clearExtensionData = async (): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['data'], () => {
      resolve();
    });
  });
}
